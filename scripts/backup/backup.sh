#!/bin/bash

# Database backup script for CID Telangana
set -e

# Configuration
POSTGRES_HOST=${POSTGRES_HOST:-postgres-dev}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DB:-ciddb_dev}
POSTGRES_USER=${POSTGRES_USER:-ciduser}
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cid_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Starting database backup..."
echo "Host: $POSTGRES_HOST"
echo "Database: $POSTGRES_DB"
echo "Backup file: $BACKUP_FILE"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready - creating backup"

# Create database backup
pg_dump -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB \
  --verbose --clean --no-owner --no-privileges --format=custom \
  --file=$BACKUP_FILE.custom

# Also create SQL dump
pg_dump -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB \
  --verbose --clean --no-owner --no-privileges \
  --file=$BACKUP_FILE

# Compress backups
gzip $BACKUP_FILE

echo "Backup completed successfully!"
echo "Files created:"
echo "  - $BACKUP_FILE.custom (PostgreSQL custom format)"
echo "  - $BACKUP_FILE.gz (SQL dump, compressed)"

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "cid_backup_*.sql.gz" -mtime +7 -exec rm {} \;
find $BACKUP_DIR -name "cid_backup_*.sql.custom" -mtime +7 -exec rm {} \;

echo "Old backups cleaned up (keeping last 7 days)"