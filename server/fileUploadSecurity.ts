// Comprehensive File Upload Security System
// Prevents malicious file uploads with whitelist filtering, MIME validation, and security checks

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import { Request } from 'express';

// File upload security configuration
const FILE_UPLOAD_CONFIG = {
  // File size limits (in bytes)
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB for images
  MAX_DOCUMENT_SIZE: 25 * 1024 * 1024, // 25MB for documents
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB for videos
  
  // File count limits
  MAX_FILES_PER_REQUEST: 1,
  MAX_FILES_PER_USER_PER_HOUR: 10,
  
  // Upload directories
  UPLOAD_DIR: './uploads',
  IMAGE_DIR: './uploads/images',
  DOCUMENT_DIR: './uploads/documents',
  VIDEO_DIR: './uploads/videos',
  TEMP_DIR: './uploads/temp',
  
  // Security settings
  ALLOW_DOT_FILES: false,
  ALLOW_DOUBLE_EXTENSIONS: false,
  ALLOW_NULL_BYTES: false,
  ALLOW_META_CHARACTERS: false,
  MAX_FILENAME_LENGTH: 255,
  
  // File type validation
  ALLOWED_EXTENSIONS: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    videos: ['.mp4', '.webm', '.ogg', '.avi', '.mov'],
  },
  
  ALLOWED_MIME_TYPES: {
    images: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
    ],
    videos: [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/quicktime',
    ],
  },
  
  // Dangerous file patterns
  DANGEROUS_PATTERNS: [
    /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|aspx|jsp)$/i,
    /\.(sh|bash|zsh|fish|ps1|psm1)$/i,
    /\.(sql|db|sqlite|sqlite3)$/i,
    /\.(htaccess|htpasswd|ini|conf|config)$/i,
  ],
  
  // Suspicious content patterns
  SUSPICIOUS_CONTENT: [
    /<\?php/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ],
};

// File upload tracking for rate limiting
const uploadTracking = new Map<string, { count: number; resetTime: number }>();

// Initialize file upload security
export function initializeFileUploadSecurity() {
  console.log('📁 Initializing file upload security system...');
  
  // Create upload directories with proper permissions
  createUploadDirectories();
  
  // Set directory permissions
  setDirectoryPermissions();
  
  // Clean up old temporary files
  cleanupTempFiles();
  
  console.log('✅ File upload security system initialized');
}

// Create upload directories
function createUploadDirectories() {
  const directories = [
    FILE_UPLOAD_CONFIG.UPLOAD_DIR,
    FILE_UPLOAD_CONFIG.IMAGE_DIR,
    FILE_UPLOAD_CONFIG.DOCUMENT_DIR,
    FILE_UPLOAD_CONFIG.VIDEO_DIR,
    FILE_UPLOAD_CONFIG.TEMP_DIR,
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
      console.log(`Created upload directory: ${dir}`);
    }
  });
}

// Set directory permissions (Unix-like systems)
function setDirectoryPermissions() {
  if (process.platform !== 'win32') {
    const directories = [
      FILE_UPLOAD_CONFIG.UPLOAD_DIR,
      FILE_UPLOAD_CONFIG.IMAGE_DIR,
      FILE_UPLOAD_CONFIG.DOCUMENT_DIR,
      FILE_UPLOAD_CONFIG.VIDEO_DIR,
    ];
    
    directories.forEach(dir => {
      try {
        fs.chmodSync(dir, 0o755); // Read, write, execute for owner; read, execute for group and others
        console.log(`Set permissions for directory: ${dir}`);
      } catch (error) {
        console.error(`Error setting permissions for ${dir}:`, error);
      }
    });
  }
}

// Clean up temporary files
function cleanupTempFiles() {
  try {
    const tempFiles = fs.readdirSync(FILE_UPLOAD_CONFIG.TEMP_DIR);
    const now = Date.now();
    
    tempFiles.forEach(file => {
      const filePath = path.join(FILE_UPLOAD_CONFIG.TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      
      // Remove files older than 1 hour
      if (now - stats.mtime.getTime() > 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up temp file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
}

// Validate filename security
export function validateFilename(filename: string): { valid: boolean; error?: string; sanitized?: string } {
  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'Invalid filename' };
  }
  
  // Check filename length
  if (filename.length > FILE_UPLOAD_CONFIG.MAX_FILENAME_LENGTH) {
    return { valid: false, error: 'Filename too long' };
  }
  
  // Check for null bytes
  if (!FILE_UPLOAD_CONFIG.ALLOW_NULL_BYTES && filename.includes('\0')) {
    return { valid: false, error: 'Null bytes not allowed in filename' };
  }
  
  // Check for double extensions
  if (!FILE_UPLOAD_CONFIG.ALLOW_DOUBLE_EXTENSIONS) {
    const parts = filename.split('.');
    if (parts.length > 2) {
      return { valid: false, error: 'Double extensions not allowed' };
    }
  }
  
  // Check for double dots
  if (filename.includes('..')) {
    return { valid: false, error: 'Double dots not allowed in filename' };
  }
  
  // Check for meta characters
  if (!FILE_UPLOAD_CONFIG.ALLOW_META_CHARACTERS) {
    const metaChars = /[<>:"|?*\x00-\x1f]/;
    if (metaChars.test(filename)) {
      return { valid: false, error: 'Meta characters not allowed in filename' };
    }
  }
  
  // Check for dot files
  if (!FILE_UPLOAD_CONFIG.ALLOW_DOT_FILES && filename.startsWith('.')) {
    return { valid: false, error: 'Dot files not allowed' };
  }
  
  // Check for dangerous patterns
  for (const pattern of FILE_UPLOAD_CONFIG.DANGEROUS_PATTERNS) {
    if (pattern.test(filename)) {
      return { valid: false, error: 'Dangerous file extension detected' };
    }
  }
  
  // Sanitize filename
  const sanitized = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
  
  return { valid: true, sanitized };
}

// Validate file extension
export function validateFileExtension(filename: string, category: 'images' | 'documents' | 'videos'): boolean {
  const ext = path.extname(filename).toLowerCase();
  const allowedExtensions = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS[category];
  
  return allowedExtensions.includes(ext);
}

// Validate MIME type
export function validateMimeType(mimetype: string, category: 'images' | 'documents' | 'videos'): boolean {
  const allowedMimeTypes = FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES[category];
  
  return allowedMimeTypes.includes(mimetype);
}

// Validate file size
export function validateFileSize(size: number, category: 'images' | 'documents' | 'videos'): boolean {
  const maxSizes = {
    images: FILE_UPLOAD_CONFIG.MAX_IMAGE_SIZE,
    documents: FILE_UPLOAD_CONFIG.MAX_DOCUMENT_SIZE,
    videos: FILE_UPLOAD_CONFIG.MAX_VIDEO_SIZE,
  };
  
  return size <= maxSizes[category];
}

// Detect file category from MIME type
export function detectFileCategory(mimetype: string): 'images' | 'documents' | 'videos' | null {
  if (FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.images.includes(mimetype)) {
    return 'images';
  }
  if (FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.documents.includes(mimetype)) {
    return 'documents';
  }
  if (FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.videos.includes(mimetype)) {
    return 'videos';
  }
  return null;
}

// Check file content for suspicious patterns
export function checkFileContent(buffer: Buffer): { safe: boolean; reason?: string } {
  const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024)); // Check first 1KB
  
  for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
    if (pattern.test(content)) {
      return { safe: false, reason: 'Suspicious content detected' };
    }
  }
  
  return { safe: true };
}

// Rate limiting for file uploads
export function checkUploadRateLimit(userId: string): boolean {
  const now = Date.now();
  const userUploads = uploadTracking.get(userId);
  
  if (!userUploads || now > userUploads.resetTime) {
    uploadTracking.set(userId, {
      count: 1,
      resetTime: now + (60 * 60 * 1000), // 1 hour
    });
    return true;
  }
  
  if (userUploads.count >= FILE_UPLOAD_CONFIG.MAX_FILES_PER_USER_PER_HOUR) {
    return false;
  }
  
  userUploads.count++;
  return true;
}

// Generate secure filename
export function generateSecureFilename(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  const hash = createHash('md5').update(`${originalName}${userId}${timestamp}`).digest('hex').substring(0, 8);
  const ext = path.extname(originalName).toLowerCase();
  
  return `${timestamp}-${random}-${hash}${ext}`;
}

// Create secure multer storage
export function createSecureStorage(category: 'images' | 'documents' | 'videos') {
  const uploadDir = {
    images: FILE_UPLOAD_CONFIG.IMAGE_DIR,
    documents: FILE_UPLOAD_CONFIG.DOCUMENT_DIR,
    videos: FILE_UPLOAD_CONFIG.VIDEO_DIR,
  }[category];
  
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req: any, file, cb) => {
      const userId = req.user?.id || 'anonymous';
      const secureFilename = generateSecureFilename(file.originalname, userId);
      cb(null, secureFilename);
    },
  });
}

// Create secure file filter
export function createSecureFileFilter(category: 'images' | 'documents' | 'videos') {
  return (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    try {
      // Validate filename
      const filenameValidation = validateFilename(file.originalname);
      if (!filenameValidation.valid) {
        return cb(new Error(`Filename validation failed: ${filenameValidation.error}`));
      }
      
      // Validate file extension
      if (!validateFileExtension(file.originalname, category)) {
        return cb(new Error(`Invalid file extension for ${category}`));
      }
      
      // Validate MIME type
      if (!validateMimeType(file.mimetype, category)) {
        return cb(new Error(`Invalid MIME type for ${category}`));
      }
      
      // Rate limiting
      const userId = req.user?.id || req.ip || 'anonymous';
      if (!checkUploadRateLimit(userId)) {
        return cb(new Error('Upload rate limit exceeded'));
      }
      
      cb(null, true);
    } catch (error) {
      cb(new Error('File validation error'));
    }
  };
}

// Create secure multer instance
export function createSecureUpload(category: 'images' | 'documents' | 'videos') {
  const maxSize = {
    images: FILE_UPLOAD_CONFIG.MAX_IMAGE_SIZE,
    documents: FILE_UPLOAD_CONFIG.MAX_DOCUMENT_SIZE,
    videos: FILE_UPLOAD_CONFIG.MAX_VIDEO_SIZE,
  }[category];
  
  return multer({
    storage: createSecureStorage(category),
    limits: {
      fileSize: maxSize,
      files: FILE_UPLOAD_CONFIG.MAX_FILES_PER_REQUEST,
    },
    fileFilter: createSecureFileFilter(category),
  });
}

// Enhanced file validation middleware
export function enhancedFileValidation(req: any, res: any, next: any) {
  if (!req.file) {
    return next();
  }
  
  try {
    const file = req.file;
    
    // Additional file content validation
    const contentCheck = checkFileContent(file.buffer);
    if (!contentCheck.safe) {
      // Delete the uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: `File content validation failed: ${contentCheck.reason}`,
      });
    }
    
    // Log successful upload
    console.log(`File uploaded successfully: ${file.filename} (${file.size} bytes)`);
    
    next();
  } catch (error) {
    console.error('File validation error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'File validation error',
    });
  }
}

// Get file upload statistics
export function getFileUploadStats() {
  return {
    uploadTracking: uploadTracking.size,
    maxFileSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
    maxImageSize: FILE_UPLOAD_CONFIG.MAX_IMAGE_SIZE,
    maxDocumentSize: FILE_UPLOAD_CONFIG.MAX_DOCUMENT_SIZE,
    maxVideoSize: FILE_UPLOAD_CONFIG.MAX_VIDEO_SIZE,
    allowedExtensions: FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS,
    allowedMimeTypes: FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES,
  };
}

// Clear upload tracking (for testing)
export function clearUploadTracking() {
  uploadTracking.clear();
  console.log('Upload tracking cleared');
}

// Run cleanup every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);
