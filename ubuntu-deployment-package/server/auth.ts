import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { verifyCaptcha } from "./captcha";
import { User as SelectUser, LoginData } from "../shared/schema.js";
import { validatePassword, trackLoginAttempt, logSecurityEvent, sanitizeInput } from "./security";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Enhanced password hashing with bcrypt (more secure than scrypt for this use case)
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Higher salt rounds for better security
  return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
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
  // Debug middleware to log all requests to auth routes
  app.use('/api', (req, res, next) => {
    console.log(`Auth middleware: ${req.method} ${req.path}`);
    next();
  });

  // Session configuration - use memory store for simplicity
  const MemoryStore = createMemoryStore(session);
  const sessionStore = new MemoryStore({
    checkPeriod: 86400000, // 24 hours
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "CID-Telangana-Super-Secret-Key-2025-" + randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours (reduced from 24 for security)
      sameSite: 'strict', // CSRF protection
    },
    name: 'cid.session.id', // Custom session name
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Authenticating user:", username);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log("User not found:", username);
          return done(null, false, { message: "User not found" });
        }
        
        if (!user.isActive) {
          console.log("User inactive:", username);
          return done(null, false, { message: "Account inactive" });
        }

        console.log("Comparing passwords for user:", username);
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          console.log("Invalid password for user:", username);
          return done(null, false, { message: "Invalid password" });
        }

        console.log("Authentication successful for user:", username);
        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error);
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

  app.post("/api/login", (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    console.log("Login request received:", req.method, req.path, { 
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
    
    const isCaptchaValid = verifyCaptcha(captchaSessionId, captchaInput, true);
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

  // Logout route (both GET and POST for compatibility)
  const logoutHandler = (req: any, res: any, next: any) => {
    req.logout((err: any) => {
      if (err) return next(err);
      
      // If it's an API request (POST or Accept: application/json), send JSON
      if (req.method === 'POST' || req.accepts('json')) {
        res.json({ message: "Logged out successfully" });
      } else {
        // If it's a browser navigation (GET), redirect to home
        res.redirect('/');
      }
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
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Middleware to check if user is admin
export function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = req.user as SelectUser;
  
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

export { hashPassword, comparePasswords };