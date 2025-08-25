import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { xssProtection, CSP_CONFIG } from "./security";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Production logging function
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: CSP_CONFIG,
  crossOriginEmbedderPolicy: false, // Required for some features
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// Additional security headers
app.use(xssProtection);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.replit.app', 'https://*.replit.dev']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Apply rate limiting
app.use('/api', generalLimiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// JSON parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Production static file serving (no Vite needed)
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// In production, serve pre-built static files
const clientDist = path.join(__dirname);
app.use(express.static(clientDist));

// Security monitoring middleware
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  // Log security-relevant requests in production
  if (req.method !== 'GET' && req.originalUrl.includes('/api/')) {
    log(`${req.method} ${req.originalUrl} from ${req.ip}`, 'security');
  }
  next();
});

async function main() {
  const server = await registerRoutes(app);
  
  // Catch-all handler for client-side routing (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  
  // Enhanced error handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    log(`Error: ${err.message}`, 'error');
    
    if (res.headersSent) {
      return next(err);
    }
    
    // Don't expose error details in production
    res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  });

  const PORT = Number(process.env.PORT) || 5000;
  
  server.listen(PORT, "0.0.0.0", () => {
    log(`🚀 Production server running on port ${PORT}`);
    log(`📡 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
    log(`🔒 Security: Enhanced production mode enabled`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    log(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      log('Server closed successfully');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  log(`Failed to start server: ${error.message}`, 'error');
  process.exit(1);
});