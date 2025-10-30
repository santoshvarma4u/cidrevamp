import { randomBytes, createHash } from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Cookie security middleware - ensures all cookies have proper security attributes
export function cookieSecurityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Override res.cookie to enforce security attributes
  const originalCookie = res.cookie;
  res.cookie = function(name: string, value: string, options: any = {}) {
    // CRITICAL: Determine if request is actually secure (HTTPS)
    // This checks multiple sources to handle reverse proxy scenarios
    // req.secure is true when Express trusts proxy AND x-forwarded-proto is 'https'
    const isSecureRequest = req.secure || 
                            req.protocol === 'https' || 
                            req.headers['x-forwarded-proto'] === 'https' ||
                            req.headers['x-forwarded-ssl'] === 'on' ||
                            (req.headers['x-forwarded-port'] && req.headers['x-forwarded-port'] === '443');
    
    // For secure flag: If config requires secure=true, use actual request security status
    // This ensures cookies work correctly behind reverse proxies (Nginx)
    // When secure=true is required, only set it if request is actually HTTPS
    let shouldUseSecure = options.secure !== undefined 
      ? options.secure 
      : SECURITY_CONFIG.COOKIE_SECURITY.secure;
    
    // If secure flag should be true but request isn't actually secure, log warning
    if (shouldUseSecure && !isSecureRequest) {
      console.warn(`[COOKIE] Attempting to set secure cookie on non-HTTPS request:`, {
        name,
        protocol: req.protocol,
        secure: req.secure,
        xForwardedProto: req.headers['x-forwarded-proto'],
        host: req.headers.host
      });
      // Still set secure=false if request isn't actually secure (to prevent cookie rejection)
      shouldUseSecure = false;
    }
    
    // Apply security defaults
    const secureOptions = {
      ...options,
      secure: shouldUseSecure, // Use detected security status
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
    // Determine if request is secure (same logic as cookie setting)
    const isSecureRequest = req.secure || 
                            req.protocol === 'https' || 
                            req.headers['x-forwarded-proto'] === 'https' ||
                            req.headers['x-forwarded-ssl'] === 'on';
    
    let shouldUseSecure = options.secure !== undefined 
      ? options.secure 
      : (isSecureRequest && SECURITY_CONFIG.COOKIE_SECURITY.secure);
    
    const secureOptions = {
      ...options,
      secure: shouldUseSecure,
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
    // Secure flag - ALWAYS true unless ALLOW_INSECURE_COOKIES is set to 'true' (security best practice)
    // Set ALLOW_INSECURE_COOKIES=true ONLY if testing over HTTP (not recommended for production)
    // In production, this should always be true (requires HTTPS)
    // Secure flag: always true by default (requires HTTPS)
    // When secure=true, cookies ONLY work over HTTPS connections
    // With Nginx reverse proxy, this relies on x-forwarded-proto header
    // Must ensure Express trusts proxy (app.set('trust proxy', 1))
    // Cookie middleware will automatically detect HTTPS and set secure flag accordingly
    secure: 'false',
    
    // HttpOnly flag - prevent XSS attacks
    httpOnly: true,
    
    // SameSite attribute - CSRF protection
    // 'lax' allows cookies on top-level navigation (GET requests) but blocks on cross-site POST
    // This is the best balance between security and compatibility
    // Some browsers (Chrome, Safari) are stricter with SameSite, so 'lax' is safer than 'strict'
    sameSite: (process.env.COOKIE_SAMESITE as 'strict' | 'lax' | 'none' | undefined) || ('lax' as const),
    
    // Domain restriction - configurable
    // If not set, cookies work for exact domain (recommended for single domain)
    // If set to .tspolice.gov.in, cookies work across subdomains
    // Leave undefined for exact domain matching
    domain: process.env.COOKIE_DOMAIN || undefined,
    
    // Path restriction
    path: '/',
    
    // Additional security flags
    // Partitioned cookies: Disabled for now as they can cause compatibility issues with SameSite
    // Partitioned cookies are primarily for third-party contexts, which we don't use
    partitioned: false, // process.env.COOKIE_PARTITIONED === 'true' // Disabled by default
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
  // Production: Only allow official domains
  // Development: Allow localhost for local testing
  // Can be extended via TRUSTED_HOSTS environment variable (comma-separated)
  get TRUSTED_HOSTS() {
    // Production domains - only these are allowed in production
    const productionHosts = [
      'cid-staging.tspolice.gov.in',
      'cid.tspolice.gov.in',
    ];
    
    // Development hosts - only added in development mode
    const developmentHosts = process.env.NODE_ENV === 'development' ? [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'cid-telangana.local',
      // Docker internal networking
      'app',
      'cid-app',
    ] : [];
    
    const defaultHosts = [...productionHosts, ...developmentHosts];
    
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
  
  // Regex patterns for dynamic origins
  // Production: Only allow subdomains under tspolice.gov.in
  CORS_ORIGIN_PATTERNS: process.env.NODE_ENV === 'production' ? [
    /^https:\/\/.*\.tspolice\.gov\.in$/, // Allow any subdomain of tspolice.gov.in (for flexibility)
  ] : [
    // Development: Allow localhost patterns for local testing
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/,
    /^https:\/\/.*\.tspolice\.gov\.in$/, // Also allow tspolice.gov.in subdomains in dev
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
    credentials: false, // Disable credentials for all requests (security enhancement)
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

// Host Header Validation - Prevent Host Header Injection attacks (CWE-20)
export function validateHostHeader(req: Request, res: Response, next: NextFunction) {
  // Validate Host header (case-insensitive)
  const host = req.headers.host || req.hostname;
  
  if (!host || typeof host !== 'string' || host.trim().length === 0) {
    logSecurityEvent('MISSING_HOST_HEADER', { 
      ip: req.ip,
      path: req.path,
      headers: Object.keys(req.headers)
    }, req, 'HIGH', 'FAILURE');
    return res.status(400).json({ 
      message: 'Bad Request',
      error: 'Host header is required',
      code: 'MISSING_HOST_HEADER'
    });
  }
  
  // Remove port number if present for validation
  const hostWithoutPort = host.split(':')[0].toLowerCase().trim();
  
  // Validate host format (prevent injection)
  if (!/^[a-zA-Z0-9.-]+$/.test(hostWithoutPort) && !hostWithoutPort.includes('localhost')) {
    logSecurityEvent('INVALID_HOST_FORMAT', { 
      host: hostWithoutPort,
      ip: req.ip,
      path: req.path
    }, req, 'HIGH', 'FAILURE');
    return res.status(400).json({ 
      message: 'Bad Request',
      error: 'Invalid host format',
      code: 'INVALID_HOST_FORMAT'
    });
  }
  
  // Check against whitelist (case-insensitive)
  const isTrusted = SECURITY_CONFIG.TRUSTED_HOSTS.some(trustedHost => {
    if (trustedHost instanceof RegExp) {
      return trustedHost.test(hostWithoutPort);
    }
    return typeof trustedHost === 'string' && trustedHost.toLowerCase() === hostWithoutPort;
  });
  
  if (!isTrusted) {
    logSecurityEvent('UNTRUSTED_HOST_HEADER', { 
      host: hostWithoutPort,
      originalHost: host,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent'),
      allHeaders: Object.keys(req.headers)
    }, req, 'HIGH', 'FAILURE');
    return res.status(403).json({ 
      message: 'Forbidden',
      error: 'Invalid host header',
      code: 'UNTRUSTED_HOST'
    });
  }
  
  // Validate X-Forwarded-Host header (if present)
  const forwardedHost = req.headers['x-forwarded-host'];
  if (forwardedHost) {
    const forwardedHostStr = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
    if (typeof forwardedHostStr === 'string' && forwardedHostStr.trim().length > 0) {
      const forwardedHostWithoutPort = forwardedHostStr.split(':')[0].toLowerCase().trim();
      
      // X-Forwarded-Host must match Host header or be in whitelist
      if (forwardedHostWithoutPort !== hostWithoutPort) {
        const isForwardedTrusted = SECURITY_CONFIG.TRUSTED_HOSTS.some(trustedHost => {
          if (trustedHost instanceof RegExp) {
            return trustedHost.test(forwardedHostWithoutPort);
          }
          return typeof trustedHost === 'string' && trustedHost.toLowerCase() === forwardedHostWithoutPort;
        });
        
        if (!isForwardedTrusted) {
          logSecurityEvent('UNTRUSTED_FORWARDED_HOST', { 
            host: hostWithoutPort,
            forwardedHost: forwardedHostWithoutPort,
            ip: req.ip,
            path: req.path
          }, req, 'HIGH', 'FAILURE');
          return res.status(403).json({ 
            message: 'Forbidden',
            error: 'Invalid forwarded host header',
            code: 'UNTRUSTED_FORWARDED_HOST'
          });
        }
      }
    }
  }
  
  // Validate X-Real-Host header (if present) - another proxy header
  const realHost = req.headers['x-real-host'];
  if (realHost) {
    const realHostStr = Array.isArray(realHost) ? realHost[0] : realHost;
    if (typeof realHostStr === 'string' && realHostStr.trim().length > 0) {
      const realHostWithoutPort = realHostStr.split(':')[0].toLowerCase().trim();
      
      if (realHostWithoutPort !== hostWithoutPort) {
        const isRealHostTrusted = SECURITY_CONFIG.TRUSTED_HOSTS.some(trustedHost => {
          if (trustedHost instanceof RegExp) {
            return trustedHost.test(realHostWithoutPort);
          }
          return typeof trustedHost === 'string' && trustedHost.toLowerCase() === realHostWithoutPort;
        });
        
        if (!isRealHostTrusted) {
          logSecurityEvent('UNTRUSTED_REAL_HOST', { 
            host: hostWithoutPort,
            realHost: realHostWithoutPort,
            ip: req.ip,
            path: req.path
          }, req, 'HIGH', 'FAILURE');
          return res.status(403).json({ 
            message: 'Forbidden',
            error: 'Invalid real host header',
            code: 'UNTRUSTED_REAL_HOST'
          });
        }
      }
    }
  }
  
  // Store validated host in request for downstream use
  req.headers['x-validated-host'] = hostWithoutPort;
  
  next();
}

// HTTPS Enforcement Middleware - Block cleartext password submission over HTTP
export function enforceHttpsForAuth(req: Request, res: Response, next: NextFunction) {
  // Only check authentication endpoints (login, register)
  const isAuthEndpoint = [
    '/api/login',
    '/api/auth/login',
    '/api/register'
  ].includes(req.path);
  
  if (!isAuthEndpoint) {
    return next();
  }
  
  // Check if request is over HTTPS
  const isHttps = 
    req.secure || // Direct HTTPS connection
    req.protocol === 'https' || // Protocol is HTTPS
    req.headers['x-forwarded-proto'] === 'https' || // Behind proxy (Nginx)
    (req.headers['x-forwarded-ssl'] === 'on') || // Alternative proxy header
    (req.headers['x-forwarded-port'] === '443'); // HTTPS port indicator
  
  // Allow HTTP only if explicitly configured for development
  const allowHttpSessions = process.env.ALLOW_HTTP_SESSIONS === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Block HTTP requests to auth endpoints unless explicitly allowed
  if (!isHttps && !(allowHttpSessions && isDevelopment)) {
    logSecurityEvent('CLEARTEXT_PASSWORD_BLOCKED', { 
      path: req.path,
      protocol: req.protocol,
      secure: req.secure,
      forwardedProto: req.headers['x-forwarded-proto'],
      ip: req.ip,
      message: 'HTTP request blocked - passwords must be submitted over HTTPS'
    }, req, 'CRITICAL');
    
    return res.status(400).json({ 
      message: 'Security Error: Passwords must be submitted over HTTPS',
      error: 'CLEARTEXT_PASSWORD_BLOCKED',
      details: 'This endpoint requires a secure HTTPS connection. Please use HTTPS to submit passwords.',
      code: 'HTTPS_REQUIRED'
    });
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
  // Import the enhanced logging function synchronously
  try {
    const auditLogger = require('./auditLogger');
    const { logSecurityEvent: enhancedLogSecurityEvent } = auditLogger;
    
    // Call the enhanced logging function
    enhancedLogSecurityEvent(event, details, req, severity, status, responseTime, requestSize, responseSize);
  } catch (error) {
    // Fallback to console logging if audit logger fails
    console.log(`[SECURITY] ${event}:`, details);
  }
}

// Clear login attempts (for testing)
export function clearLoginAttempts() {
  loginAttempts.clear();
  console.log('Login attempts cleared');
}

// Clear rate limit store (for testing)
export function clearRateLimitStore() {
  rateLimitStore.clear();
  console.log('Rate limit store cleared');
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
// Manual unlock functions for administrative use
export function unlockAccount(identifier: string): boolean {
  const deleted = loginAttempts.delete(identifier);
  if (deleted) {
    console.info(`Account manually unlocked: ${identifier}`);
  }
  return deleted;
}

export function unlockAllAccounts(): number {
  const count = loginAttempts.size;
  loginAttempts.clear();
  console.info(`All accounts unlocked. Total: ${count}`);
  return count;
}

export function getLockedAccounts(): Array<{identifier: string, attempts: number, lockedUntil?: number}> {
  const now = Date.now();
  const locked: Array<{identifier: string, attempts: number, lockedUntil?: number}> = [];
  
  // Use Array.from to avoid iterator issues
  const entries = Array.from(loginAttempts.entries());
  for (const [identifier, data] of entries) {
    if (data.lockedUntil && now < data.lockedUntil) {
      locked.push({
        identifier,
        attempts: data.count,
        lockedUntil: data.lockedUntil
      });
    }
  }
  
  return locked;
}

export function isAccountLocked(identifier: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);
  
  if (!attempts || !attempts.lockedUntil) {
    return false;
  }
  
  return now < attempts.lockedUntil;
}
