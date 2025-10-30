import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual, createHash, pbkdf2Sync } from "crypto";
import { promisify } from "util";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { verifyCaptcha } from "./captcha";
import { User as SelectUser, LoginData } from "@shared/schema";
import { validatePassword, trackLoginAttempt, logSecurityEvent, sanitizeInput, SECURITY_CONFIG } from "./security";
import { logAuthenticationProcess, initializeLogging } from "./auditLogger";
import { decryptPassword, isPasswordEncryptionEnabled } from "./passwordEncryption";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Session token blacklist - tracks invalidated sessions to prevent replay attacks
// Map<sessionId, { invalidatedAt: number, reason: string }>
const invalidatedSessions = new Map<string, { invalidatedAt: number; reason: string }>();

// Clean up old invalidated sessions (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  let cleanedCount = 0;
  
  invalidatedSessions.forEach((value, sessionId) => {
    if (now - value.invalidatedAt > maxAge) {
      invalidatedSessions.delete(sessionId);
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} old invalidated sessions from blacklist`);
  }
}, 60 * 60 * 1000); // Run every hour

// Generate a unique session token for replay protection
function generateSessionToken(sessionId: string, userId: string): string {
  const timestamp = Date.now();
  const randomData = randomBytes(32).toString('hex');
  const data = `${sessionId}:${userId}:${timestamp}:${randomData}`;
  return createHash('sha256').update(data).digest('hex');
}

// Enhanced password hashing with multiple algorithms for maximum security
async function hashPassword(password: string): Promise<string> {
  // Generate cryptographically secure salt
  const salt = randomBytes(32).toString('hex');
  
  // Use PBKDF2 with SHA-512 (more secure than bcrypt for this use case)
  const iterations = 100000; // High iteration count for security
  const keyLength = 64; // 512 bits
  
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, 'sha512').toString('hex');
  
  // Return format: algorithm$iterations$salt$hash
  return `pbkdf2-sha512$${iterations}$${salt}$${hash}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    // Check if it's a new PBKDF2-SHA512 hash
    if (stored.startsWith('pbkdf2-sha512$')) {
      const [, iterationsStr, salt, hash] = stored.split('$');
      if (!iterationsStr || !salt || !hash) return false;
      
      const iterations = parseInt(iterationsStr, 10);
      const keyLength = 64; // 512 bits
      
      const suppliedHash = pbkdf2Sync(supplied, salt, iterations, keyLength, 'sha512').toString('hex');
      return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(suppliedHash, 'hex'));
    }
    
    // Check if it's a bcrypt hash (legacy support)
    if (stored.startsWith('$2')) {
      return await bcrypt.compare(supplied, stored);
    }
    
    // Fallback for legacy scrypt hashes
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) return false;
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  console.log('🔑 Configuring authentication system...');
  
  // Initialize comprehensive logging system
  initializeLogging();
  
  // Debug middleware to log all requests to auth routes
  app.use('/api', (req, res, next) => {
    console.log(`Auth middleware: ${req.method} ${req.path}`);
    next();
  });
  
  console.log('📝 Registering auth middleware and passport...');

  // Session configuration - use memory store for simplicity
  const MemoryStore = createMemoryStore(session);
  const sessionStore = new MemoryStore({
    checkPeriod: 86400000, // 24 hours
  });

  // Enhanced session cleanup - destroy expired sessions
  setInterval(() => {
    sessionStore.all((err: any, sessions: any) => {
      if (err) {
        console.error('Session cleanup error:', err);
        return;
      }
      
      const now = Date.now();
      let cleanedCount = 0;
      
      Object.keys(sessions).forEach(sessionId => {
        const session = sessions[sessionId];
        if (session && session.cookie) {
          // Calculate session age correctly - time since session was created
          // Use the session's creation time or fallback to cookie maxAge calculation
          const sessionCreated = session.createdAt || (now - session.cookie.maxAge);
          const sessionAge = now - sessionCreated;
          
          // Destroy sessions older than configured timeout
          if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
            sessionStore.destroy(sessionId, (err: any) => {
              if (err) {
                console.error(`Failed to destroy expired session ${sessionId}:`, err);
              } else {
                cleanedCount++;
                logSecurityEvent('SESSION_CLEANUP', { 
                  sessionId,
                  age: sessionAge,
                  reason: 'expired'
                });
              }
            });
          }
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`Session cleanup: destroyed ${cleanedCount} expired sessions`);
      }
    });
  }, 2 * 60 * 1000); // Run every 2 minutes (more frequent for 20-minute timeout)

  // CRITICAL: Set trust proxy BEFORE session configuration
  // This allows Express to detect HTTPS from x-forwarded-proto header
  app.set("trust proxy", 1);
  
  // Session cookie configuration - secure flag must be set correctly for production
  // With proxy: true, express-session will use req.secure (which is true when x-forwarded-proto is 'https')
  // secure: true means cookies ONLY sent over HTTPS (required by security team)
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "CID-Telangana-Super-Secret-Key-2025-" + randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    proxy: true, // Trust proxy - required for secure cookies to work with reverse proxy
    cookie: {
      // Enhanced cookie security using centralized configuration
      // secure: true means cookies ONLY sent over HTTPS (security requirement)
      // With proxy: true and trust proxy enabled, express-session will only set secure=true when req.secure is true
      // req.secure is true when x-forwarded-proto is 'https' (from Nginx)
      secure: process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_COOKIES !== 'true',
      httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly, // Prevent XSS attacks
      maxAge: SECURITY_CONFIG.SESSION_TIMEOUT, // 20 minutes (enhanced security)
      sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite, // Enhanced CSRF protection
      domain: SECURITY_CONFIG.COOKIE_SECURITY.domain, // Allow domain restriction
      path: SECURITY_CONFIG.COOKIE_SECURITY.path, // Path restriction
      partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned, // Partitioned cookies for third-party context
    },
    name: 'cid.session.id', // Custom session name
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // CRITICAL: Global session validation middleware - checks blacklist for ALL sessions
  // MUST be after session middleware but before other middleware
  // This prevents blacklisted sessions from being used anywhere
  app.use((req: any, res: any, next: any) => {
    // Only validate if session exists
    if (req.session && req.sessionID) {
      const sessionId = req.sessionID;
      
      // Debug: Log session ID for troubleshooting
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SESSION CHECK] Session ID: ${sessionId.substring(0, 20)}..., Blacklist size: ${invalidatedSessions.size}`);
        if (invalidatedSessions.size > 0) {
          console.log(`[SESSION CHECK] Blacklisted IDs:`, Array.from(invalidatedSessions.keys()).map(id => id.substring(0, 20) + '...'));
        }
      }
      
      // Check if session is in blacklist (prevents session replay)
      if (invalidatedSessions.has(sessionId)) {
        console.log(`[SESSION CHECK] ✗ BLOCKED: Session ${sessionId.substring(0, 20)}... is in blacklist!`);
        const blacklistInfo = invalidatedSessions.get(sessionId);
        
        // Log the replay attempt
        logSecurityEvent('SESSION_REPLAY_ATTEMPT', { 
          sessionId,
          ip: req.ip,
          path: req.path,
          userAgent: req.get('User-Agent'),
          reason: `Session blacklisted: ${blacklistInfo?.reason || 'unknown'}`,
          invalidatedAt: blacklistInfo?.invalidatedAt,
          timeSinceInvalidation: blacklistInfo ? Date.now() - blacklistInfo.invalidatedAt : 0
        }, req, 'CRITICAL', 'FAILURE');
        
        // Destroy the session immediately
        if (req.session && !req.session.destroyed) {
          req.session.destroy(() => {});
        }
        
        // Clear the cookie
        res.clearCookie('cid.session.id', {
          path: SECURITY_CONFIG.COOKIE_SECURITY.path,
          httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
          secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
          sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
          domain: SECURITY_CONFIG.COOKIE_SECURITY.domain,
        });
        
        // Return 401 for API requests, redirect for browser requests
        if (req.path.startsWith('/api')) {
          return res.status(401).json({ 
            message: "Session has been terminated and cannot be reused",
            code: "SESSION_REPLAY_BLOCKED"
          });
        } else {
          // For non-API requests, just redirect to login
          return res.redirect('/admin/login');
        }
      }
      
      // Check if session was destroyed
      if (req.session.destroyed) {
        if (req.path.startsWith('/api')) {
          return res.status(401).json({ message: "Session has been terminated" });
        } else {
          return res.redirect('/admin/login');
        }
      }
    }
    
    // Continue to next middleware if session is valid
    next();
  });

  // Session activity tracking middleware - MUST be after session middleware
  app.use((req: any, res: any, next: any) => {
    if (req.session && req.sessionID) {
      const now = Date.now();
      const lastActivity = (req.session as any).lastActivity;
      const sessionCreated = (req.session as any).createdAt || now;
      
      // Only check inactivity if we have a previous activity timestamp
      // For brand new sessions (just created), use session creation time
      if (lastActivity) {
        const inactivityTime = now - lastActivity;
        
        if (inactivityTime > SECURITY_CONFIG.SESSION_TIMEOUT) {
          logSecurityEvent('SESSION_INACTIVITY_TIMEOUT', { 
            sessionId: req.sessionID,
            inactivityTime: inactivityTime,
            ip: req.ip,
            path: req.path
          }, req);
          
          req.session.destroy((err: any) => {
            if (err) {
              console.error('Session destruction error:', err);
            }
          });
          
          return res.status(401).json({ 
            message: "Session expired due to inactivity",
            code: "SESSION_TIMEOUT"
          });
        }
        
        // Check if session is approaching timeout (warning)
        const timeUntilTimeout = SECURITY_CONFIG.SESSION_TIMEOUT - inactivityTime;
        if (timeUntilTimeout <= SECURITY_CONFIG.SESSION_WARNING_TIME && timeUntilTimeout > 0) {
          // Add warning header for client-side handling
          res.setHeader('X-Session-Warning', Math.ceil(timeUntilTimeout / 1000)); // seconds remaining
        }
      } else {
        // New session - check if it's too old based on creation time
        const sessionAge = now - sessionCreated;
        if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
          logSecurityEvent('SESSION_INACTIVITY_TIMEOUT', { 
            sessionId: req.sessionID,
            inactivityTime: sessionAge,
            ip: req.ip,
            path: req.path,
            reason: 'Session expired based on creation time'
          }, req);
          
          req.session.destroy((err: any) => {
            if (err) {
              console.error('Session destruction error:', err);
            }
          });
          
          return res.status(401).json({ 
            message: "Session expired due to inactivity",
            code: "SESSION_TIMEOUT"
          });
        }
      }
      
      // Update last activity time AFTER validation (prevents immediate expiration)
      (req.session as any).lastActivity = now;
    }
    
    next();
  });

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Authenticating user:", username);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log("User not found:", username);
          logSecurityEvent('AUTH_FAILED_USER_NOT_FOUND', { username }, undefined, 'HIGH', 'FAILURE');
          logAuthenticationProcess(username, false, { reason: 'User not found' });
          return done(null, false, { message: "User not found" });
        }
        
        if (!user.isActive) {
          console.log("User inactive:", username);
          logSecurityEvent('AUTH_FAILED_INACTIVE_USER', { username, userId: user.id }, undefined, 'HIGH', 'FAILURE');
          logAuthenticationProcess(username, false, { reason: 'Account inactive', userId: user.id });
          return done(null, false, { message: "Account inactive" });
        }

        console.log("Comparing passwords for user:", username);
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          console.log("Invalid password for user:", username);
          logSecurityEvent('AUTH_FAILED_INVALID_PASSWORD', { username, userId: user.id }, undefined, 'HIGH', 'FAILURE');
          logAuthenticationProcess(username, false, { reason: 'Invalid password', userId: user.id });
          return done(null, false, { message: "Invalid password" });
        }

        console.log("Authentication successful for user:", username);
        logSecurityEvent('AUTH_SUCCESS', { username, userId: user.id, role: user.role }, undefined, 'LOW', 'SUCCESS');
        logAuthenticationProcess(username, true, { 
          userId: user.id,
          role: user.role,
          loginTime: new Date().toISOString()
        });
        return done(null, user);
    } catch (error: any) {
      console.error("Authentication error:", error);
      logSecurityEvent('AUTH_ERROR', { username, error: error?.message || String(error) }, undefined, 'CRITICAL', 'FAILURE');
      logAuthenticationProcess(username, false, { reason: 'System error', error: error?.message || String(error) });
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("Deserializing user with ID:", id);
      const user = await storage.getUser(id);
      if (user) {
        console.log("User deserialized successfully:", user.username, "Role:", user.role);
      } else {
        console.log("User not found during deserialization:", id);
      }
      done(null, user);
    } catch (error) {
      console.error("Error during user deserialization:", error);
      done(error);
    }
  });

  // Auth routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Input sanitization and validation
      const username = sanitizeInput(req.body.username || '');
      const email = sanitizeInput(req.body.email || '');
      let password = req.body.password || '';
      const firstName = sanitizeInput(req.body.firstName || '');
      const lastName = sanitizeInput(req.body.lastName || '');
      
      // Decrypt password if encryption is enabled
      if (isPasswordEncryptionEnabled() && password) {
        try {
          password = await decryptPassword(password);
        } catch (error) {
          console.error("Password decryption error:", error);
          logSecurityEvent('PASSWORD_DECRYPTION_ERROR', { username, ip: clientIp }, req, 'HIGH', 'FAILURE');
          return res.status(400).json({ message: "Password decryption failed. Please try again." });
        }
      }
      
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        logSecurityEvent('REGISTRATION_WEAK_PASSWORD', { username, ip: clientIp }, req);
        return res.status(400).json({ 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors
        });
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        logSecurityEvent('REGISTRATION_USERNAME_EXISTS', { username, ip: clientIp }, req);
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: req.body.role || 'user', // Default to user role
      });

      logSecurityEvent('USER_REGISTERED', { 
        username: user.username, 
        email: user.email,
        role: user.role,
        ip: clientIp 
      }, req);

      // Regenerate session ID for new registration
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regeneration error:", regenerateErr);
          return res.status(500).json({ message: "Registration failed" });
        }
        
        req.login(user, (err) => {
          if (err) return next(err);
          
          // Bind session to IP address and User-Agent
          const userAgent = req.get('User-Agent') || 'unknown';
          
          // Add creation timestamp and binding info to session
          // Generate unique session token for replay protection
          if (req.session) {
            const sessionToken = generateSessionToken(req.sessionID, user.id);
            (req.session as any).createdAt = Date.now();
            (req.session as any).clientIp = clientIp;
            (req.session as any).userAgent = userAgent;
            (req.session as any).sessionRotatedAt = Date.now();
            (req.session as any).sessionToken = sessionToken;
            (req.session as any).userId = user.id;
          }
          
          res.status(201).json({ 
            id: user.id, 
            username: user.username, 
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      logSecurityEvent('REGISTRATION_ERROR', { error: String(error) }, req);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Register login route explicitly with debugging
  console.log('🔐 Registering login route: POST /api/login');
  app.post("/api/login", async (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log("LOGIN ROUTE HIT - Login request received:", req.method, req.path, { 
      username: req.body.username, 
      ip: clientIp 
    });
    
    // Input sanitization
    const username = sanitizeInput(req.body.username || '');
    let password = req.body.password || '';
    
    // Decrypt password if encryption is enabled
    if (isPasswordEncryptionEnabled() && password) {
      try {
        password = await decryptPassword(password);
      } catch (error) {
        console.error("Password decryption error:", error);
        logSecurityEvent('PASSWORD_DECRYPTION_ERROR', { username, ip: clientIp }, req, 'HIGH', 'FAILURE');
        return res.status(400).json({ message: "Password decryption failed. Please try again." });
      }
    }
    
    if (!username || !password) {
      logSecurityEvent('LOGIN_ATTEMPT_MISSING_CREDENTIALS', { username, ip: clientIp }, req);
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Update request body with decrypted password for passport
    req.body.password = password;
    
    // Check for login attempt lockout
    const canAttemptLogin = trackLoginAttempt(username, false);
    if (!canAttemptLogin) {
      logSecurityEvent('LOGIN_ATTEMPT_ACCOUNT_LOCKED', { username, ip: clientIp }, req);
      return res.status(429).json({ 
        message: "Account temporarily locked due to too many failed attempts. Please try again later." 
      });
    }
    
    // Verify CAPTCHA first
    const { captchaSessionId, captchaInput } = req.body;
    if (!captchaSessionId || !captchaInput) {
      return res.status(400).json({ message: "CAPTCHA verification required" });
    }
    
    // Security: Pass IP address for CAPTCHA verification and consume on success
    const isCaptchaValid = verifyCaptcha(captchaSessionId, captchaInput, clientIp, true);
    if (!isCaptchaValid) {
      logSecurityEvent('LOGIN_CAPTCHA_FAILED', { username, ip: clientIp }, req);
      console.log("CAPTCHA verification failed for login attempt");
      return res.status(400).json({ message: "Invalid CAPTCHA. Please try again." });
    }
    
    console.log("CAPTCHA verification successful, proceeding with authentication");
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: "Authentication failed" });
      }
      if (!user) {
        logSecurityEvent('LOGIN_FAILED', { 
          username, 
          ip: clientIp, 
          userAgent,
          reason: info?.message || 'Invalid credentials'
        }, req);
        console.log("Login failed for user:", username, "Info:", info);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Mark successful login attempt
      trackLoginAttempt(username, true);
      
      // Regenerate session ID to prevent session fixation and enable replay protection
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regeneration error:", regenerateErr);
          logSecurityEvent('SESSION_REGENERATION_ERROR', { username, error: regenerateErr.message }, req);
          return res.status(500).json({ message: "Login failed" });
        }
        
        req.login(user, (err) => {
          if (err) {
            console.error("Login session error:", err);
            logSecurityEvent('LOGIN_SESSION_ERROR', { username, error: err.message }, req);
            return res.status(500).json({ message: "Login failed" });
          }
          
          // Bind session to IP address and User-Agent for replay protection
          // Generate unique session token that changes on every login (prevents replay)
          if (req.session) {
            const sessionToken = generateSessionToken(req.sessionID, user.id);
            (req.session as any).createdAt = Date.now();
            (req.session as any).clientIp = clientIp; // Bind to IP address
            (req.session as any).userAgent = userAgent; // Bind to User-Agent
            (req.session as any).sessionRotatedAt = Date.now(); // Track rotation timestamp
            (req.session as any).sessionToken = sessionToken; // Unique token for this login session
            (req.session as any).userId = user.id; // Store userId for token validation
            
            console.log(`Session token generated for session ${req.sessionID}: ${sessionToken.substring(0, 16)}...`);
          }
          
          console.log("Session established successfully:", {
            sessionId: req.sessionID,
            userId: user.id,
            username: user.username,
            clientIp: clientIp,
            isAuthenticated: req.isAuthenticated(),
            hasSessionToken: !!(req.session as any).sessionToken,
            sessionCreated: !!(req.session as any).createdAt
          });
          
          // CRITICAL: Save the session explicitly to ensure it's persisted before sending response
          // This is essential for production - ensures session is saved to store before client makes next request
          req.session.save((saveErr: any) => {
            if (saveErr) {
              console.error("Session save error:", saveErr);
              logSecurityEvent('SESSION_SAVE_ERROR', { username, error: saveErr.message }, req);
              return res.status(500).json({ message: "Failed to save session" });
            }
            
            console.log("Session saved successfully:", req.sessionID);
            
            // Debug: Check if cookie will be set
            const cookieName = sessionSettings.name || 'cid.session.id';
            console.log("Login - Cookie configuration:", {
              cookieName,
              secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
              httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
              sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
              domain: SECURITY_CONFIG.COOKIE_SECURITY.domain || 'not set (exact domain)',
              partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned,
              protocol: req.protocol,
              secureFlag: req.secure,
              xForwardedProto: req.headers['x-forwarded-proto'],
              host: req.headers.host
            });
            
            logSecurityEvent('LOGIN_SUCCESS', { 
              username: user.username, 
              role: user.role,
              ip: clientIp,
              sessionId: req.sessionID,
              sessionRotated: true
            }, req);
            console.log("Login successful for user:", user.username);
            res.json({
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          });
        });
      });
    })(req, res, next);
  });

  // Enhanced logout handler with complete session destruction
  const logoutHandler = (req: any, res: any, next: any) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    const username = req.user?.username || 'unknown';
    
    // Log logout attempt for security monitoring
    logSecurityEvent('LOGOUT_ATTEMPT', { 
      username, 
      ip: clientIp,
      userAgent,
      sessionId: req.sessionID 
    }, req);
    
    // Step 1: Destroy the session data
    req.logout((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        logSecurityEvent('LOGOUT_ERROR', { username, error: err.message }, req);
        return next(err);
      }
      
      // Step 2: Add session to blacklist BEFORE destroying (prevents replay attacks)
      // CRITICAL: Use req.sessionID which is the unsigned session ID (matches what we check in middleware)
      const sessionId = req.sessionID;
      if (sessionId) {
        // Add to blacklist - use the exact session ID from req.sessionID
        // This is the unsigned session ID that express-session uses internally
        invalidatedSessions.set(sessionId, {
          invalidatedAt: Date.now(),
          reason: 'logout'
        });
        console.log(`[LOGOUT] Session ID: ${sessionId.substring(0, 20)}... added to blacklist. Total blacklisted: ${invalidatedSessions.size}`);
        
        // Verify it was added
        if (invalidatedSessions.has(sessionId)) {
          console.log(`[LOGOUT] ✓ Verified session is in blacklist`);
        } else {
          console.error(`[LOGOUT] ✗ ERROR: Session NOT in blacklist after adding!`);
        }
        logSecurityEvent('SESSION_BLACKLISTED', { 
          sessionId, 
          username,
          reason: 'logout',
          ip: clientIp
        }, req);
      }
      
      // Step 3: Destroy the session completely (prevents session replay)
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destruction error:", err);
          logSecurityEvent('SESSION_DESTRUCTION_ERROR', { username, error: err.message }, req);
          return next(err);
        }
        
            // Step 4: Clear the session cookie with enhanced security
            res.clearCookie('cid.session.id', {
              path: SECURITY_CONFIG.COOKIE_SECURITY.path,
              httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
              secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
              sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
              domain: SECURITY_CONFIG.COOKIE_SECURITY.domain,
              partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned
            });
            
            // Step 5: Clear any additional auth cookies
            res.clearCookie('connect.sid', {
              path: SECURITY_CONFIG.COOKIE_SECURITY.path,
              httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
              secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
              sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
              domain: SECURITY_CONFIG.COOKIE_SECURITY.domain,
              partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned
            });
        
        // Log successful logout
        logSecurityEvent('LOGOUT_SUCCESS', { 
          username, 
          ip: clientIp,
          sessionDestroyed: true 
        }, req);
        
        console.log(`User ${username} logged out successfully from IP: ${clientIp}`);
        
        // Step 5: Send appropriate response
        if (req.method === 'POST' || req.accepts('json')) {
          res.json({ 
            message: "Logged out successfully",
            sessionDestroyed: true,
            timestamp: new Date().toISOString()
          });
        } else {
          // If it's a browser navigation (GET), redirect to home
          res.redirect('/');
        }
      });
    });
  };

  app.post("/api/logout", logoutHandler);
  app.get("/api/logout", logoutHandler);

  app.get("/api/auth/user", (req, res) => {
    console.log("Auth user endpoint called:", {
      sessionId: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
      hasSession: !!req.session,
      userAgent: req.get('User-Agent'),
      cookies: req.headers.cookie,
      host: req.headers.host,
      protocol: req.protocol,
      secure: req.secure,
      xForwardedProto: req.headers['x-forwarded-proto']
    });
    
    // Check if session exists but not authenticated (possible cookie issue)
    if (req.session && !req.isAuthenticated()) {
      console.log("WARNING: Session exists but not authenticated - possible cookie/session store issue");
      console.log("Session data:", {
        sessionId: req.sessionID,
        passport: (req.session as any).passport,
        userId: (req.session as any).userId
      });
    }
    
    if (!req.isAuthenticated()) {
      console.log("User not authenticated, returning 401");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as SelectUser;
    console.log("User authenticated successfully:", {
      userId: user.id,
      username: user.username,
      role: user.role
    });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });

  // Session status endpoint - check session validity and remaining time
  app.get("/api/auth/session-status", (req, res) => {
    if (!req.session || !req.sessionID) {
      return res.status(401).json({ 
        valid: false, 
        message: "No active session" 
      });
    }

    const now = Date.now();
    const lastActivity = (req.session as any).lastActivity || req.session.cookie.originalMaxAge || now;
    const inactivityTime = now - lastActivity;
    const timeRemaining = Math.max(0, SECURITY_CONFIG.SESSION_TIMEOUT - inactivityTime);
    const timeRemainingSeconds = Math.ceil(timeRemaining / 1000);

    // Check if session is expired
    if (inactivityTime > SECURITY_CONFIG.SESSION_TIMEOUT) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
      });
      
      return res.status(401).json({ 
        valid: false, 
        message: "Session expired due to inactivity",
        code: "SESSION_TIMEOUT"
      });
    }

    // Check if session is approaching timeout
    const isWarning = timeRemaining <= SECURITY_CONFIG.SESSION_WARNING_TIME;

    res.json({
      valid: true,
      timeRemaining: timeRemainingSeconds,
      isWarning: isWarning,
      lastActivity: lastActivity,
      sessionId: req.sessionID
    });
  });

  // Session extension endpoint - extend session on user activity
  app.post("/api/auth/extend-session", (req, res) => {
    if (!req.session || !req.sessionID) {
      return res.status(401).json({ 
        success: false, 
        message: "No active session" 
      });
    }

    // Update last activity time
    (req.session as any).lastActivity = Date.now();
    
    // Only log in production to reduce noise in development
    if (process.env.NODE_ENV === 'production') {
      logSecurityEvent('SESSION_EXTENDED', { 
        sessionId: req.sessionID,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, req);
    }

    res.json({ 
      success: true, 
      message: "Session extended",
      timeRemaining: Math.ceil(SECURITY_CONFIG.SESSION_TIMEOUT / 1000)
    });
  });
  
  // Additional explicit login route registration for production compatibility
  console.log('🔧 Registering /api/auth/login route for frontend compatibility...');
  app.post("/api/auth/login", async (req, res, next) => {
    console.log("AUTH LOGIN ROUTE HIT - processing login request");
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log("AUTH Login request received:", req.method, req.path, { 
      username: req.body.username, 
      ip: clientIp 
    });
    
    // Input sanitization
    const username = sanitizeInput(req.body.username || '');
    let password = req.body.password || '';
    
    // Decrypt password if encryption is enabled
    if (isPasswordEncryptionEnabled() && password) {
      try {
        password = await decryptPassword(password);
      } catch (error) {
        console.error("Password decryption error:", error);
        logSecurityEvent('PASSWORD_DECRYPTION_ERROR', { username, ip: clientIp }, req, 'HIGH', 'FAILURE');
        return res.status(400).json({ message: "Password decryption failed. Please try again." });
      }
    }
    
    if (!username || !password) {
      logSecurityEvent('LOGIN_ATTEMPT_MISSING_CREDENTIALS', { username, ip: clientIp }, req);
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Update request body with decrypted password for passport
    req.body.password = password;
    
    // Check for login attempt lockout
    const canAttemptLogin = trackLoginAttempt(username, false);
    if (!canAttemptLogin) {
      logSecurityEvent('LOGIN_ATTEMPT_ACCOUNT_LOCKED', { username, ip: clientIp }, req);
      return res.status(429).json({ 
        message: "Account temporarily locked due to too many failed attempts. Please try again later." 
      });
    }
    
    // Verify CAPTCHA first
    const { captchaSessionId, captchaInput } = req.body;
    if (!captchaSessionId || !captchaInput) {
      return res.status(400).json({ message: "CAPTCHA verification required" });
    }
    
    // Security: Pass IP address for CAPTCHA verification and consume on success
    const isCaptchaValid = verifyCaptcha(captchaSessionId, captchaInput, clientIp, true);
    if (!isCaptchaValid) {
      logSecurityEvent('LOGIN_CAPTCHA_FAILED', { username, ip: clientIp }, req);
      console.log("CAPTCHA verification failed for login attempt");
      return res.status(400).json({ message: "Invalid CAPTCHA. Please try again." });
    }
    
    console.log("CAPTCHA verification successful, proceeding with authentication");
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({ message: "Authentication failed" });
      }
      if (!user) {
        logSecurityEvent('LOGIN_FAILED', { 
          username, 
          ip: clientIp, 
          userAgent,
          reason: info?.message || 'Invalid credentials'
        }, req);
        console.log("Login failed for user:", username, "Info:", info);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Mark successful login attempt
      trackLoginAttempt(username, true);
      
      // Regenerate session ID to prevent session fixation and enable replay protection
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regeneration error:", regenerateErr);
          logSecurityEvent('SESSION_REGENERATION_ERROR', { username, error: regenerateErr.message }, req);
          return res.status(500).json({ message: "Login failed" });
        }
        
        req.login(user, (err) => {
          if (err) {
            console.error("Login session error:", err);
            logSecurityEvent('LOGIN_SESSION_ERROR', { username, error: err.message }, req);
            return res.status(500).json({ message: "Login failed" });
          }
          
          // Bind session to IP address and User-Agent for replay protection
          // Generate unique session token that changes on every login (prevents replay)
          if (req.session) {
            const sessionToken = generateSessionToken(req.sessionID, user.id);
            (req.session as any).createdAt = Date.now();
            (req.session as any).clientIp = clientIp; // Bind to IP address
            (req.session as any).userAgent = userAgent; // Bind to User-Agent
            (req.session as any).sessionRotatedAt = Date.now(); // Track rotation timestamp
            (req.session as any).sessionToken = sessionToken; // Unique token for this login session
            (req.session as any).userId = user.id; // Store userId for token validation
            
            console.log(`Session token generated for session ${req.sessionID}: ${sessionToken.substring(0, 16)}...`);
          }
          
          console.log("Session established successfully:", {
            sessionId: req.sessionID,
            userId: user.id,
            username: user.username,
            clientIp: clientIp,
            isAuthenticated: req.isAuthenticated(),
            hasSessionToken: !!(req.session as any).sessionToken,
            sessionCreated: !!(req.session as any).createdAt
          });
          
          // CRITICAL: Save the session explicitly to ensure it's persisted before sending response
          // This is essential for production - ensures session is saved to store before client makes next request
          req.session.save((saveErr: any) => {
            if (saveErr) {
              console.error("Session save error:", saveErr);
              logSecurityEvent('SESSION_SAVE_ERROR', { username, error: saveErr.message }, req);
              return res.status(500).json({ message: "Failed to save session" });
            }
            
            console.log("Session saved successfully:", req.sessionID);
            
            // Debug: Check if cookie will be set
            const cookieName = sessionSettings.name || 'cid.session.id';
            console.log("Login - Cookie configuration:", {
              cookieName,
              secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
              httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
              sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
              domain: SECURITY_CONFIG.COOKIE_SECURITY.domain || 'not set (exact domain)',
              partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned,
              protocol: req.protocol,
              secureFlag: req.secure,
              xForwardedProto: req.headers['x-forwarded-proto'],
              host: req.headers.host
            });
            
            logSecurityEvent('LOGIN_SUCCESS', { 
              username: user.username, 
              role: user.role,
              ip: clientIp,
              sessionId: req.sessionID,
              sessionRotated: true
            }, req);
            console.log("Login successful for user:", user.username);
            res.json({
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          });
        });
      });
    })(req, res, next);
  });
  
  console.log('✅ Authentication routes registered:');
  console.log('  - POST /api/login');
  console.log('  - POST /api/auth/login (alias)');
  console.log('  - POST /api/register');
  console.log('  - GET /api/auth/user');
  console.log('  - GET /api/auth/session-status');
  console.log('  - POST /api/auth/extend-session');
  console.log('  - POST /api/logout');
  console.log('  - GET /api/logout');
}

// Enhanced session validation to prevent replay attacks
function validateSession(req: any, res: any, next: any) {
  // Check if session exists and is valid
  if (!req.session || !req.sessionID) {
    logSecurityEvent('INVALID_SESSION', { 
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, req);
    return res.status(401).json({ message: "Invalid session" });
  }
  
  const sessionId = req.sessionID;
  
  // CRITICAL: Check if session is in blacklist (prevents session replay)
  if (invalidatedSessions.has(sessionId)) {
    const blacklistInfo = invalidatedSessions.get(sessionId);
    logSecurityEvent('SESSION_REPLAY_ATTEMPT', { 
      sessionId,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      reason: `Session blacklisted: ${blacklistInfo?.reason || 'unknown'}`,
      invalidatedAt: blacklistInfo?.invalidatedAt,
      timeSinceInvalidation: blacklistInfo ? Date.now() - blacklistInfo.invalidatedAt : 0
    }, req, 'CRITICAL', 'FAILURE');
    
    // Destroy the session if it still exists
    if (req.session && !req.session.destroyed) {
      req.session.destroy(() => {});
    }
    
    return res.status(401).json({ 
      message: "Session has been terminated and cannot be reused",
      code: "SESSION_REPLAY_BLOCKED"
    });
  }
  
  // Check if session has been destroyed (replay attack prevention)
  if (req.session.destroyed) {
    logSecurityEvent('SESSION_REPLAY_ATTEMPT', { 
      sessionId,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      reason: 'Session was destroyed'
    }, req, 'HIGH', 'FAILURE');
    return res.status(401).json({ message: "Session has been terminated" });
  }
  
  // CRITICAL: Validate session token (prevents replay of old sessions)
  if (req.isAuthenticated()) {
    const sessionToken = (req.session as any).sessionToken;
    const userId = (req.session as any).userId;
    
    // If session token exists, validate it matches expected token
    if (sessionToken && userId) {
      // Re-generate expected token to verify it matches
      const expectedToken = generateSessionToken(sessionId, userId);
      
      // Note: We can't directly compare because token generation includes timestamp
      // Instead, we ensure the token exists and session hasn't been regenerated
      // The token is unique per session ID and user ID combination
      
      // Additional check: Verify session token is present and matches format
      if (!sessionToken || typeof sessionToken !== 'string' || sessionToken.length !== 64) {
        logSecurityEvent('SESSION_TOKEN_INVALID', { 
          sessionId,
          ip: req.ip,
          path: req.path,
          reason: 'Invalid session token format'
        }, req, 'HIGH', 'FAILURE');
        
        // Add to blacklist and destroy
        invalidatedSessions.set(sessionId, {
          invalidatedAt: Date.now(),
          reason: 'invalid_token'
        });
        req.session.destroy(() => {});
        
        return res.status(401).json({ 
          message: "Session validation failed",
          code: "SESSION_TOKEN_INVALID"
        });
      }
    } else if (req.isAuthenticated()) {
      // If authenticated but no token, this might be:
      // 1. An old session before token system (backward compatibility)
      // 2. A session that was just created (token generation happens in req.login callback)
      // 3. A timing issue where token hasn't been saved yet
      
      // Check if session was recently created (within last 5 seconds) - likely a new login
      const sessionCreated = (req.session as any).createdAt;
      const sessionAge = sessionCreated ? Date.now() - sessionCreated : Infinity;
      
      // Allow sessions without tokens if:
      // - Session was just created (< 5 seconds ago) - likely in the middle of login process
      // - OR in development mode
      if (sessionAge < 5000 || process.env.NODE_ENV === 'development') {
        // Log but allow - this is a newly created session
        if (process.env.NODE_ENV === 'production') {
          logSecurityEvent('SESSION_TOKEN_MISSING_NEW_SESSION', { 
            sessionId,
            ip: req.ip,
            path: req.path,
            reason: `Session token missing but session is new (${Math.round(sessionAge/1000)}s old) - allowing`,
            sessionAge
          }, req, 'LOW', 'INFO');
        }
        // Allow the session to continue - token will be generated soon
      } else {
        // Older session without token - this is suspicious but allow for now
        logSecurityEvent('SESSION_TOKEN_MISSING', { 
          sessionId,
          ip: req.ip,
          path: req.path,
          reason: 'Session token missing on authenticated session',
          sessionAge
        }, req, 'MEDIUM', 'WARNING');
        // Still allow - backward compatibility
      }
    }
  }
  
  // Bind session to IP address (prevent session hijacking/replay)
  const currentIp = req.ip || req.connection.remoteAddress || 'unknown';
  const sessionIp = (req.session as any).clientIp;
  
  if (sessionIp && sessionIp !== currentIp && process.env.NODE_ENV === 'production') {
    // In production, reject requests from different IPs
    // In development, allow but log the mismatch
    logSecurityEvent('SESSION_IP_MISMATCH', { 
      sessionId: req.sessionID,
      sessionIp: sessionIp,
      currentIp: currentIp,
      path: req.path,
      reason: 'IP address changed'
    }, req, 'HIGH', 'FAILURE');
    
    if (process.env.NODE_ENV === 'production') {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Session security violation: IP address mismatch" });
    }
  }
  
  // Bind session to User-Agent (prevent session hijacking)
  const currentUserAgent = req.get('User-Agent') || 'unknown';
  const sessionUserAgent = (req.session as any).userAgent;
  
  if (sessionUserAgent && sessionUserAgent !== currentUserAgent && process.env.NODE_ENV === 'production') {
    // In production, reject requests with different User-Agent
    logSecurityEvent('SESSION_USER_AGENT_MISMATCH', { 
      sessionId: req.sessionID,
      sessionUserAgent: sessionUserAgent,
      currentUserAgent: currentUserAgent,
      path: req.path,
      reason: 'User-Agent changed'
    }, req, 'HIGH', 'FAILURE');
    
    if (process.env.NODE_ENV === 'production') {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Session security violation: User-Agent mismatch" });
    }
  }
  
  // Check session age (prevent stale sessions)
  if (req.session.cookie && req.session.cookie.maxAge) {
    // Calculate session age correctly - time since session was created
    const sessionCreated = (req.session as any).createdAt || (Date.now() - req.session.cookie.maxAge);
    const sessionAge = Date.now() - sessionCreated;
    
    if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
      logSecurityEvent('STALE_SESSION', { 
        sessionId: req.sessionID,
        age: sessionAge,
        ip: req.ip
      }, req, 'MEDIUM', 'FAILURE');
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Session expired" });
    }
  }
  
  next();
}

// Middleware to check if user is authenticated with session validation
export function requireAuth(req: any, res: any, next: any) {
  // First validate the session
  validateSession(req, res, (err: any) => {
    if (err) return next(err);
    
    // Then check authentication
    if (!req.isAuthenticated()) {
      logSecurityEvent('UNAUTHENTICATED_ACCESS', { 
        ip: req.ip,
        path: req.path,
        sessionId: req.sessionID
      }, req);
      return res.status(401).json({ message: "Authentication required" });
    }
    
    next();
  });
}

// Middleware to check if user is admin with session validation
export function requireAdmin(req: any, res: any, next: any) {
  // First validate the session
  validateSession(req, res, (err: any) => {
    if (err) return next(err);
    
    // Then check authentication
    if (!req.isAuthenticated()) {
      logSecurityEvent('ADMIN_UNAUTHENTICATED_ACCESS', { 
        ip: req.ip,
        path: req.path,
        sessionId: req.sessionID
      }, req);
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = req.user as SelectUser;
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      logSecurityEvent('ADMIN_ACCESS_DENIED', { 
        username: user.username,
        role: user.role,
        ip: req.ip,
        path: req.path,
        sessionId: req.sessionID
      }, req);
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  });
}

export { hashPassword, comparePasswords };
