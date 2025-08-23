import svgCaptcha from 'svg-captcha';
import { randomBytes } from 'crypto';

interface CaptchaSession {
  id: string;
  text: string;
  createdAt: Date;
  attempts: number;
  verified: boolean;
}

// In-memory store for CAPTCHA sessions (in production, use Redis or database)
const captchaSessions = new Map<string, CaptchaSession>();

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = new Date();
  captchaSessions.forEach((session, id) => {
    const expiryTime = new Date(session.createdAt.getTime() + 5 * 60 * 1000); // 5 minutes
    if (now > expiryTime) {
      captchaSessions.delete(id);
    }
  });
}, 5 * 60 * 1000);

export function generateCaptcha(): { id: string; svg: string } {
  // Generate CAPTCHA with custom options
  const captcha = svgCaptcha.create({
    size: 5, // 5 characters
    noise: 3, // Add noise lines
    color: true, // Use colors
    background: '#f8f9fa', // Light background
    width: 200,
    height: 80,
    fontSize: 50,
    charPreset: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ', // Exclude confusing characters
  });

  const sessionId = randomBytes(16).toString('hex');
  
  // Store session
  captchaSessions.set(sessionId, {
    id: sessionId,
    text: captcha.text.toUpperCase(),
    createdAt: new Date(),
    attempts: 0,
    verified: false,
  });

  return {
    id: sessionId,
    svg: captcha.data,
  };
}

export function verifyCaptcha(sessionId: string, userInput: string, markAsUsed: boolean = false): boolean {
  const session = captchaSessions.get(sessionId);
  
  if (!session) {
    return false; // Session not found or expired
  }

  // Increment attempt counter
  session.attempts++;

  // Check if too many attempts (prevent brute force)
  if (session.attempts > 3) {
    captchaSessions.delete(sessionId);
    return false;
  }

  // Check if expired (5 minutes)
  const now = new Date();
  const expiryTime = new Date(session.createdAt.getTime() + 5 * 60 * 1000);
  if (now > expiryTime) {
    captchaSessions.delete(sessionId);
    return false;
  }

  // Verify the text (case-insensitive)
  const isValid = session.text.toLowerCase() === userInput.toLowerCase();
  
  if (isValid) {
    if (markAsUsed) {
      // Remove session after successful verification during login
      captchaSessions.delete(sessionId);
    } else {
      // Mark as verified but keep session for login
      session.verified = true;
    }
  }

  return isValid;
}

export function refreshCaptcha(sessionId: string): { id: string; svg: string } | null {
  const session = captchaSessions.get(sessionId);
  
  if (session) {
    // Delete old session
    captchaSessions.delete(sessionId);
  }
  
  // Generate new CAPTCHA
  return generateCaptcha();
}

// Get session info (for debugging)
export function getCaptchaSession(sessionId: string): CaptchaSession | undefined {
  return captchaSessions.get(sessionId);
}

// Clean up specific session
export function deleteCaptchaSession(sessionId: string): boolean {
  return captchaSessions.delete(sessionId);
}

// Check if CAPTCHA is already verified
export function isCaptchaVerified(sessionId: string): boolean {
  const session = captchaSessions.get(sessionId);
  return session ? session.verified : false;
}