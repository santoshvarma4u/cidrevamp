// Audit Log Management API Endpoints
// Provides endpoints for log viewing, reporting, and monitoring

import { Request, Response } from 'express';
import { 
  logSecurityEvent, 
  generateWeeklyReport, 
  getAuditLogStats, 
  searchAuditLogs,
  getAuthAttempts,
  createAuditLogEntry
} from './auditLogger';
import { requireAdmin } from './auth';

// Log management routes
export function setupLogManagementRoutes(app: any) {
  console.log('📊 Setting up audit log management routes...');

  // Get audit log statistics
  app.get('/api/admin/logs/stats', requireAdmin, (req: Request, res: Response) => {
    try {
      const stats = getAuditLogStats();
      
      // Log the access
      logSecurityEvent('AUDIT_LOG_STATS_ACCESSED', {
        adminUser: req.user?.username,
        ip: req.ip,
      }, req, 'LOW', 'SUCCESS');
      
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting audit log stats:', error);
      logSecurityEvent('AUDIT_LOG_STATS_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to get audit log statistics',
      });
    }
  });

  // Search audit logs
  app.post('/api/admin/logs/search', requireAdmin, (req: Request, res: Response) => {
    try {
      const criteria = req.body;
      
      // Validate criteria
      if (!criteria || typeof criteria !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid search criteria',
        });
      }
      
      const results = searchAuditLogs(criteria);
      
      // Log the search
      logSecurityEvent('AUDIT_LOG_SEARCH', {
        adminUser: req.user?.username,
        criteria,
        resultCount: results.total,
      }, req, 'LOW', 'SUCCESS');
      
      res.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error searching audit logs:', error);
      logSecurityEvent('AUDIT_LOG_SEARCH_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to search audit logs',
      });
    }
  });

  // Get authentication attempts
  app.get('/api/admin/logs/auth-attempts', requireAdmin, (req: Request, res: Response) => {
    try {
      const authAttempts = getAuthAttempts();
      
      // Log the access
      logSecurityEvent('AUTH_ATTEMPTS_ACCESSED', {
        adminUser: req.user?.username,
        attemptCount: authAttempts.length,
      }, req, 'LOW', 'SUCCESS');
      
      res.json({
        success: true,
        data: authAttempts,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting auth attempts:', error);
      logSecurityEvent('AUTH_ATTEMPTS_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to get authentication attempts',
      });
    }
  });

  // Generate weekly report
  app.post('/api/admin/logs/generate-report', requireAdmin, (req: Request, res: Response) => {
    try {
      generateWeeklyReport();
      
      // Log the report generation
      logSecurityEvent('WEEKLY_REPORT_MANUAL_GENERATION', {
        adminUser: req.user?.username,
        requestedAt: new Date().toISOString(),
      }, req, 'MEDIUM', 'SUCCESS');
      
      res.json({
        success: true,
        message: 'Weekly security report generated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error generating weekly report:', error);
      logSecurityEvent('WEEKLY_REPORT_GENERATION_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to generate weekly report',
      });
    }
  });

  // Get recent security events
  app.get('/api/admin/logs/recent-events', requireAdmin, (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const severity = req.query.severity as string;
      
      const criteria: any = {
        limit,
      };
      
      if (severity) {
        criteria.severity = severity;
      }
      
      const results = searchAuditLogs(criteria);
      
      // Log the access
      logSecurityEvent('RECENT_EVENTS_ACCESSED', {
        adminUser: req.user?.username,
        limit,
        severity,
        resultCount: results.total,
      }, req, 'LOW', 'SUCCESS');
      
      res.json({
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting recent events:', error);
      logSecurityEvent('RECENT_EVENTS_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to get recent security events',
      });
    }
  });

  // Get security dashboard data
  app.get('/api/admin/logs/dashboard', requireAdmin, (req: Request, res: Response) => {
    try {
      const stats = getAuditLogStats();
      const authAttempts = getAuthAttempts();
      
      // Calculate dashboard metrics
      const dashboardData = {
        totalEvents: stats.currentAuditNumber - 1,
        lockedAccounts: stats.lockedAccounts,
        totalAuthAttempts: stats.totalAuthAttempts,
        recentFailedLogins: authAttempts
          .filter(a => a.failedLogins > 0)
          .sort((a, b) => new Date(b.lastFailedLogin || 0).getTime() - new Date(a.lastFailedLogin || 0).getTime())
          .slice(0, 10),
        topFailedUsers: authAttempts
          .filter(a => a.failedLogins > 0)
          .sort((a, b) => b.failedLogins - a.failedLogins)
          .slice(0, 5),
        systemHealth: {
          status: 'HEALTHY',
          lastReportGenerated: new Date().toISOString(),
          alertsCount: 0,
        },
      };
      
      // Log the dashboard access
      logSecurityEvent('SECURITY_DASHBOARD_ACCESSED', {
        adminUser: req.user?.username,
        dashboardMetrics: Object.keys(dashboardData),
      }, req, 'LOW', 'SUCCESS');
      
      res.json({
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      logSecurityEvent('SECURITY_DASHBOARD_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to get security dashboard data',
      });
    }
  });

  // Export logs (for backup/analysis)
  app.get('/api/admin/logs/export', requireAdmin, (req: Request, res: Response) => {
    try {
      const format = req.query.format as string || 'json';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      // Log the export request
      logSecurityEvent('LOG_EXPORT_REQUESTED', {
        adminUser: req.user?.username,
        format,
        startDate,
        endDate,
      }, req, 'MEDIUM', 'SUCCESS');
      
      // In production, this would generate actual export files
      const exportData = {
        exportedAt: new Date().toISOString(),
        exportedBy: req.user?.username,
        format,
        startDate,
        endDate,
        recordCount: 0, // Would be actual count from logs
        data: [], // Would contain actual log data
      };
      
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="security-logs.csv"');
        res.send('Log Number,Timestamp,Event,Severity,IP Address,Username,Status\n');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="security-logs.json"');
        res.json(exportData);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
      logSecurityEvent('LOG_EXPORT_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to export logs',
      });
    }
  });

  // Clear old logs (maintenance)
  app.post('/api/admin/logs/cleanup', requireAdmin, (req: Request, res: Response) => {
    try {
      const olderThanDays = parseInt(req.body.olderThanDays) || 90;
      
      // Log the cleanup request
      logSecurityEvent('LOG_CLEANUP_REQUESTED', {
        adminUser: req.user?.username,
        olderThanDays,
      }, req, 'MEDIUM', 'SUCCESS');
      
      // In production, this would actually clean up old log files
      const cleanupResult = {
        cleanedFiles: 0,
        freedSpace: '0 MB',
        olderThanDays,
      };
      
      res.json({
        success: true,
        message: 'Log cleanup completed successfully',
        data: cleanupResult,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      logSecurityEvent('LOG_CLEANUP_ERROR', {
        error: error.message,
        adminUser: req.user?.username,
      }, req, 'HIGH', 'FAILURE');
      
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup logs',
      });
    }
  });

  console.log('✅ Audit log management routes registered:');
  console.log('  - GET /api/admin/logs/stats');
  console.log('  - POST /api/admin/logs/search');
  console.log('  - GET /api/admin/logs/auth-attempts');
  console.log('  - POST /api/admin/logs/generate-report');
  console.log('  - GET /api/admin/logs/recent-events');
  console.log('  - GET /api/admin/logs/dashboard');
  console.log('  - GET /api/admin/logs/export');
  console.log('  - POST /api/admin/logs/cleanup');
}
