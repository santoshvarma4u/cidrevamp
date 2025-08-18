#!/bin/bash

# Database restore script for CID Telangana
set -e

# Configuration
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_DB=${POSTGRES_DB:-ciddb}
POSTGRES_USER=${POSTGRES_USER:-ciduser}
BACKUP_DIR="/backups"

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la $BACKUP_DIR/cid_backup_*.sql.* 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file '$BACKUP_FILE' not found"
    exit 1
fi

echo "Starting database restore..."
echo "Host: $POSTGRES_HOST"
echo "Database: $POSTGRES_DB"
echo "Backup file: $BACKUP_FILE"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready - starting restore"

# Determine file type and restore accordingly
if [[ $BACKUP_FILE == *.custom ]]; then
    echo "Restoring from PostgreSQL custom format..."
    pg_restore -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB \
      --verbose --clean --if-exists \
      $BACKUP_FILE
elif [[ $BACKUP_FILE == *.gz ]]; then
    echo "Restoring from compressed SQL dump..."
    gunzip -c $BACKUP_FILE | psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB
elif [[ $BACKUP_FILE == *.sql ]]; then
    echo "Restoring from SQL dump..."
    psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f $BACKUP_FILE
else
    echo "Error: Unsupported backup file format"
    exit 1
fi

echo "Database restore completed successfully!"