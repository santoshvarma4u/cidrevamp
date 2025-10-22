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
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

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
          const maxAge = session.cookie.maxAge || SECURITY_CONFIG.SESSION_TIMEOUT;
          const sessionAge = now - (session.cookie.originalMaxAge || now) + maxAge;
          
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

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "CID-Telangana-Super-Secret-Key-2025-" + randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      // Enhanced cookie security using centralized configuration
      secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
      httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly, // Prevent XSS attacks
      maxAge: SECURITY_CONFIG.SESSION_TIMEOUT, // 20 minutes (enhanced security)
      sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite, // Enhanced CSRF protection
      domain: SECURITY_CONFIG.COOKIE_SECURITY.domain, // Allow domain restriction
      path: SECURITY_CONFIG.COOKIE_SECURITY.path, // Path restriction
      partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned, // Partitioned cookies for third-party context
    },
    name: 'cid.session.id', // Custom session name
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Session activity tracking middleware - MUST be after session middleware
  app.use((req: any, res: any, next: any) => {
    if (req.session && req.sessionID) {
      // Track last activity time
      req.session.lastActivity = Date.now();
      
      // Check if session should be expired due to inactivity
      const now = Date.now();
      const lastActivity = req.session.lastActivity || req.session.cookie.originalMaxAge || now;
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
      } catch (error) {
        console.error("Authentication error:", error);
        logSecurityEvent('AUTH_ERROR', { username, error: error.message }, undefined, 'CRITICAL', 'FAILURE');
        logAuthenticationProcess(username, false, { reason: 'System error', error: error.message });
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
      const password = req.body.password || '';
      const firstName = sanitizeInput(req.body.firstName || '');
      const lastName = sanitizeInput(req.body.lastName || '');
      
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

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
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
  app.post("/api/login", (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log("LOGIN ROUTE HIT - Login request received:", req.method, req.path, { 
      username: req.body.username, 
      ip: clientIp 
    });
    
    // Input sanitization
    const username = sanitizeInput(req.body.username || '');
    const password = req.body.password || '';
    
    if (!username || !password) {
      logSecurityEvent('LOGIN_ATTEMPT_MISSING_CREDENTIALS', { username, ip: clientIp }, req);
      return res.status(400).json({ message: "Username and password are required" });
    }
    
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
      
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          logSecurityEvent('LOGIN_SESSION_ERROR', { username, error: err.message }, req);
          return res.status(500).json({ message: "Login failed" });
        }
        
        logSecurityEvent('LOGIN_SUCCESS', { 
          username: user.username, 
          role: user.role,
          ip: clientIp 
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
      
      // Step 2: Destroy the session completely (prevents session replay)
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destruction error:", err);
          logSecurityEvent('SESSION_DESTRUCTION_ERROR', { username, error: err.message }, req);
          return next(err);
        }
        
            // Step 3: Clear the session cookie with enhanced security
            res.clearCookie('cid.session.id', {
              path: SECURITY_CONFIG.COOKIE_SECURITY.path,
              httpOnly: SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
              secure: SECURITY_CONFIG.COOKIE_SECURITY.secure,
              sameSite: SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
              domain: SECURITY_CONFIG.COOKIE_SECURITY.domain,
              partitioned: SECURITY_CONFIG.COOKIE_SECURITY.partitioned
            });
            
            // Step 4: Clear any additional auth cookies
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as SelectUser;
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
    const lastActivity = req.session.lastActivity || req.session.cookie.originalMaxAge || now;
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
    req.session.lastActivity = Date.now();
    
    logSecurityEvent('SESSION_EXTENDED', { 
      sessionId: req.sessionID,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, req);

    res.json({ 
      success: true, 
      message: "Session extended",
      timeRemaining: Math.ceil(SECURITY_CONFIG.SESSION_TIMEOUT / 1000)
    });
  });
  
  // Additional explicit login route registration for production compatibility
  console.log('🔧 Registering /api/auth/login route for frontend compatibility...');
  app.post("/api/auth/login", (req, res, next) => {
    console.log("AUTH LOGIN ROUTE HIT - processing login request");
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log("AUTH Login request received:", req.method, req.path, { 
      username: req.body.username, 
      ip: clientIp 
    });
    
    // Input sanitization
    const username = sanitizeInput(req.body.username || '');
    const password = req.body.password || '';
    
    if (!username || !password) {
      logSecurityEvent('LOGIN_ATTEMPT_MISSING_CREDENTIALS', { username, ip: clientIp }, req);
      return res.status(400).json({ message: "Username and password are required" });
    }
    
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
      
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          logSecurityEvent('LOGIN_SESSION_ERROR', { username, error: err.message }, req);
          return res.status(500).json({ message: "Login failed" });
        }
        
        logSecurityEvent('LOGIN_SUCCESS', { 
          username: user.username, 
          role: user.role,
          ip: clientIp 
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
  
  // Check if session has been destroyed (replay attack prevention)
  if (req.session.destroyed) {
    logSecurityEvent('SESSION_REPLAY_ATTEMPT', { 
      sessionId: req.sessionID,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, req);
    return res.status(401).json({ message: "Session has been terminated" });
  }
  
  // Check session age (prevent stale sessions)
  if (req.session.cookie && req.session.cookie.maxAge) {
    const sessionAge = Date.now() - req.session.cookie.originalMaxAge + req.session.cookie.maxAge;
    if (sessionAge > SECURITY_CONFIG.SESSION_TIMEOUT) {
      logSecurityEvent('STALE_SESSION', { 
        sessionId: req.sessionID,
        age: sessionAge,
        ip: req.ip
      }, req);
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
