// Comprehensive Security Logging and Monitoring System
// Implements audit logging with auto-numbering, comprehensive data collection, and reporting

import { Request } from 'express';
import { randomBytes, createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Audit log entry interface
interface AuditLogEntry {
  logNumber: number;
  timestamp: string;
  date: string;
  time: string;
  event: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  username?: string;
  sessionId?: string;
  referrer?: string;
  processId: number;
  url: string;
  method: string;
  userAgent: string;
  country?: string;
  details: any;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING' | 'INFO';
  responseTime?: number;
  requestSize?: number;
  responseSize?: number;
}

// Authentication attempt tracking
interface AuthAttempt {
  username: string;
  attempts: number;
  lastAttempt: Date;
  successfulLogins: number;
  failedLogins: number;
  lastSuccessfulLogin?: Date;
  lastFailedLogin?: Date;
  lockedUntil?: Date;
}

// Security logging configuration
const LOGGING_CONFIG = {
  // Log file paths
  AUDIT_LOG_PATH: process.env.AUDIT_LOG_PATH || './logs/audit.log',
  SECURITY_LOG_PATH: process.env.SECURITY_LOG_PATH || './logs/security.log',
  AUTH_LOG_PATH: process.env.AUTH_LOG_PATH || './logs/auth.log',
  
  // Log rotation settings
  MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_LOG_FILES: 10,
  
  // Audit numbering
  AUDIT_NUMBER_FILE: process.env.AUDIT_NUMBER_FILE || './logs/audit_number.txt',
  
  // Report settings
  REPORT_PATH: process.env.REPORT_PATH || './logs/reports',
  WEEKLY_REPORT_ENABLED: process.env.WEEKLY_REPORT_ENABLED !== 'false',
  
  // Monitoring settings
  ALERT_THRESHOLDS: {
    FAILED_LOGINS_PER_HOUR: 10,
    FAILED_LOGINS_PER_DAY: 50,
    SUSPICIOUS_ACTIVITY_PER_HOUR: 5,
  },
};

// Global audit number counter
let currentAuditNumber = 1;

// Authentication attempt tracking
const authAttempts = new Map<string, AuthAttempt>();

// Initialize logging system
export function initializeLogging() {
  console.log('🔍 Initializing comprehensive security logging system...');
  
  // Create logs directory
  const logsDir = path.dirname(LOGGING_CONFIG.AUDIT_LOG_PATH);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Create reports directory
  if (!fs.existsSync(LOGGING_CONFIG.REPORT_PATH)) {
    fs.mkdirSync(LOGGING_CONFIG.REPORT_PATH, { recursive: true });
  }
  
  // Load current audit number
  loadAuditNumber();
  
  // Initialize log rotation
  setupLogRotation();
  
  // Setup weekly report generation
  if (LOGGING_CONFIG.WEEKLY_REPORT_ENABLED) {
    setupWeeklyReports();
  }
  
  console.log('✅ Security logging system initialized');
}

// Load audit number from file
function loadAuditNumber() {
  try {
    if (fs.existsSync(LOGGING_CONFIG.AUDIT_NUMBER_FILE)) {
      const data = fs.readFileSync(LOGGING_CONFIG.AUDIT_NUMBER_FILE, 'utf8');
      currentAuditNumber = parseInt(data.trim()) || 1;
    }
  } catch (error) {
    console.error('Error loading audit number:', error);
    currentAuditNumber = 1;
  }
}

// Save audit number to file
function saveAuditNumber() {
  try {
    fs.writeFileSync(LOGGING_CONFIG.AUDIT_NUMBER_FILE, currentAuditNumber.toString());
  } catch (error) {
    console.error('Error saving audit number:', error);
  }
}

// Get next audit number (auto-incrementing)
function getNextAuditNumber(): number {
  const number = currentAuditNumber++;
  saveAuditNumber();
  return number;
}

// Get country from IP (simplified - in production, use GeoIP service)
function getCountryFromIP(ip: string): string {
  // Simplified country detection - in production, use MaxMind GeoIP or similar
  if (ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'LOCAL';
  }
  
  // Add more sophisticated IP-to-country mapping here
  return 'UNKNOWN';
}

// Create comprehensive audit log entry
export function createAuditLogEntry(
  event: string,
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  details: any,
  req?: Request,
  status: 'SUCCESS' | 'FAILURE' | 'WARNING' | 'INFO' = 'INFO',
  responseTime?: number,
  requestSize?: number,
  responseSize?: number
): AuditLogEntry {
  const now = new Date();
  const timestamp = now.toISOString();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  
  const logEntry: AuditLogEntry = {
    logNumber: getNextAuditNumber(),
    timestamp,
    date,
    time,
    event,
    severity,
    ipAddress: req?.ip || req?.connection?.remoteAddress || 'unknown',
    username: details.username || req?.user?.username,
    sessionId: req?.sessionID,
    referrer: req?.get('Referer') || req?.get('Referrer'),
    processId: process.pid,
    url: req?.url || req?.originalUrl || 'unknown',
    method: req?.method || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    country: getCountryFromIP(req?.ip || 'unknown'),
    details,
    status,
    responseTime,
    requestSize,
    responseSize,
  };
  
  return logEntry;
}

// Write audit log entry to file
function writeAuditLogEntry(entry: AuditLogEntry) {
  try {
    const logLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(LOGGING_CONFIG.AUDIT_LOG_PATH, logLine);
    
    // Also write to console for immediate visibility
    console.log(`[AUDIT #${entry.logNumber}] ${entry.event} - ${entry.severity} - ${entry.status}`);
    
    // Write to security log for high/critical events
    if (entry.severity === 'HIGH' || entry.severity === 'CRITICAL') {
      fs.appendFileSync(LOGGING_CONFIG.SECURITY_LOG_PATH, logLine);
    }
  } catch (error) {
    console.error('Error writing audit log:', error);
  }
}

// Enhanced security event logging
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
  const logEntry = createAuditLogEntry(event, severity, details, req, status, responseTime, requestSize, responseSize);
  writeAuditLogEntry(logEntry);
  
  // Send alerts for critical events
  if (severity === 'CRITICAL') {
    sendSecurityAlert(logEntry);
  }
}

// Authentication attempt tracking
export function trackAuthAttempt(username: string, success: boolean): boolean {
  const now = new Date();
  let attempt = authAttempts.get(username);
  
  if (!attempt) {
    attempt = {
      username,
      attempts: 0,
      lastAttempt: now,
      successfulLogins: 0,
      failedLogins: 0,
    };
  }
  
  attempt.attempts++;
  attempt.lastAttempt = now;
  
  if (success) {
    attempt.successfulLogins++;
    attempt.lastSuccessfulLogin = now;
    attempt.lockedUntil = undefined; // Reset lockout on success
  } else {
    attempt.failedLogins++;
    attempt.lastFailedLogin = now;
    
    // Check for lockout
    if (attempt.failedLogins >= 5) {
      attempt.lockedUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    }
  }
  
  authAttempts.set(username, attempt);
  
  // Log authentication attempt
  logSecurityEvent(
    success ? 'AUTH_SUCCESS' : 'AUTH_FAILURE',
    {
      username,
      attemptNumber: attempt.attempts,
      totalSuccessful: attempt.successfulLogins,
      totalFailed: attempt.failedLogins,
      lockedUntil: attempt.lockedUntil,
    },
    undefined,
    success ? 'LOW' : 'HIGH',
    success ? 'SUCCESS' : 'FAILURE'
  );
  
  // Check if account should be locked
  return !attempt.lockedUntil || now < attempt.lockedUntil;
}

// Log authentication process
export function logAuthenticationProcess(
  username: string,
  success: boolean,
  details: any,
  req?: Request
) {
  const event = success ? 'AUTHENTICATION_SUCCESS' : 'AUTHENTICATION_FAILURE';
  const severity = success ? 'LOW' : 'HIGH';
  const status = success ? 'SUCCESS' : 'FAILURE';
  
  logSecurityEvent(event, {
    username,
    ...details,
  }, req, severity, status);
  
  // Track in authentication log
  const authLogEntry = {
    timestamp: new Date().toISOString(),
    username,
    success,
    ipAddress: req?.ip || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    details,
  };
  
  try {
    fs.appendFileSync(LOGGING_CONFIG.AUTH_LOG_PATH, JSON.stringify(authLogEntry) + '\n');
  } catch (error) {
    console.error('Error writing auth log:', error);
  }
}

// Send security alert
function sendSecurityAlert(logEntry: AuditLogEntry) {
  console.error(`🚨 CRITICAL SECURITY ALERT: ${logEntry.event}`);
  console.error(`Log #${logEntry.logNumber}: ${JSON.stringify(logEntry, null, 2)}`);
  
  // In production, integrate with alerting system (email, Slack, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to alerting service
  }
}

// Setup log rotation
function setupLogRotation() {
  setInterval(() => {
    rotateLogFile(LOGGING_CONFIG.AUDIT_LOG_PATH);
    rotateLogFile(LOGGING_CONFIG.SECURITY_LOG_PATH);
    rotateLogFile(LOGGING_CONFIG.AUTH_LOG_PATH);
  }, 24 * 60 * 60 * 1000); // Check every 24 hours
}

// Rotate log file if it exceeds size limit
function rotateLogFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > LOGGING_CONFIG.MAX_LOG_SIZE) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedPath = `${filePath}.${timestamp}`;
        fs.renameSync(filePath, rotatedPath);
        
        // Compress old log files
        compressLogFile(rotatedPath);
        
        // Clean up old rotated files
        cleanupOldLogs(filePath);
      }
    }
  } catch (error) {
    console.error('Error rotating log file:', error);
  }
}

// Compress log file
function compressLogFile(filePath: string) {
  // In production, use gzip compression
  // For now, just log the action
  console.log(`Log file rotated: ${filePath}`);
}

// Clean up old log files
function cleanupOldLogs(basePath: string) {
  try {
    const dir = path.dirname(basePath);
    const baseName = path.basename(basePath);
    const files = fs.readdirSync(dir)
      .filter(file => file.startsWith(baseName) && file !== baseName)
      .sort()
      .reverse();
    
    // Keep only the most recent files
    const filesToDelete = files.slice(LOGGING_CONFIG.MAX_LOG_FILES);
    filesToDelete.forEach(file => {
      fs.unlinkSync(path.join(dir, file));
    });
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
  }
}

// Setup weekly report generation
function setupWeeklyReports() {
  // Generate report every Monday at 9 AM
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
  nextMonday.setHours(9, 0, 0, 0);
  
  const timeUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  setTimeout(() => {
    generateWeeklyReport();
    // Set up recurring weekly reports
    setInterval(generateWeeklyReport, 7 * 24 * 60 * 60 * 1000);
  }, timeUntilNextMonday);
}

// Generate weekly security report
export function generateWeeklyReport() {
  console.log('📊 Generating weekly security report...');
  
  try {
    const reportData = {
      reportId: getNextAuditNumber(),
      generatedAt: new Date().toISOString(),
      period: getLastWeekPeriod(),
      summary: generateReportSummary(),
      authenticationStats: getAuthenticationStats(),
      securityEvents: getSecurityEventsSummary(),
      topIPs: getTopIPs(),
      topUserAgents: getTopUserAgents(),
      recommendations: generateRecommendations(),
    };
    
    const reportPath = path.join(
      LOGGING_CONFIG.REPORT_PATH,
      `security-report-${reportData.period.start}-${reportData.period.end}.json`
    );
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`✅ Weekly security report generated: ${reportPath}`);
    
    // Log report generation
    logSecurityEvent('WEEKLY_REPORT_GENERATED', reportData, undefined, 'LOW', 'SUCCESS');
    
  } catch (error) {
    console.error('Error generating weekly report:', error);
    logSecurityEvent('WEEKLY_REPORT_ERROR', { error: error.message }, undefined, 'HIGH', 'FAILURE');
  }
}

// Get last week period
function getLastWeekPeriod() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// Generate report summary
function generateReportSummary() {
  return {
    totalEvents: authAttempts.size,
    criticalEvents: 0, // Would be calculated from logs
    highEvents: 0,
    mediumEvents: 0,
    lowEvents: 0,
  };
}

// Get authentication statistics
function getAuthenticationStats() {
  const stats = {
    totalUsers: authAttempts.size,
    totalSuccessfulLogins: 0,
    totalFailedLogins: 0,
    lockedAccounts: 0,
    topFailedUsers: [] as Array<{ username: string; failedLogins: number }>,
  };
  
  authAttempts.forEach(attempt => {
    stats.totalSuccessfulLogins += attempt.successfulLogins;
    stats.totalFailedLogins += attempt.failedLogins;
    if (attempt.lockedUntil && new Date() < attempt.lockedUntil) {
      stats.lockedAccounts++;
    }
    if (attempt.failedLogins > 0) {
      stats.topFailedUsers.push({
        username: attempt.username,
        failedLogins: attempt.failedLogins,
      });
    }
  });
  
  stats.topFailedUsers.sort((a, b) => b.failedLogins - a.failedLogins);
  stats.topFailedUsers = stats.topFailedUsers.slice(0, 10);
  
  return stats;
}

// Get security events summary
function getSecurityEventsSummary() {
  // In production, this would analyze actual log files
  return {
    loginAttempts: authAttempts.size,
    suspiciousActivity: 0,
    blockedIPs: 0,
    securityAlerts: 0,
  };
}

// Get top IPs
function getTopIPs() {
  // In production, this would analyze log files
  return [];
}

// Get top user agents
function getTopUserAgents() {
  // In production, this would analyze log files
  return [];
}

// Generate security recommendations
function generateRecommendations() {
  const recommendations = [];
  
  authAttempts.forEach(attempt => {
    if (attempt.failedLogins > 10) {
      recommendations.push({
        type: 'HIGH_FAILED_LOGINS',
        username: attempt.username,
        failedLogins: attempt.failedLogins,
        recommendation: 'Consider implementing additional security measures for this user',
      });
    }
  });
  
  return recommendations;
}

// Get audit log statistics
export function getAuditLogStats() {
  return {
    currentAuditNumber,
    totalAuthAttempts: authAttempts.size,
    lockedAccounts: Array.from(authAttempts.values()).filter(a => 
      a.lockedUntil && new Date() < a.lockedUntil
    ).length,
  };
}

// Search audit logs
export function searchAuditLogs(criteria: {
  startDate?: string;
  endDate?: string;
  event?: string;
  severity?: string;
  username?: string;
  ipAddress?: string;
  limit?: number;
}) {
  // In production, this would search actual log files
  // For now, return mock data
  return {
    results: [],
    total: 0,
    criteria,
  };
}

// Export authentication attempts for monitoring
export function getAuthAttempts() {
  return Array.from(authAttempts.entries()).map(([username, attempt]) => ({
    username,
    ...attempt,
  }));
}

// Clear old authentication attempts (for memory management)
export function cleanupAuthAttempts() {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days
  
  authAttempts.forEach((attempt, username) => {
    if (attempt.lastAttempt < cutoffTime) {
      authAttempts.delete(username);
    }
  });
}

// Run cleanup every hour
setInterval(cleanupAuthAttempts, 60 * 60 * 1000);
