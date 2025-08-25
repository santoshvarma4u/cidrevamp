import { randomBytes, createHash } from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Security constants
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  
  // Session security
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
  
  // File upload limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
};

// XSS Protection middleware
export function xssProtection(req: Request, res: Response, next: NextFunction) {
  // Set security headers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
}

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Password strength validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = SECURITY_CONFIG.PASSWORD_REQUIREMENTS;
  
  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`);
  }
  
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate secure session secret
export function generateSecureSecret(): string {
  return createHash('sha256')
    .update(randomBytes(64))
    .update(process.env.NODE_ENV || 'development')
    .update(Date.now().toString())
    .digest('hex');
}

// Secure filename generation
export function generateSecureFilename(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const randomId = randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop() || '';
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${prefix}${timestamp}-${randomId}-${sanitizedName}`;
}

// IP-based rate limiting store (in-memory for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function customRateLimit(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const clientData = rateLimitStore.get(clientIp);
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize
      rateLimitStore.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
}

// Login attempt tracking
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>();

export function trackLoginAttempt(identifier: string, success: boolean): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);
  
  if (!attempts) {
    if (!success) {
      loginAttempts.set(identifier, { count: 1 });
    }
    return true; // Allow login attempt
  }
  
  // Check if locked
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return false; // Account is locked
  }
  
  if (success) {
    // Reset on successful login
    loginAttempts.delete(identifier);
    return true;
  }
  
  // Increment failed attempts
  attempts.count++;
  
  if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + SECURITY_CONFIG.LOGIN_LOCKOUT_TIME;
    console.warn(`Account locked for excessive login attempts: ${identifier}`);
  }
  
  return attempts.count < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
}

// Security audit logging
export function logSecurityEvent(event: string, details: any, req?: Request) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.ip || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    method: req?.method,
    url: req?.url,
  };
  
  console.warn('SECURITY EVENT:', JSON.stringify(logEntry));
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with security monitoring service
  }
}

// Content Security Policy configuration
export const CSP_CONFIG = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    scriptSrc: process.env.NODE_ENV === 'production' 
      ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] // Allow inline scripts for Vite builds
      : ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Dev mode for Vite
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    connectSrc: ["'self'", "ws:", "wss:"],
    mediaSrc: ["'self'", "blob:"],
    objectSrc: ["'none'"],
    frameSrc: ["'self'"],
    ...(process.env.NODE_ENV === 'production' && { upgradeInsecureRequests: [] }),
  },
};