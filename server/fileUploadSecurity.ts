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
  MAX_FILES_PER_USER_PER_HOUR: 50, // Increased from 10 to 50 for normal usage
  
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
    /<%/i, // ASP/JSP tags
    /#!/i, // Shell shebang
  ],
  
  // File magic numbers (file signatures) for content validation
  // Format: [signature bytes (hex), offset, description]
  FILE_SIGNATURES: {
    images: [
      { signature: Buffer.from([0xFF, 0xD8, 0xFF]), offset: 0, ext: '.jpg', mime: 'image/jpeg' }, // JPEG
      { signature: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), offset: 0, ext: '.png', mime: 'image/png' }, // PNG
      { signature: Buffer.from([0x47, 0x49, 0x46, 0x38]), offset: 0, ext: '.gif', mime: 'image/gif' }, // GIF
      { signature: Buffer.from([0x52, 0x49, 0x46, 0x46]), offset: 0, ext: '.webp', mime: 'image/webp' }, // WEBP (RIFF header)
      { signature: Buffer.from([0x3C, 0x73, 0x76, 0x67]), offset: 0, ext: '.svg', mime: 'image/svg+xml' }, // SVG (text format)
    ],
    documents: [
      { signature: Buffer.from([0x25, 0x50, 0x44, 0x46]), offset: 0, ext: '.pdf', mime: 'application/pdf' }, // PDF
      { signature: Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]), offset: 0, ext: '.doc', mime: 'application/msword' }, // DOC (OLE2)
      { signature: Buffer.from([0x50, 0x4B, 0x03, 0x04]), offset: 0, ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, // DOCX (ZIP-based)
    ],
    videos: [
      { signature: Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]), offset: 4, ext: '.mp4', mime: 'video/mp4' }, // MP4
      { signature: Buffer.from([0x1A, 0x45, 0xDF, 0xA3]), offset: 0, ext: '.webm', mime: 'video/webm' }, // WEBM (Matroska)
      { signature: Buffer.from([0x4F, 0x67, 0x67, 0x53]), offset: 0, ext: '.ogg', mime: 'video/ogg' }, // OGG
    ],
  },
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

// Validate file magic number (file signature) - content-based validation
export function validateFileMagicNumber(buffer: Buffer, category: 'images' | 'documents' | 'videos', declaredMime: string): { valid: boolean; reason?: string; detectedType?: string } {
  if (!buffer || buffer.length < 16) {
    return { valid: false, reason: 'File too small to validate' };
  }
  
  const signatures = FILE_UPLOAD_CONFIG.FILE_SIGNATURES[category];
  
  for (const sig of signatures) {
    if (buffer.length < sig.offset + sig.signature.length) {
      continue;
    }
    
    const fileHeader = buffer.slice(sig.offset, sig.offset + sig.signature.length);
    if (fileHeader.equals(sig.signature)) {
      // Verify detected type matches declared MIME type
      if (sig.mime === declaredMime || declaredMime === 'application/octet-stream') {
        return { valid: true, detectedType: sig.mime };
      } else {
        return { valid: false, reason: `File signature (${sig.mime}) does not match declared type (${declaredMime})`, detectedType: sig.mime };
      }
    }
  }
  
  // Special handling for SVG (text-based, check for SVG markers)
  if (category === 'images' && declaredMime === 'image/svg+xml') {
    const textStart = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
    if (textStart.includes('<svg') || textStart.includes('<?xml')) {
      return { valid: true, detectedType: 'image/svg+xml' };
    }
  }
  
  // Special handling for text files
  if (category === 'documents' && declaredMime === 'text/plain') {
    // Allow if it's valid UTF-8 text
    try {
      buffer.toString('utf8');
      return { valid: true, detectedType: 'text/plain' };
    } catch {
      return { valid: false, reason: 'Invalid text file encoding' };
    }
  }
  
  return { valid: false, reason: `File signature does not match expected ${category} format` };
}

// Check file content for suspicious patterns
export function checkFileContent(buffer: Buffer): { safe: boolean; reason?: string } {
  // Check first 10KB for suspicious patterns
  const content = buffer.toString('utf8', 0, Math.min(buffer.length, 10240));
  
  for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
    if (pattern.test(content)) {
      return { safe: false, reason: 'Suspicious content detected' };
    }
  }
  
  // Check for executable markers
  if (buffer.length >= 2) {
    // ELF executable (Linux/Unix)
    if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
      return { safe: false, reason: 'Executable file detected (ELF)' };
    }
    // PE executable (Windows)
    if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
      return { safe: false, reason: 'Executable file detected (PE)' };
    }
    // Mach-O executable (macOS)
    if (buffer[0] === 0xFE && buffer[1] === 0xED && buffer[2] === 0xFA && buffer[3] === 0xCE) {
      return { safe: false, reason: 'Executable file detected (Mach-O)' };
    }
  }
  
  return { safe: true };
}

// Set secure file permissions (readable but not executable)
export function setSecureFilePermissions(filePath: string): void {
  if (process.platform !== 'win32') {
    try {
      // Set permissions to 644 (rw-r--r--) - readable by all, writable by owner, NOT executable
      fs.chmodSync(filePath, 0o644);
    } catch (error) {
      console.error(`Error setting file permissions for ${filePath}:`, error);
    }
  }
}

// Rate limiting for file uploads
export function checkUploadRateLimit(userId: string): boolean {
  // Skip rate limiting in development mode
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
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

// Enhanced file validation middleware - validates after file is saved
export function enhancedFileValidation(req: any, res: any, next: any) {
  if (!req.file) {
    return next();
  }
  
  try {
    const file = req.file;
    
    // Read file from disk for validation (multer saves to disk, so buffer might be empty)
    const fileBuffer = fs.existsSync(file.path) ? fs.readFileSync(file.path) : (file.buffer || Buffer.alloc(0));
    
    if (fileBuffer.length === 0) {
      // File might still be uploading or buffer was cleared
      return res.status(400).json({
        success: false,
        message: 'File content could not be read for validation',
      });
    }
    
    // Detect file category from declared MIME type
    const category = detectFileCategory(file.mimetype);
    if (!category) {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file category',
      });
    }
    
    // Validate file magic number (content-based validation)
    const magicValidation = validateFileMagicNumber(fileBuffer, category, file.mimetype);
    if (!magicValidation.valid) {
      // Delete the uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: `File content validation failed: ${magicValidation.reason}`,
        details: magicValidation.detectedType ? `Detected as ${magicValidation.detectedType} but declared as ${file.mimetype}` : undefined,
      });
    }
    
    // Additional file content validation (suspicious patterns)
    const contentCheck = checkFileContent(fileBuffer);
    if (!contentCheck.safe) {
      // Delete the uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: `File content validation failed: ${contentCheck.reason}`,
      });
    }
    
    // Ensure file permissions are set correctly (non-executable)
    setSecureFilePermissions(file.path);
    
    // Log successful upload
    console.log(`File uploaded and validated successfully: ${file.filename} (${file.size} bytes, type: ${file.mimetype})`);
    
    next();
  } catch (error: any) {
    console.error('File validation error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'File validation error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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
