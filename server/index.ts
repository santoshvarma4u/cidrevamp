import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { xssProtection, CSP_CONFIG, httpMethodFilter, validateHostHeader, getCorsOptions, cookieSecurityMiddleware, enforceHttpsForAuth } from "./security";

const app = express();

// CRITICAL: Set trust proxy BEFORE any other middleware
// This allows Express to detect HTTPS from x-forwarded-proto header
// This is essential for cookies with secure=true when behind Nginx reverse proxy
app.set("trust proxy", 1);

// Host Header Validation - MUST be first for security
app.use(validateHostHeader);

// Enhanced Security Middleware with TLS protection
app.use(helmet({
  contentSecurityPolicy: CSP_CONFIG,
  crossOriginEmbedderPolicy: false, // Required for some features
  
  // Enhanced HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // Additional security headers for TLS protection
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  noSniff: true,
  frameguard: { action: 'deny' },
  
  // Enhanced cookie security
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Additional security headers
app.use(xssProtection);

// Cookie Security Middleware - Enforce secure cookie attributes
app.use(cookieSecurityMiddleware);

// TLS Security Middleware - Force HTTPS in production
app.use((req, res, next) => {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  
  // Add security headers for TLS protection
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// HTTPS Enforcement for Authentication - Block cleartext password submission over HTTP
// MUST be before login routes are registered
app.use(enforceHttpsForAuth);

// HTTP Method Filtering - Block insecure methods (TRACE, TRACK, etc.)
app.use(httpMethodFilter);

// Rate limiting - Adjusted for development and normal usage
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development
  skip: (req) => process.env.NODE_ENV === 'development',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased from 5 to 20 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development
  skip: (req) => process.env.NODE_ENV === 'development',
});

// CORS configuration - Strict whitelist only (CWE-942)
// NEVER set Access-Control-Allow-Origin to * for sensitive resources
app.use(cors(getCorsOptions()));

// Apply rate limiting
app.use('/api', generalLimiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Server error:", err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
