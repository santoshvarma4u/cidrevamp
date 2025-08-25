#!/bin/bash

# Automated backup script for CID Telangana (to be run via cron)
set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/logs/backup.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Create necessary directories
mkdir -p "$BACKUP_DIR" "$PROJECT_DIR/logs"

log "Starting automated backup process"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    log "ERROR: docker-compose not found"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if production database is running
if docker-compose ps postgres | grep -q "Up"; then
    log "Production database detected - creating backup"
    docker-compose --profile backup run --rm db-backup-prod
    BACKUP_STATUS=$?
elif docker-compose -f docker-compose.dev.yml ps postgres-dev | grep -q "Up"; then
    log "Development database detected - creating backup"
    docker-compose -f docker-compose.dev.yml --profile backup run --rm db-backup
    BACKUP_STATUS=$?
else
    log "ERROR: No running database container found"
    exit 1
fi

if [ $BACKUP_STATUS -eq 0 ]; then
    log "Backup completed successfully"
    
    # Cleanup old backups (keep last 30 days)
    find "$BACKUP_DIR" -name "cid_backup_*.sql.gz" -mtime +30 -exec rm {} \; 2>/dev/null || true
    find "$BACKUP_DIR" -name "cid_backup_*.sql.custom" -mtime +30 -exec rm {} \; 2>/dev/null || true
    
    log "Old backups cleaned up (keeping last 30 days)"
    
    # Optional: Upload to cloud storage (uncomment and configure as needed)
    # $SCRIPT_DIR/upload-to-cloud.sh "$BACKUP_DIR"
else
    log "ERROR: Backup failed with status $BACKUP_STATUS"
    exit 1
fi

log "Automated backup process completed"