#!/bin/bash

# Production Database Schema Update Script
# This script ensures the production database has the latest schema changes

set -e

echo "🔄 Updating production database schema..."

# Check if we're running in Docker environment
if [ -f /.dockerenv ]; then
    echo "📦 Running in Docker container"
    DATABASE_URL="${DATABASE_URL:-postgresql://ciduser:cidpassword@postgres:5432/ciddb}"
else
    echo "🖥️  Running locally"
    # Load environment variables
    if [ -f .env ]; then
        source .env
    fi
fi

echo "🔧 Installing dependencies..."
npm install

echo "📋 Checking current database schema..."

# Check if pages table has slug column
SLUG_EXISTS=$(docker exec cid-postgres psql -U ciduser -d ciddb -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='pages' AND column_name='slug';" 2>/dev/null | wc -l)

if [ "$SLUG_EXISTS" -eq 0 ]; then
    echo "❌ Missing slug column in pages table"
    echo "🔄 Adding slug column..."
    docker exec cid-postgres psql -U ciduser -d ciddb -c "ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug VARCHAR UNIQUE;"
    echo "✅ Added slug column"
fi

# Check if videos table has display_order column
DISPLAY_ORDER_EXISTS=$(docker exec cid-postgres psql -U ciduser -d ciddb -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='videos' AND column_name='display_order';" 2>/dev/null | wc -l)

if [ "$DISPLAY_ORDER_EXISTS" -eq 0 ]; then
    echo "❌ Missing display_order column in videos table"
    echo "🔄 Adding display_order column..."
    docker exec cid-postgres psql -U ciduser -d ciddb -c "ALTER TABLE videos ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;"
    echo "✅ Added display_order column"
fi

echo "🚀 Pushing schema changes..."
npm run db:push --force

echo "✅ Production database schema updated successfully!"
echo "📝 You can now deploy your application with the latest changes."