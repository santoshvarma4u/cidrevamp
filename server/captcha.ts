import svgCaptcha from 'svg-captcha';
import { randomBytes, createHash } from 'crypto';

interface CaptchaSession {
  id: string;
  textHash: string;  // Store hash instead of plaintext (security best practice)
  createdAt: Date;
  attempts: number;
  verified: boolean;
  used: boolean;     // Track if CAPTCHA has been used (prevent reuse)
  ipAddress?: string; // Track IP for rate limiting
}

// In-memory store for CAPTCHA sessions (in production, use Redis or database)
const captchaSessions = new Map<string, CaptchaSession>();

// Track CAPTCHA generation rate per IP for rate limiting
const captchaRateLimit = new Map<string, { count: number; resetTime: number }>();

// Security: Hash CAPTCHA text instead of storing plaintext
function hashCaptchaText(text: string, sessionId: string): string {
  return createHash('sha256')
    .update(text.toUpperCase().trim()) // Normalize case and trim whitespace
    .update(sessionId)
    .update(process.env.SESSION_SECRET || 'captcha-secret')
    .digest('hex');
}

// Security: Verify hashed CAPTCHA text
function verifyCaptchaHash(input: string, hash: string, sessionId: string): boolean {
  const inputHash = hashCaptchaText(input, sessionId);
  return inputHash === hash;
}

// Clean up expired sessions every 2 minutes (more frequent cleanup)
setInterval(() => {
  const now = new Date();
  
  // Clean expired CAPTCHA sessions
  captchaSessions.forEach((session, id) => {
    const expiryTime = new Date(session.createdAt.getTime() + 3 * 60 * 1000); // 3 minutes (reduced from 5)
    if (now > expiryTime) {
      captchaSessions.delete(id);
    }
  });
  
  // Clean expired rate limit entries
  const currentTime = Date.now();
  captchaRateLimit.forEach((data, ip) => {
    if (currentTime > data.resetTime) {
      captchaRateLimit.delete(ip);
    }
  });
}, 2 * 60 * 1000);

// Security: Check rate limit for CAPTCHA generation
function checkCaptchaRateLimit(ipAddress: string): boolean {
  // Skip rate limiting in development mode
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const now = Date.now();
  const limit = captchaRateLimit.get(ipAddress);
  
  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    captchaRateLimit.set(ipAddress, {
      count: 1,
      resetTime: now + (15 * 60 * 1000), // 15 minutes
    });
    return true;
  }
  
  // Max 100 CAPTCHAs per 15 minutes per IP (increased for high usage scenarios)
  if (limit.count >= 100) {
    console.warn(`CAPTCHA rate limit exceeded for IP: ${ipAddress}`);
    return false;
  }
  
  limit.count++;
  return true;
}

export function generateCaptcha(ipAddress?: string): { id: string; svg: string } | null {
  // Security: Rate limit CAPTCHA generation per IP
  if (ipAddress && !checkCaptchaRateLimit(ipAddress)) {
    console.warn(`CAPTCHA generation rate limit exceeded for IP: ${ipAddress}`);
    return null;
  }

  // Security: Enhanced randomization to prevent pre-processing attacks
  const backgrounds = [
    '#f8f9fa', '#e9ecef', '#dee2e6', '#f1f3f5', '#e8eaf6', 
    '#fff3e0', '#f3e5f5', '#e0f2f1'
  ];
  const noiseLevel = 3 + Math.floor(Math.random() * 3); // 3-5 noise lines (random)
  const size = 5; // Fixed 5 characters for consistency
  const fontSize = 45 + Math.floor(Math.random() * 15); // 45-60 (random size)
  
  // Generate CAPTCHA with enhanced random options
  const captcha = svgCaptcha.create({
    size: size,
    noise: noiseLevel,
    color: true, // Use colors
    background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
    width: 200 + Math.floor(Math.random() * 50), // 200-250 (random width)
    height: 80 + Math.floor(Math.random() * 20),  // 80-100 (random height)
    fontSize: fontSize,
    // Exclude confusing characters (0, O, 1, I, l)
    charPreset: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
    ignoreChars: '0O1Il', // Additional safety
  });

  // Generate cryptographically secure session ID
  const sessionId = randomBytes(32).toString('hex'); // Increased from 16 to 32 bytes
  
  // Security: Hash the CAPTCHA text instead of storing plaintext
  const textHash = hashCaptchaText(captcha.text, sessionId);
  
  // Store session with hash (never store plaintext)
  captchaSessions.set(sessionId, {
    id: sessionId,
    textHash: textHash,
    createdAt: new Date(),
    attempts: 0,
    verified: false,
    used: false,
    ipAddress: ipAddress,
  });

  console.log(`CAPTCHA generated for session: ${sessionId} from IP: ${ipAddress || 'unknown'}`);

  return {
    id: sessionId,
    svg: captcha.data,
  };
}

export function verifyCaptcha(sessionId: string, input: string, ipAddress?: string, consume: boolean = false): boolean {
  // Development mode: allow bypass with specific values or any input if session exists
  if (process.env.NODE_ENV === 'development') {
    if (input === 'dev' || input === 'test' || input === 'bypass') {
      console.log('Development mode: CAPTCHA bypassed with special value');
      return true;
    }
    
    // In development, also allow any non-empty input if session exists
    const session = captchaSessions.get(sessionId);
    if (session && input && input.trim().length > 0) {
      console.log('Development mode: CAPTCHA accepted with any non-empty input');
      if (consume) {
        captchaSessions.delete(sessionId);
      } else {
        session.verified = true;
        // Don't mark as used in development mode for client-side verification
      }
      return true;
    }
  }

  const session = captchaSessions.get(sessionId);
  
  if (!session) {
    console.warn(`CAPTCHA verification failed: Session not found - ${sessionId}`);
    return false; // Session not found or expired
  }

  // Security: Prevent CAPTCHA reuse - once used, cannot be used again
  if (session.used) {
    console.warn(`CAPTCHA reuse attempt detected for session: ${sessionId} from IP: ${ipAddress || 'unknown'}`);
    captchaSessions.delete(sessionId);
    return false;
  }

  // Security: Verify IP address matches (optional but recommended)
  // Skip IP validation in development mode to prevent issues
  if (process.env.NODE_ENV !== 'development' && ipAddress && session.ipAddress && session.ipAddress !== ipAddress) {
    console.warn(`CAPTCHA IP mismatch: Session IP ${session.ipAddress} vs Request IP ${ipAddress}`);
    captchaSessions.delete(sessionId);
    return false;
  }

  // Increment attempt counter
  session.attempts++;

  // Security: Check if too many attempts (prevent brute force) - reduced to 3 attempts
  if (session.attempts > 3) {
    console.warn(`CAPTCHA brute force detected: ${session.attempts} attempts for session ${sessionId}`);
    captchaSessions.delete(sessionId);
    return false;
  }

  // Security: Check if expired (3 minutes - reduced from 5)
  const now = new Date();
  const expiryTime = new Date(session.createdAt.getTime() + 3 * 60 * 1000);
  if (now > expiryTime) {
    console.warn(`CAPTCHA expired for session: ${sessionId}`);
    captchaSessions.delete(sessionId);
    return false;
  }

  // Security: Verify using hash (constant-time comparison via hash)
  const isValid = verifyCaptchaHash(input, session.textHash, sessionId);
  
  if (isValid) {
    // Only mark as used if we're consuming the CAPTCHA (login process)
    // Don't mark as used for client-side verification (preview)
    if (consume) {
      session.used = true;
      // Remove session after successful verification
      captchaSessions.delete(sessionId);
      console.log(`CAPTCHA verified and consumed for session: ${sessionId}`);
    } else {
      // Mark as verified but keep session temporarily for reuse
      session.verified = true;
      console.log(`CAPTCHA verified for session: ${sessionId} (not consumed)`);
    }
  } else {
    console.warn(`CAPTCHA verification failed: Invalid input for session ${sessionId}`);
  }

  return isValid;
}

export function refreshCaptcha(sessionId: string, ipAddress?: string): { id: string; svg: string } | null {
  const session = captchaSessions.get(sessionId);
  
  if (session) {
    // Delete old session (prevents reuse)
    captchaSessions.delete(sessionId);
    console.log(`CAPTCHA refreshed for session: ${sessionId}`);
  }
  
  // Generate new CAPTCHA with rate limiting
  return generateCaptcha(ipAddress);
}

// Security: Remove debugging functions that could leak CAPTCHA information
// NEVER expose session information to client

// Minimal session validation (no data exposure)
export function isCaptchaSessionValid(sessionId: string): boolean {
  const session = captchaSessions.get(sessionId);
  if (!session) return false;
  
  // Check if expired
  const now = new Date();
  const expiryTime = new Date(session.createdAt.getTime() + 3 * 60 * 1000);
  if (now > expiryTime) {
    captchaSessions.delete(sessionId);
    return false;
  }
  
  // Check if already used
  if (session.used) {
    return false;
  }
  
  return true;
}

// Get CAPTCHA statistics (for monitoring only - no sensitive data)
export function getCaptchaStats() {
  return {
    activeSessions: captchaSessions.size,
    ratelimitedIPs: captchaRateLimit.size,
  };
}

// Clear CAPTCHA rate limiting (for testing/admin)
export function clearCaptchaRateLimit() {
  captchaRateLimit.clear();
  console.log('CAPTCHA rate limiting cleared');
}