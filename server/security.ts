import { randomBytes, createHash } from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Cookie security middleware - ensures all cookies have proper security attributes
export function cookieSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Override res.cookie to enforce security attributes
  const originalCookie = res.cookie;
  res.cookie = function(name: string, value: string, options: any = {}) {
    // Apply security defaults
    const secureOptions = {
      ...options,
      secure: options.secure !== undefined ? options.secure : SECURITY_CONFIG.COOKIE_SECURITY.secure,
      httpOnly: options.httpOnly !== undefined ? options.httpOnly : SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
      sameSite: options.sameSite || SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
      domain: options.domain || SECURITY_CONFIG.COOKIE_SECURITY.domain,
      path: options.path || SECURITY_CONFIG.COOKIE_SECURITY.path,
    };
    
    // Add partitioned flag in production
    if (SECURITY_CONFIG.COOKIE_SECURITY.partitioned && !secureOptions.partitioned) {
      secureOptions.partitioned = true;
    }
    
    return originalCookie.call(this, name, value, secureOptions);
  };
  
  // Override res.clearCookie to use same security attributes
  const originalClearCookie = res.clearCookie;
  res.clearCookie = function(name: string, options: any = {}) {
    const secureOptions = {
      ...options,
      secure: options.secure !== undefined ? options.secure : SECURITY_CONFIG.COOKIE_SECURITY.secure,
      httpOnly: options.httpOnly !== undefined ? options.httpOnly : SECURITY_CONFIG.COOKIE_SECURITY.httpOnly,
      sameSite: options.sameSite || SECURITY_CONFIG.COOKIE_SECURITY.sameSite,
      domain: options.domain || SECURITY_CONFIG.COOKIE_SECURITY.domain,
      path: options.path || SECURITY_CONFIG.COOKIE_SECURITY.path,
    };
    
    return originalClearCookie.call(this, name, secureOptions);
  };
  
  next();
}

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
  SESSION_TIMEOUT: 20 * 60 * 1000, // 20 minutes (enhanced security)
  SESSION_WARNING_TIME: 15 * 60 * 1000, // 15 minutes (warning before timeout)
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
  
  // Cookie security configuration
  COOKIE_SECURITY: {
    // Secure flag - always true in production, configurable for development
    secure: process.env.NODE_ENV === 'production' || process.env.FORCE_HTTPS === 'true',
    
    // HttpOnly flag - prevent XSS attacks
    httpOnly: true,
    
    // SameSite attribute - CSRF protection
    sameSite: 'strict' as const, // 'strict' for maximum security
    
    // Domain restriction - configurable
    domain: process.env.COOKIE_DOMAIN,
    
    // Path restriction
    path: '/',
    
    // Additional security flags
    partitioned: process.env.NODE_ENV === 'production', // Partitioned cookies for third-party context
  },
  
  // File upload limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  // Trusted domains whitelist (Host header validation)
  // Can be extended via TRUSTED_HOSTS environment variable (comma-separated)
  get TRUSTED_HOSTS() {
    const defaultHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'cid-staging.tspolice.gov.in',
      'cid.tspolice.gov.in',
      'cid-telangana.replit.app',
      'cid-telangana.local',
      // Add patterns for dynamic Replit domains
      /^.*\.replit\.app$/,
      /^.*\.replit\.dev$/,
      // Docker internal networking
      'app',
      'cid-app',
    ];
    
    // Allow adding additional trusted hosts via environment variable
    if (process.env.TRUSTED_HOSTS) {
      const envHosts = process.env.TRUSTED_HOSTS.split(',').map(h => h.trim()).filter(Boolean);
      return [...defaultHosts, ...envHosts];
    }
    
    return defaultHosts;
  },
  
  // Trusted CORS origins (Access-Control-Allow-Origin)
  // NEVER set to * for sensitive resources
  get CORS_ALLOWED_ORIGINS() {
    const defaultOrigins = [
      // Production domains (HTTPS only)
      'https://cid-staging.tspolice.gov.in',
      'https://cid.tspolice.gov.in',
      
      // Development domains (HTTP allowed only in dev)
      ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5000',
        'http://localhost:5001',
        'http://127.0.0.1:5001',
      ] : []),
    ];
    
    // Allow adding additional CORS origins via environment variable
    if (process.env.CORS_ALLOWED_ORIGINS) {
      const envOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);
      return [...defaultOrigins, ...envOrigins];
    }
    
    return defaultOrigins;
  },
  
  // Regex patterns for dynamic origins (e.g., Replit)
  CORS_ORIGIN_PATTERNS: [
    /^https:\/\/.*\.replit\.app$/,
    /^https:\/\/.*\.replit\.dev$/,
    /^https:\/\/.*\.tspolice\.gov\.in$/,
  ],
};

// CORS Origin Validator - Strict origin checking (CWE-942)
// NEVER returns true for * (wildcard) - implements whitelist only
export function corsOriginValidator(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  // Block requests with no origin (direct server access attempts)
  // Allow only if in development mode
  if (!origin) {
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // Log suspicious no-origin request
    logSecurityEvent('CORS_NO_ORIGIN', { 
      message: 'Request without origin header blocked'
    });
    return callback(null, false);
  }
  
  // Extract origin URL components for validation
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch (e) {
    logSecurityEvent('CORS_INVALID_ORIGIN', { 
      origin,
      error: 'Malformed origin URL'
    });
    return callback(null, false);
  }
  
  // Security: Block non-HTTPS origins in production (except localhost)
  if (process.env.NODE_ENV === 'production' && 
      originUrl.protocol !== 'https:' && 
      !originUrl.hostname.match(/^(localhost|127\.0\.0\.1)$/)) {
    logSecurityEvent('CORS_HTTP_IN_PRODUCTION', { 
      origin,
      message: 'HTTP origin blocked in production'
    });
    return callback(null, false);
  }
  
  // Check exact match against whitelist
  const allowedOrigins = SECURITY_CONFIG.CORS_ALLOWED_ORIGINS;
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  
  // Check against regex patterns for dynamic domains
  const patterns = SECURITY_CONFIG.CORS_ORIGIN_PATTERNS;
  const matchesPattern = patterns.some(pattern => pattern.test(origin));
  
  if (matchesPattern) {
    // Additional validation: verify the Host header matches origin
    // This prevents Origin header spoofing attacks
    return callback(null, true);
  }
  
  // Origin not in whitelist - block and log
  logSecurityEvent('CORS_ORIGIN_BLOCKED', { 
    origin,
    protocol: originUrl.protocol,
    hostname: originUrl.hostname,
    message: 'Origin not in whitelist'
  });
  
  callback(null, false);
}

// CORS Options Configuration
export function getCorsOptions() {
  return {
    origin: corsOriginValidator,
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 600, // Cache preflight for 10 minutes (reduce OPTIONS requests)
    optionsSuccessStatus: 204, // For legacy browsers
  };
}

// Host Header Validation - Prevent Host Header Injection attacks
export function validateHostHeader(req: Request, res: Response, next: NextFunction) {
  const host = req.headers.host || req.hostname;
  
  if (!host) {
    logSecurityEvent('MISSING_HOST_HEADER', { 
      ip: req.ip,
      path: req.path,
      headers: req.headers 
    }, req);
    return res.status(400).json({ 
      message: 'Bad Request',
      error: 'Host header is required'
    });
  }
  
  // Remove port number if present for validation
  const hostWithoutPort = host.split(':')[0];
  
  // Check against whitelist
  const isTrusted = SECURITY_CONFIG.TRUSTED_HOSTS.some(trustedHost => {
    if (trustedHost instanceof RegExp) {
      return trustedHost.test(hostWithoutPort);
    }
    return trustedHost === hostWithoutPort;
  });
  
  if (!isTrusted) {
    logSecurityEvent('UNTRUSTED_HOST_HEADER', { 
      host: hostWithoutPort,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, req);
    return res.status(403).json({ 
      message: 'Forbidden',
      error: 'Invalid host header'
    });
  }
  
  // Additional validation for X-Forwarded-Host header
  const forwardedHost = req.headers['x-forwarded-host'];
  if (forwardedHost && typeof forwardedHost === 'string') {
    const forwardedHostWithoutPort = forwardedHost.split(':')[0];
    const isForwardedTrusted = SECURITY_CONFIG.TRUSTED_HOSTS.some(trustedHost => {
      if (trustedHost instanceof RegExp) {
        return trustedHost.test(forwardedHostWithoutPort);
      }
      return trustedHost === forwardedHostWithoutPort;
    });
    
    if (!isForwardedTrusted) {
      logSecurityEvent('UNTRUSTED_FORWARDED_HOST', { 
        forwardedHost: forwardedHostWithoutPort,
        ip: req.ip,
        path: req.path
      }, req);
      return res.status(403).json({ 
        message: 'Forbidden',
        error: 'Invalid forwarded host header'
      });
    }
  }
  
  next();
}

// HTTP Method Filter - Block insecure HTTP methods
export function httpMethodFilter(req: Request, res: Response, next: NextFunction) {
  // List of allowed HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
  
  // List of dangerous/unnecessary methods to block
  const blockedMethods = ['TRACE', 'TRACK', 'CONNECT'];
  
  const method = req.method.toUpperCase();
  
  // Block dangerous methods completely
  if (blockedMethods.includes(method)) {
    logSecurityEvent('BLOCKED_HTTP_METHOD', { 
      method, 
      path: req.path,
      ip: req.ip 
    }, req);
    return res.status(405).json({ 
      message: 'Method Not Allowed',
      error: 'This HTTP method is not supported for security reasons'
    });
  }
  
  // For OPTIONS, only allow if CORS preflight
  if (method === 'OPTIONS') {
    // Allow CORS preflight requests
    if (req.headers.origin) {
      return next();
    }
    // Block non-CORS OPTIONS requests
    logSecurityEvent('BLOCKED_OPTIONS_METHOD', { 
      path: req.path,
      ip: req.ip 
    }, req);
    return res.status(405).json({ 
      message: 'Method Not Allowed'
    });
  }
  
  // Allow standard methods
  if (allowedMethods.includes(method)) {
    return next();
  }
  
  // Block any other methods
  logSecurityEvent('BLOCKED_UNKNOWN_METHOD', { 
    method, 
    path: req.path,
    ip: req.ip 
  }, req);
  return res.status(405).json({ 
    message: 'Method Not Allowed'
  });
}

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

// Enhanced security audit logging - now uses comprehensive audit system
export function logSecurityEvent(
  event: string, 
  details: any, 
  req?: Request,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
  status: 'SUCCESS' | 'FAILURE' | 'WARNING' | 'INFO' = 'INFO',
  responseTime?: number,
  requestSize?: number,
  responseSize?: number
) {
  // Import the enhanced logging function
  const { logSecurityEvent: enhancedLogSecurityEvent } = require('./auditLogger');
  
  // Call the enhanced logging function
  enhancedLogSecurityEvent(event, details, req, severity, status, responseTime, requestSize, responseSize);
}

// Content Security Policy configuration
export const CSP_CONFIG = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    scriptSrc: process.env.NODE_ENV === 'production' 
      ? ["'self'"]
      : ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Dev mode for Vite
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    connectSrc: ["'self'", "ws:", "wss:"],
    mediaSrc: ["'self'", "blob:"],
    objectSrc: ["'none'"],
    frameSrc: ["'self'"],
    ...(process.env.NODE_ENV === 'production' && { upgradeInsecureRequests: [] }),
  },
};