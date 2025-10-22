// Email Protection and Obfuscation System
// Prevents email harvesting by bots and scrapers

import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { createCanvas, registerFont } from 'canvas';

// Email protection configuration
const EMAIL_PROTECTION_CONFIG = {
  // Obfuscation methods
  OBFUSCATION_METHODS: ['image', 'obfuscated', 'encoded'],
  
  // Image generation settings
  IMAGE_SETTINGS: {
    width: 200,
    height: 30,
    fontSize: 14,
    fontFamily: 'Arial',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    padding: 5,
  },
  
  // Cache settings
  IMAGE_CACHE_DIR: './uploads/email-images',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  
  // Security settings
  RANDOMIZE_CHARS: true,
  ADD_NOISE: true,
  ROTATE_TEXT: false,
};

// Email obfuscation patterns
const OBFUSCATION_PATTERNS = {
  // Replace @ with [at]
  AT_REPLACEMENT: /@/g,
  AT_REPLACEMENT_TEXT: '[at]',
  
  // Replace . with [dot]
  DOT_REPLACEMENT: /\./g,
  DOT_REPLACEMENT_TEXT: '[dot]',
  
  // Additional obfuscation patterns
  ADDITIONAL_PATTERNS: [
    { pattern: /a/g, replacement: '&#97;' },
    { pattern: /e/g, replacement: '&#101;' },
    { pattern: /i/g, replacement: '&#105;' },
    { pattern: /o/g, replacement: '&#111;' },
    { pattern: /u/g, replacement: '&#117;' },
  ],
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cache for generated images
const imageCache = new Map<string, { path: string; timestamp: number }>();

// Initialize email protection system
export function initializeEmailProtection() {
  console.log('📧 Initializing email protection system...');
  
  // Create email images directory
  if (!fs.existsSync(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR)) {
    fs.mkdirSync(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR, { recursive: true });
  }
  
  // Clean up old cached images
  cleanupOldImages();
  
  console.log('✅ Email protection system initialized');
}

// Clean up old cached images
function cleanupOldImages() {
  try {
    const files = fs.readdirSync(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > EMAIL_PROTECTION_CONFIG.CACHE_DURATION) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old email image: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up old email images:', error);
  }
}

// Generate hash for email (for caching)
function generateEmailHash(email: string): string {
  return createHash('md5').update(email.toLowerCase()).digest('hex');
}

// Obfuscate email using text replacement
export function obfuscateEmail(email: string, method: 'obfuscated' | 'encoded' = 'obfuscated'): string {
  if (!EMAIL_REGEX.test(email)) {
    return email; // Return as-is if not a valid email
  }
  
  let obfuscated = email;
  
  if (method === 'obfuscated') {
    // Replace @ with [at] and . with [dot]
    obfuscated = obfuscated.replace(OBFUSCATION_PATTERNS.AT_REPLACEMENT, OBFUSCATION_PATTERNS.AT_REPLACEMENT_TEXT);
    obfuscated = obfuscated.replace(OBFUSCATION_PATTERNS.DOT_REPLACEMENT, OBFUSCATION_PATTERNS.DOT_REPLACEMENT_TEXT);
  } else if (method === 'encoded') {
    // HTML entity encoding
    obfuscated = obfuscated.replace(OBFUSCATION_PATTERNS.AT_REPLACEMENT, '&#64;');
    obfuscated = obfuscated.replace(OBFUSCATION_PATTERNS.DOT_REPLACEMENT, '&#46;');
    
    // Additional character encoding
    OBFUSCATION_PATTERNS.ADDITIONAL_PATTERNS.forEach(({ pattern, replacement }) => {
      obfuscated = obfuscated.replace(pattern, replacement);
    });
  }
  
  return obfuscated;
}

// Generate email as image
export async function generateEmailImage(email: string): Promise<string> {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error('Invalid email address');
  }
  
  const emailHash = generateEmailHash(email);
  const imagePath = path.join(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR, `${emailHash}.png`);
  
  // Check if image already exists and is not expired
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    if (Date.now() - stats.mtime.getTime() < EMAIL_PROTECTION_CONFIG.CACHE_DURATION) {
      return `/uploads/email-images/${emailHash}.png`;
    }
  }
  
  try {
    // Create canvas
    const canvas = createCanvas(
      EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.width,
      EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.height
    );
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set font
    ctx.font = `${EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.fontSize}px ${EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.fontFamily}`;
    ctx.fillStyle = EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Add some randomization to prevent OCR
    if (EMAIL_PROTECTION_CONFIG.RANDOMIZE_CHARS) {
      // Slightly randomize character positions
      const chars = email.split('');
      let x = EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.padding;
      const y = canvas.height / 2;
      
      chars.forEach((char, index) => {
        const offsetY = (Math.random() - 0.5) * 2; // Small vertical offset
        ctx.fillText(char, x, y + offsetY);
        x += ctx.measureText(char).width;
      });
    } else {
      // Standard text rendering
      ctx.fillText(email, EMAIL_PROTECTION_CONFIG.IMAGE_SETTINGS.padding, canvas.height / 2);
    }
    
    // Add noise to prevent OCR
    if (EMAIL_PROTECTION_CONFIG.ADD_NOISE) {
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      // Add random lines
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      
      // Add random dots
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Save image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);
    
    // Cache the image path
    imageCache.set(emailHash, {
      path: `/uploads/email-images/${emailHash}.png`,
      timestamp: Date.now(),
    });
    
    return `/uploads/email-images/${emailHash}.png`;
  } catch (error) {
    console.error('Error generating email image:', error);
    // Fallback to obfuscated text
    return obfuscateEmail(email, 'obfuscated');
  }
}

// Get protected email (main function)
export async function getProtectedEmail(
  email: string, 
  method: 'image' | 'obfuscated' | 'encoded' = 'obfuscated'
): Promise<{ type: 'image' | 'text'; content: string; original?: string }> {
  if (!EMAIL_REGEX.test(email)) {
    return { type: 'text', content: email };
  }
  
  switch (method) {
    case 'image':
      try {
        const imagePath = await generateEmailImage(email);
        return { 
          type: 'image', 
          content: imagePath,
          original: email 
        };
      } catch (error) {
        console.error('Error generating email image, falling back to obfuscated text:', error);
        return { 
          type: 'text', 
          content: obfuscateEmail(email, 'obfuscated'),
          original: email 
        };
      }
    
    case 'obfuscated':
      return { 
        type: 'text', 
        content: obfuscateEmail(email, 'obfuscated'),
        original: email 
      };
    
    case 'encoded':
      return { 
        type: 'text', 
        content: obfuscateEmail(email, 'encoded'),
        original: email 
      };
    
    default:
      return { 
        type: 'text', 
        content: obfuscateEmail(email, 'obfuscated'),
        original: email 
      };
  }
}

// Protect email in HTML content
export function protectEmailInHTML(html: string, method: 'image' | 'obfuscated' | 'encoded' = 'obfuscated'): string {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  return html.replace(emailRegex, (match) => {
    const protectedEmail = obfuscateEmail(match, method);
    return protectedEmail;
  });
}

// Protect email in text content
export function protectEmailInText(text: string, method: 'obfuscated' | 'encoded' = 'obfuscated'): string {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  return text.replace(emailRegex, (match) => {
    return obfuscateEmail(match, method);
  });
}

// Get email protection statistics
export function getEmailProtectionStats() {
  return {
    cachedImages: imageCache.size,
    cacheDirectory: EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR,
    cacheDuration: EMAIL_PROTECTION_CONFIG.CACHE_DURATION,
    supportedMethods: EMAIL_PROTECTION_CONFIG.OBFUSCATION_METHODS,
  };
}

// Clear email image cache
export function clearEmailImageCache() {
  try {
    const files = fs.readdirSync(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR);
    files.forEach(file => {
      const filePath = path.join(EMAIL_PROTECTION_CONFIG.IMAGE_CACHE_DIR, file);
      fs.unlinkSync(filePath);
    });
    
    imageCache.clear();
    console.log('Email image cache cleared');
  } catch (error) {
    console.error('Error clearing email image cache:', error);
  }
}

// Email protection middleware for API responses
export function emailProtectionMiddleware(req: any, res: any, next: any) {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    if (data && typeof data === 'object') {
      data = protectEmailInObject(data);
    }
    
    return originalJson.call(this, data);
  };
  
  next();
}

// Recursively protect emails in object
function protectEmailInObject(obj: any): any {
  if (typeof obj === 'string') {
    return protectEmailInText(obj, 'obfuscated');
  } else if (Array.isArray(obj)) {
    return obj.map(protectEmailInObject);
  } else if (obj && typeof obj === 'object') {
    const protectedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        protectedObj[key] = protectEmailInObject(obj[key]);
      }
    }
    return protectedObj;
  }
  
  return obj;
}

// API endpoint for email protection
export function setupEmailProtectionRoutes(app: any) {
  console.log('📧 Setting up email protection routes...');
  
  // Get email protection statistics
  app.get('/api/admin/email-protection/stats', (req: any, res: any) => {
    try {
      const stats = getEmailProtectionStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting email protection stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get email protection statistics',
      });
    }
  });
  
  // Clear email image cache
  app.post('/api/admin/email-protection/clear-cache', (req: any, res: any) => {
    try {
      clearEmailImageCache();
      res.json({
        success: true,
        message: 'Email image cache cleared successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clearing email image cache:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear email image cache',
      });
    }
  });
  
  // Test email protection
  app.post('/api/admin/email-protection/test', (req: any, res: any) => {
    try {
      const { email, method = 'obfuscated' } = req.body;
      
      if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Valid email address is required',
        });
      }
      
      const protectedEmail = obfuscateEmail(email, method as 'obfuscated' | 'encoded');
      
      res.json({
        success: true,
        data: {
          original: email,
          protected: protectedEmail,
          method: method,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error testing email protection:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test email protection',
      });
    }
  });
  
  console.log('✅ Email protection routes registered:');
  console.log('  - GET /api/admin/email-protection/stats');
  console.log('  - POST /api/admin/email-protection/clear-cache');
  console.log('  - POST /api/admin/email-protection/test');
}

// Run cleanup every hour
setInterval(cleanupOldImages, 60 * 60 * 1000);
