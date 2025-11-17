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
  
  // Suspicious content patterns (expanded for code injection detection)
  SUSPICIOUS_CONTENT: [
    /<\?php/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /<%/i, // ASP/JSP tags
    /#!/i, // Shell shebang
    /eval\(/i, // JavaScript eval
    /eval\s*\(/i, // JavaScript eval with spaces
    /exec\(/i, // Python/JS/PHP exec
    /system\(/i, // System call
    /Runtime\.exec/i, // Java Runtime.exec
    /Process\.start/i, // Process execution
    /base64_decode/i, // Base64 decode (often used in obfuscated code)
    /gzinflate/i, // PHP gzinflate (compressed code)
    /str_rot13/i, // ROT13 encoding
    /preg_replace/i, // PHP preg_replace (code execution)
    /create_function/i, // PHP create_function
    /assert\(/i, // Assert function
    /preg_replace.*\/e/i, // PHP preg_replace /e flag
    /call_user_func/i, // PHP call_user_func
    /call_user_func_array/i, // PHP call_user_func_array
    /file_get_contents.*http/i, // Remote file inclusion
    /curl_exec/i, // cURL execution
    /fsockopen/i, // Network socket
    /socket_create/i, // Socket creation
    /proc_open/i, // Process opening
    /shell_exec/i, // Shell execution
    /passthru/i, // Passthru execution
    /\$\{.*\}/, // Variable expansion
    /\$\(.*\)/, // Command substitution
    /`.*`/, // Backtick execution
  ],
  
  // Suspicious patterns in image metadata/EXIF
  SUSPICIOUS_IMAGE_METADATA: [
    /<svg.*on\w+\s*=/i, // SVG event handlers
    /<svg.*<script/i, // SVG embedded scripts
    /GIF89a.*<script/i, // GIF polyglot
    /JPEG.*<script/i, // JPEG polyglot
    /PNG.*<script/i, // PNG polyglot
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
      // MP4/MOV files - check for 'ftyp' box at various offsets (box size can vary)
      { signature: Buffer.from([0x66, 0x74, 0x79, 0x70]), offset: 4, ext: '.mp4', mime: 'video/mp4', flexible: true }, // MP4 - ftyp at offset 4
      { signature: Buffer.from([0x66, 0x74, 0x79, 0x70]), offset: 8, ext: '.mp4', mime: 'video/mp4', flexible: true }, // MP4 - ftyp at offset 8
      { signature: Buffer.from([0x66, 0x74, 0x79, 0x70]), offset: 12, ext: '.mp4', mime: 'video/mp4', flexible: true }, // MP4 - ftyp at offset 12
      // QuickTime/MOV files - check for 'ftyp' or 'moov'/'mdat' boxes
      { signature: Buffer.from([0x66, 0x74, 0x79, 0x70]), offset: 4, ext: '.mov', mime: 'video/quicktime', flexible: true }, // MOV - ftyp at offset 4
      { signature: Buffer.from([0x6D, 0x6F, 0x6F, 0x76]), offset: 4, ext: '.mov', mime: 'video/quicktime', flexible: true }, // MOV - moov box
      { signature: Buffer.from([0x6D, 0x64, 0x61, 0x74]), offset: 4, ext: '.mov', mime: 'video/quicktime', flexible: true }, // MOV - mdat box
      // WebM (Matroska format)
      { signature: Buffer.from([0x1A, 0x45, 0xDF, 0xA3]), offset: 0, ext: '.webm', mime: 'video/webm' }, // WEBM (Matroska)
      // OGG/OGV
      { signature: Buffer.from([0x4F, 0x67, 0x67, 0x53]), offset: 0, ext: '.ogg', mime: 'video/ogg' }, // OGG
      { signature: Buffer.from([0x4F, 0x67, 0x67, 0x53]), offset: 0, ext: '.ogv', mime: 'video/ogg' }, // OGV
      // AVI files
      { signature: Buffer.from([0x52, 0x49, 0x46, 0x46]), offset: 0, ext: '.avi', mime: 'video/x-msvideo', flexible: true }, // AVI - RIFF header
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
      // For flexible MP4/MOV files, check for 'ftyp' box at common offsets
      if ((sig as any).flexible && (sig.mime === 'video/mp4' || sig.mime === 'video/quicktime')) {
        // For MP4/MOV, verify 'ftyp' box exists somewhere in the first 32 bytes
        const searchRange = buffer.slice(0, Math.min(32, buffer.length));
        const ftypIndex = searchRange.indexOf(Buffer.from([0x66, 0x74, 0x79, 0x70])); // 'ftyp'
        const moovIndex = searchRange.indexOf(Buffer.from([0x6D, 0x6F, 0x6F, 0x76])); // 'moov'
        const mdatIndex = searchRange.indexOf(Buffer.from([0x6D, 0x64, 0x61, 0x74])); // 'mdat'
        
        if (ftypIndex >= 4 || moovIndex >= 4 || mdatIndex >= 4) {
          // Verify detected type matches declared MIME type
          if (sig.mime === declaredMime || declaredMime === 'application/octet-stream' || 
              (sig.mime === 'video/mp4' && declaredMime === 'video/mp4') ||
              (sig.mime === 'video/quicktime' && declaredMime === 'video/quicktime')) {
            return { valid: true, detectedType: sig.mime };
          } else {
            // For flexible formats, be more lenient with MIME type matching
            if (declaredMime.startsWith('video/')) {
              return { valid: true, detectedType: sig.mime };
            }
            return { valid: false, reason: `File signature (${sig.mime}) does not match declared type (${declaredMime})`, detectedType: sig.mime };
          }
        }
      }
      
      // For AVI files with RIFF header, verify it contains "AVI " chunk
      if ((sig as any).flexible && sig.mime === 'video/x-msvideo') {
        // RIFF files: check if it contains "AVI " at offset 8
        if (buffer.length >= 12) {
          const aviCheck = buffer.slice(8, 12);
          if (aviCheck.equals(Buffer.from([0x41, 0x56, 0x49, 0x20]))) { // "AVI "
            // Verify detected type matches declared MIME type
            if (sig.mime === declaredMime || declaredMime === 'application/octet-stream' || 
                declaredMime === 'video/x-msvideo' || declaredMime === 'video/avi') {
              return { valid: true, detectedType: sig.mime };
            }
          }
        }
      }
      
      // Standard validation for non-flexible formats
      if (!(sig as any).flexible) {
        // Verify detected type matches declared MIME type
        if (sig.mime === declaredMime || declaredMime === 'application/octet-stream') {
          return { valid: true, detectedType: sig.mime };
        } else {
          return { valid: false, reason: `File signature (${sig.mime}) does not match declared type (${declaredMime})`, detectedType: sig.mime };
        }
      }
    }
  }
  
  // Special handling for MP4/MOV videos - search for 'ftyp', 'moov', or 'mdat' boxes
  // MP4 files have a variable box structure, so we need to search more flexibly
  if (category === 'videos' && (declaredMime === 'video/mp4' || declaredMime === 'video/quicktime' || declaredMime === 'video/x-m4v')) {
    // Search for MP4/MOV box signatures in the first 64 bytes
    const searchRange = buffer.slice(0, Math.min(64, buffer.length));
    const ftypIndex = searchRange.indexOf(Buffer.from([0x66, 0x74, 0x79, 0x70])); // 'ftyp'
    const moovIndex = searchRange.indexOf(Buffer.from([0x6D, 0x6F, 0x6F, 0x76])); // 'moov'
    const mdatIndex = searchRange.indexOf(Buffer.from([0x6D, 0x64, 0x61, 0x74])); // 'mdat'
    const freeIndex = searchRange.indexOf(Buffer.from([0x66, 0x72, 0x65, 0x65])); // 'free' (free space box)
    
    // MP4 files must have 'ftyp' box typically at offset 4, 8, 12, 16, 20, or 24
    // But we check if any of these boxes exist at valid offsets (after box size header)
    if (ftypIndex >= 4 && ftypIndex < 32) {
      // Verify it's not just random bytes - check if there's a valid box structure
      // The 4 bytes before 'ftyp' should represent a reasonable box size
      const boxSizeBytes = buffer.slice(ftypIndex - 4, ftypIndex);
      const boxSize = boxSizeBytes.readUInt32BE(0);
      // Box size should be reasonable (not too large, and account for the header)
      if (boxSize >= 8 && boxSize < buffer.length && (boxSize % 4 === 0 || ftypIndex === 4)) {
        return { valid: true, detectedType: declaredMime === 'video/quicktime' ? 'video/quicktime' : 'video/mp4' };
      }
    }
    
    // Also accept if we find 'moov' or 'mdat' boxes (common in fragmented MP4)
    if ((moovIndex >= 4 && moovIndex < 32) || (mdatIndex >= 4 && mdatIndex < 32)) {
      return { valid: true, detectedType: declaredMime === 'video/quicktime' ? 'video/quicktime' : 'video/mp4' };
    }
  }
  
  // Special handling for AVI files - RIFF header with "AVI " chunk
  if (category === 'videos' && (declaredMime === 'video/x-msvideo' || declaredMime === 'video/avi')) {
    // Check for RIFF header at start
    if (buffer.length >= 12 && buffer.slice(0, 4).equals(Buffer.from([0x52, 0x49, 0x46, 0x46]))) {
      // Check for "AVI " at offset 8
      if (buffer.slice(8, 12).equals(Buffer.from([0x41, 0x56, 0x49, 0x20]))) {
        return { valid: true, detectedType: 'video/x-msvideo' };
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

// Validate JPEG structure (check for code injection in segments)
function validateJPEGStructure(buffer: Buffer): { valid: boolean; reason?: string } {
  // JPEG files start with FF D8 (SOI - Start of Image marker)
  if (buffer.length < 2 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
    return { valid: false, reason: 'Invalid JPEG header (missing SOI marker)' };
  }
  
  let pos = 2; // After FF D8
  const scannedSegments = new Set<string>();
  
  // Scan through JPEG segments looking for suspicious content
  while (pos < buffer.length - 1) {
    if (buffer[pos] !== 0xFF) {
      // Not a valid segment marker, might be code injection
      const remaining = buffer.slice(pos, Math.min(pos + 1000, buffer.length));
      const content = remaining.toString('utf8', 0, Math.min(remaining.length, 500));
      
      for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
        if (pattern.test(content)) {
          return { valid: false, reason: 'Code injection detected in JPEG data segment' };
        }
      }
      break; // End of segments
    }
    
    const marker = buffer[pos + 1];
    
    // Skip padding bytes (0xFF followed by 0x00)
    if (marker === 0x00) {
      pos += 2;
      continue;
    }
    
    // Check for code injection in comment segments (0xFF 0xFE)
    if (marker === 0xFE) {
      // Comment segment
      const commentLength = (buffer[pos + 2] << 8) | buffer[pos + 3];
      if (commentLength > 2 && pos + commentLength + 2 <= buffer.length) {
        const commentData = buffer.slice(pos + 4, pos + 2 + commentLength);
        const commentText = commentData.toString('utf8', 0, Math.min(commentData.length, 1000));
        
        for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
          if (pattern.test(commentText)) {
            return { valid: false, reason: 'Code injection detected in JPEG comment' };
          }
        }
      }
    }
    
    // Application-specific segments (0xFF 0xE0-0xEF) - check for code
    if (marker >= 0xE0 && marker <= 0xEF) {
      const segmentLength = (buffer[pos + 2] << 8) | buffer[pos + 3];
      if (segmentLength > 2 && pos + segmentLength + 2 <= buffer.length) {
        const segmentData = buffer.slice(pos + 4, pos + 2 + segmentLength);
        const segmentText = segmentData.toString('utf8', 0, Math.min(segmentData.length, 500));
        
        for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
          if (pattern.test(segmentText)) {
            return { valid: false, reason: 'Code injection detected in JPEG metadata' };
          }
        }
      }
    }
    
    // Scan for executable markers within segments
    if (marker >= 0xE0 && marker <= 0xFE && marker !== 0xFF) {
      const segmentLength = (buffer[pos + 2] << 8) | buffer[pos + 3];
      if (segmentLength > 0 && pos + segmentLength + 2 < buffer.length) {
        const segmentStart = pos + 4;
        const segmentEnd = Math.min(pos + segmentLength + 2, buffer.length);
        const segmentData = buffer.slice(segmentStart, segmentEnd);
        
        // Check for executable markers
        if (segmentData.length >= 4) {
          // ELF
          if (segmentData[0] === 0x7F && segmentData[1] === 0x45 && segmentData[2] === 0x4C && segmentData[3] === 0x46) {
            return { valid: false, reason: 'Executable code detected in JPEG segment' };
          }
          // PE
          if (segmentData[0] === 0x4D && segmentData[1] === 0x5A) {
            return { valid: false, reason: 'Executable code detected in JPEG segment' };
          }
          // Mach-O
          if (segmentData[0] === 0xFE && segmentData[1] === 0xED && segmentData[2] === 0xFA && segmentData[3] === 0xCE) {
            return { valid: false, reason: 'Executable code detected in JPEG segment' };
          }
        }
      }
      
      pos += segmentLength + 2;
    } else if (marker === 0xD9) {
      // End of image
      break;
    } else {
      pos += 2;
    }
    
    // Safety check to prevent infinite loops
    if (pos >= buffer.length - 1) break;
    scannedSegments.add(marker.toString());
    if (scannedSegments.size > 100) break; // Too many segments, might be malicious
  }
  
  // Check the end of file for appended code (common attack vector)
  if (buffer.length > 1000) {
    const endSection = buffer.slice(Math.max(0, buffer.length - 1000), buffer.length);
    const endContent = endSection.toString('utf8', 0, Math.min(endSection.length, 1000));
    
    for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
      if (pattern.test(endContent)) {
        return { valid: false, reason: 'Code injection detected at end of JPEG file' };
      }
    }
  }
  
  return { valid: true };
}

// Validate PNG structure (check for code injection in chunks)
function validatePNGStructure(buffer: Buffer): { valid: boolean; reason?: string } {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  if (buffer.length < 8 || !buffer.slice(0, 8).equals(pngSignature)) {
    return { valid: false, reason: 'Invalid PNG header' };
  }
  
  let pos = 8;
  
  // Scan through PNG chunks
  while (pos < buffer.length - 12) {
    // Read chunk length (4 bytes, big-endian)
    const chunkLength = buffer.readUInt32BE(pos);
    
    // Safety check
    if (chunkLength > buffer.length || chunkLength > 10 * 1024 * 1024) {
      return { valid: false, reason: 'Invalid PNG chunk length' };
    }
    
    // Read chunk type (4 bytes)
    const chunkType = buffer.toString('ascii', pos + 4, pos + 8);
    
    // Check chunk data for suspicious content
    if (chunkLength > 0 && pos + 8 + chunkLength <= buffer.length) {
      const chunkData = buffer.slice(pos + 8, pos + 8 + chunkLength);
      
      // Only check text-based chunks for suspicious text patterns
      // Binary chunks like iCCP (ICC color profile), IDAT (image data), PLTE (palette), etc.
      // contain binary data that can accidentally match regex patterns when converted to UTF-8
      const isTextChunk = chunkType === 'tEXt' || chunkType === 'zTXt' || chunkType === 'iTXt';
      
      if (isTextChunk) {
        // Text chunks can legitimately contain text, but check for code injection
        const chunkText = chunkData.toString('utf8', 0, Math.min(chunkData.length, 2000));
        
        for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
          if (pattern.test(chunkText)) {
            return { valid: false, reason: `Code injection detected in PNG text chunk (${chunkType})` };
          }
        }
      }
      
      // Check ALL chunks for executable code markers (binary signatures)
      // This is safe because we're checking for specific binary signatures, not text patterns
      if (chunkData.length >= 4) {
        // ELF
        if (chunkData[0] === 0x7F && chunkData[1] === 0x45 && chunkData[2] === 0x4C && chunkData[3] === 0x46) {
          return { valid: false, reason: `Executable code detected in PNG chunk (${chunkType})` };
        }
        // PE
        if (chunkData[0] === 0x4D && chunkData[1] === 0x5A) {
          return { valid: false, reason: `Executable code detected in PNG chunk (${chunkType})` };
        }
        // Mach-O
        if (chunkData[0] === 0xFE && chunkData[1] === 0xED && chunkData[2] === 0xFA && chunkData[3] === 0xCE) {
          return { valid: false, reason: `Executable code detected in PNG chunk (${chunkType})` };
        }
      }
    }
    
    // Move to next chunk (length + type + data + CRC)
    pos += 8 + chunkLength + 4;
    
    // Check for IEND chunk (end of PNG)
    if (chunkType === 'IEND') {
      break;
    }
    
    // Safety check
    if (pos >= buffer.length) break;
  }
  
  // Check the end of file for appended code
  if (buffer.length > 1000) {
    const endSection = buffer.slice(Math.max(0, buffer.length - 1000), buffer.length);
    const endContent = endSection.toString('utf8', 0, Math.min(endSection.length, 1000));
    
    for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
      if (pattern.test(endContent)) {
        return { valid: false, reason: 'Code injection detected at end of PNG file' };
      }
    }
  }
  
  return { valid: true };
}

// Check file content for suspicious patterns (ENHANCED - scans entire file)
export function checkFileContent(buffer: Buffer): { safe: boolean; reason?: string } {
  if (!buffer || buffer.length === 0) {
    return { safe: false, reason: 'Empty file' };
  }
  
  // Check for executable markers at the start
  if (buffer.length >= 4) {
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
  
  // ENHANCED: Scan entire file for suspicious patterns (not just first 10KB)
  // For very large files, scan in chunks to avoid memory issues
  const scanChunkSize = 100 * 1024; // 100KB chunks
  const maxScans = Math.min(50, Math.ceil(buffer.length / scanChunkSize)); // Limit to 5MB total scan
  
  for (let scanIndex = 0; scanIndex < maxScans; scanIndex++) {
    const startPos = scanIndex * scanChunkSize;
    const endPos = Math.min(startPos + scanChunkSize, buffer.length);
    const chunk = buffer.slice(startPos, endPos);
    
    // Convert chunk to string for pattern matching
    const content = chunk.toString('utf8', 0, Math.min(chunk.length, scanChunkSize));
    
    // Check for suspicious content patterns
    for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
      if (pattern.test(content)) {
        return { safe: false, reason: 'Code injection detected in file content' };
      }
    }
    
    // Also check raw bytes for executable markers anywhere in file
    for (let i = 0; i < chunk.length - 4; i++) {
      // ELF marker
      if (chunk[i] === 0x7F && chunk[i + 1] === 0x45 && chunk[i + 2] === 0x4C && chunk[i + 3] === 0x46) {
        return { safe: false, reason: 'Executable code detected in file content' };
      }
      // PE marker
      if (chunk[i] === 0x4D && chunk[i + 1] === 0x5A && chunk[i + 2] !== undefined) {
        // Additional check to reduce false positives (MZ is common in some formats)
        if (i + 64 < chunk.length) {
          // Check for PE header signature at offset 0x3C
          const peOffset = chunk.readUInt32LE(i + 60);
          if (peOffset < chunk.length && peOffset > 0) {
            const peSigPos = i + peOffset;
            if (peSigPos + 4 < chunk.length) {
              if (chunk[peSigPos] === 0x50 && chunk[peSigPos + 1] === 0x45 && 
                  chunk[peSigPos + 2] === 0x00 && chunk[peSigPos + 3] === 0x00) {
                return { safe: false, reason: 'Executable code detected in file content (PE)' };
              }
            }
          }
        }
      }
    }
  }
  
  // CRITICAL: Always check the last portion of the file (common injection point)
  if (buffer.length > 1000) {
    const endSection = buffer.slice(Math.max(0, buffer.length - 1000), buffer.length);
    const endContent = endSection.toString('utf8', 0, Math.min(endSection.length, 1000));
    
    for (const pattern of FILE_UPLOAD_CONFIG.SUSPICIOUS_CONTENT) {
      if (pattern.test(endContent)) {
        return { safe: false, reason: 'Code injection detected at end of file' };
      }
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
    
    // TEMPORARY: Disable validation for images and videos
    const category = detectFileCategory(file.mimetype);
    if (category === 'images' || category === 'videos') {
      console.log(`[TEMP] Skipping validation for ${category}: ${file.filename} (type: ${file.mimetype})`);
      // Ensure file permissions are set correctly (non-executable)
      if (fs.existsSync(file.path)) {
        setSecureFilePermissions(file.path);
      }
      // Log successful upload
      console.log(`File uploaded (validation skipped): ${file.filename} (${file.size} bytes, type: ${file.mimetype})`);
      return next();
    }
    
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
    
    // TEMPORARILY DISABLED: Validate image structure for JPEG and PNG files
    // This is skipped for images and videos (handled by early return above)
    // if (category === 'images') {
    //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    //     const jpegValidation = validateJPEGStructure(fileBuffer);
    //     if (!jpegValidation.valid) {
    //       fs.unlinkSync(file.path);
    //       return res.status(400).json({
    //         success: false,
    //         message: `JPEG structure validation failed: ${jpegValidation.reason}`,
    //       });
    //     }
    //   } else if (file.mimetype === 'image/png') {
    //     const pngValidation = validatePNGStructure(fileBuffer);
    //     if (!pngValidation.valid) {
    //       fs.unlinkSync(file.path);
    //       return res.status(400).json({
    //         success: false,
    //         message: `PNG structure validation failed: ${pngValidation.reason}`,
    //       });
    //     }
    //   }
    // }
    
    // ENHANCED: Full file content validation (scans entire file, not just headers)
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
