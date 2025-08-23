#!/bin/bash

# Export current database for deployment
# This script exports the current development database

set -e

BACKUP_DIR="deployment-backup"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🗄️  Creating database export for deployment..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Export database schema and data
echo "📊 Exporting database schema and data..."

# Full database dump with data
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=${PGUSER:-ciduser} \
  --dbname=${PGDATABASE:-ciddb} \
  --verbose \
  --clean \
  --if-exists \
  --create \
  --format=plain \
  --file="$BACKUP_DIR/full_database_${DATE}.sql"

# Schema-only dump
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=${PGUSER:-ciduser} \
  --dbname=${PGDATABASE:-ciddb} \
  --schema-only \
  --verbose \
  --clean \
  --if-exists \
  --create \
  --format=plain \
  --file="$BACKUP_DIR/schema_only_${DATE}.sql"

# Data-only dump
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=${PGUSER:-ciduser} \
  --dbname=${PGDATABASE:-ciddb} \
  --data-only \
  --verbose \
  --format=plain \
  --file="$BACKUP_DIR/data_only_${DATE}.sql"

# Export uploads directory
echo "📁 Copying uploads directory..."
if [ -d "uploads" ]; then
  tar -czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" uploads/
  echo "✅ Uploads directory exported"
else
  echo "⚠️  No uploads directory found"
fi

# Create deployment package info
cat > "$BACKUP_DIR/deployment_info.txt" << EOF
CID Application Deployment Package
Created: $(date)
Database: ${PGDATABASE:-ciddb}
User: ${PGUSER:-ciduser}

Files included:
- full_database_${DATE}.sql (Complete database with schema and data)
- schema_only_${DATE}.sql (Schema only)
- data_only_${DATE}.sql (Data only)
- uploads_${DATE}.tar.gz (Uploaded files)

Instructions:
1. Copy this entire directory to your Ubuntu server
2. Follow the deployment guide in deploy-to-ubuntu.md
EOF

echo "✅ Database export completed!"
echo "📦 Export package created in: $BACKUP_DIR/"
echo "📋 Next steps:"
echo "   1. Copy the $BACKUP_DIR directory to your Ubuntu server"
echo "   2. Follow the deployment guide"