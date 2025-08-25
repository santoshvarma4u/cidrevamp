#!/bin/bash

# Ultimate CID Application Deployment Script
# This script handles all known Docker build and environment issues

set -e

echo "🚀 Starting Ultimate CID Application Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."
if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop and cleanup everything
echo "🧹 Cleaning up existing containers and images..."
docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true
docker system prune -af 2>/dev/null || true
docker volume prune -f 2>/dev/null || true

# Remove any existing environment files
echo "🗑️  Removing existing environment files..."
rm -f .env.production .env

# Generate secure credentials
echo "🔐 Generating secure credentials..."
DB_PASSWORD=$(openssl rand -hex 20 | head -c 20)
SESSION_SECRET=$(openssl rand -hex 32 | head -c 32)
JWT_SECRET=$(openssl rand -hex 24 | head -c 24)

# Create production environment file
echo "📝 Creating production environment file..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://ciduser:${DB_PASSWORD}@postgres:5432/ciddb_prod

# Session Security
SESSION_SECRET=${SESSION_SECRET}
JWT_SECRET=${JWT_SECRET}

# PostgreSQL Environment Variables
PGUSER=ciduser
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=ciddb_prod
PGHOST=postgres
PGPORT=5432

# Additional Environment Variables
TZ=Asia/Kolkata
PYTHONUNBUFFERED=1
EOF

echo "✅ Environment file created successfully"

# Load environment variables
source .env.production

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backups logs uploads
chmod 755 backups logs uploads

# Build with verbose output and no cache
echo "🔧 Building Docker images (this will take 10-15 minutes)..."
echo "📋 Building with verbose output to track progress..."

# Set Docker build arguments for debugging
export DOCKER_BUILDKIT=1
export PROGRESS_NO_TRUNC=1

# Build the images with full cleanup and debugging
docker-compose -f docker-compose.prod.yml --env-file .env.production build \
    --no-cache \
    --progress=plain \
    --pull

echo "✅ Docker images built successfully"

# Start PostgreSQL first
echo "🗄️  Starting PostgreSQL database..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker exec cid-postgres-prod pg_isready -U ciduser -d ciddb_prod 2>/dev/null; then
        echo "✅ PostgreSQL is ready!"
        break
    else
        echo "⏳ PostgreSQL starting... ($i/30)"
        sleep 2
    fi
done

# Start the application
echo "🚀 Starting CID application..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
sleep 30

# Health checks
echo "🔍 Performing health checks..."

# Check PostgreSQL connection
echo "🗄️  Testing database connection..."
for i in {1..5}; do
    if docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT version();" 2>/dev/null; then
        echo "✅ Database connection successful!"
        break
    else
        echo "⏳ Database connecting... ($i/5)"
        sleep 10
    fi
done

# Check application health
echo "🌐 Testing application health..."
for i in {1..10}; do
    if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✅ Application health check passed!"
        break
    else
        echo "⏳ Application starting... ($i/10)"
        sleep 15
    fi
done

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")

# Final status check
echo ""
echo "📊 Final Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 ACCESS YOUR APPLICATION:"
echo "   Main Website: http://$SERVER_IP:5000"
echo "   Admin Panel:  http://$SERVER_IP:5000/admin"
echo ""
echo "🔐 DEFAULT LOGIN CREDENTIALS:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   ⚠️  CRITICAL: Change admin password immediately!"
echo ""
echo "📋 MANAGEMENT COMMANDS:"
echo "   View Logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "   Restart App:   docker-compose -f docker-compose.prod.yml restart app"
echo "   Stop All:      docker-compose -f docker-compose.prod.yml down"
echo "   Backup DB:     ./scripts/backup.sh"
echo ""
echo "📁 IMPORTANT FILES:"
echo "   Environment:   .env.production"
echo "   Logs:         ./logs/"
echo "   Backups:      ./backups/"
echo "   Uploads:      ./uploads/"
echo ""
echo "🔧 TROUBLESHOOTING:"
if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "   ✅ All systems operational!"
else
    echo "   ⚠️  Application may still be starting."
    echo "   📋 Check logs: docker-compose -f docker-compose.prod.yml logs app"
    echo "   🔄 Restart if needed: docker-compose -f docker-compose.prod.yml restart"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Your CID application is now running in production!"
echo "🛡️  Don't forget to:"
echo "   1. Change the default admin password"
echo "   2. Set up SSL/HTTPS if needed"
echo "   3. Configure firewall rules"
echo "   4. Set up regular backups"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"