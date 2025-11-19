#!/bin/bash

# RTI Tables Creation Script
# This script creates the RTI officers and pay scales tables in the database

set -e

echo "🔄 Creating RTI tables in database..."

# Check if we're running in Docker environment
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
    echo "📦 Running in Docker container"
    DATABASE_URL="${DATABASE_URL:-postgresql://ciduser:cidpassword@postgres:5432/ciddb}"
    DB_HOST="${DB_HOST:-postgres}"
    DB_USER="${DB_USER:-ciduser}"
    DB_NAME="${DB_NAME:-ciddb}"
    DB_PASSWORD="${DB_PASSWORD:-cidpassword}"
    
    # Use docker exec if postgres container is running
    if docker ps | grep -q cid-postgres; then
        echo "📋 Executing SQL script via Docker..."
        docker exec -i cid-postgres psql -U "$DB_USER" -d "$DB_NAME" < scripts/create-rti-tables.sql
    else
        echo "⚠️  Docker container 'cid-postgres' not found. Trying direct connection..."
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f scripts/create-rti-tables.sql
    fi
else
    echo "🖥️  Running locally"
    # Load environment variables
    if [ -f .env ]; then
        source .env
    fi
    
    # Extract connection details from DATABASE_URL if provided
    if [ -n "$DATABASE_URL" ]; then
        echo "📋 Using DATABASE_URL for connection..."
        psql "$DATABASE_URL" -f scripts/create-rti-tables.sql
    else
        echo "⚠️  DATABASE_URL not set. Please set it in .env file or export it."
        echo "Example: export DATABASE_URL='postgresql://user:password@localhost:5432/dbname'"
        exit 1
    fi
fi

echo "✅ RTI tables created successfully!"
echo "📝 You can now use the RTI Management interface at /admin/rti"

