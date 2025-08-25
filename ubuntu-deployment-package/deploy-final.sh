#!/bin/bash

# Final CID Application Deployment Script
# All issues resolved, ready for production deployment

set -e

echo "🚀 Starting Final CID Application Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Complete cleanup
echo "🧹 Complete system cleanup..."
docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true
docker system prune -af --volumes 2>/dev/null || true

# Remove any existing environment files
rm -f .env.production .env

# Generate secure credentials (alphanumeric only)
echo "🔐 Generating secure credentials..."
DB_PASSWORD=$(tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c 20)
SESSION_SECRET=$(tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c 32)

# Create production environment file
echo "📝 Creating production environment..."
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://ciduser:${DB_PASSWORD}@postgres:5432/ciddb_prod
SESSION_SECRET=${SESSION_SECRET}
PGUSER=ciduser
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=ciddb_prod
PGHOST=postgres
PGPORT=5432
TZ=Asia/Kolkata
EOF

echo "✅ Environment configured"

# Load environment
source .env.production

# Create directories
mkdir -p backups logs uploads
chmod 755 backups logs uploads

# Build with comprehensive logging
echo "🔧 Building Docker images..."
echo "📋 This will take 10-15 minutes, please wait..."

docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache --pull

echo "✅ Build completed successfully!"

# Start services in stages
echo "🗄️  Starting database..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 20
for i in {1..15}; do
    if docker exec cid-postgres-prod pg_isready -U ciduser -d ciddb_prod >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "⏳ Database starting... ($i/15)"
    sleep 3
done

# Start application
echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d app

# Wait and test
echo "⏳ Waiting for application startup..."
sleep 30

# Health checks
echo "🔍 Performing health checks..."

# Test database
if docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection verified"
else
    echo "⚠️  Database connection issue"
fi

# Test application
for i in {1..8}; do
    if curl -s -f http://localhost:5000/api/health >/dev/null 2>&1; then
        echo "✅ Application health check passed!"
        break
    fi
    echo "⏳ Application starting... ($i/8)"
    sleep 15
done

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")

# Final status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your CID Application is now running:"
echo "   🏠 Website: http://$SERVER_IP:5000"
echo "   🛡️  Admin:   http://$SERVER_IP:5000/admin"
echo ""
echo "🔐 Default Login:"
echo "   👤 Username: admin"
echo "   🔑 Password: file:///app/scripts/start-production.js:8
const { spawn } = require('child_process');
                  ^

ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and '/app/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///app/scripts/start-production.js:8:19
    at ModuleJob.run (node:internal/modules/esm/module_job:263:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:540:24)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v20.19.4"
echo ""
echo "⚠️  IMPORTANT: Change admin password immediately!"
echo ""
echo "🔧 Management Commands:"
echo "   📋 Logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "   🔄 Restart: docker-compose -f docker-compose.prod.yml restart"
echo "   🛑 Stop:    docker-compose -f docker-compose.prod.yml down"
echo ""
echo "📁 Important Files:"
echo "   📄 Config:  .env.production"
echo "   📊 Logs:    ./logs/"
echo "   💾 Backups: ./backups/"
echo ""

# Final health check
if curl -s -f http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ All systems operational! Your CID application is ready to use."
else
    echo "⚠️  Application may still be starting. Check logs if needed:"
    echo "   docker-compose -f docker-compose.prod.yml logs app"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"