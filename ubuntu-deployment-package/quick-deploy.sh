#!/bin/bash

# Quick deployment script for Ubuntu server
set -e

echo "🚀 Starting CID Application deployment..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run as root. Create a regular user first."
    exit 1
fi

# Create environment file
if [ ! -f .env.production ]; then
    echo "📝 Creating production environment file..."
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d /=+ | cut -c -25)
    SESSION_SECRET=$(openssl rand -base64 64)
    
    # Create environment file
    cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://ciduser:$DB_PASSWORD@postgres:5432/ciddb_prod

# Session Security
SESSION_SECRET=$SESSION_SECRET

# PostgreSQL Environment Variables
PGUSER=ciduser
PGPASSWORD=$DB_PASSWORD
PGDATABASE=ciddb_prod
PGHOST=postgres
PGPORT=5432
EOF
    
    echo "✅ Environment file created with secure passwords"
    echo "📋 Passwords saved in .env.production"
fi

# Load environment variables
source .env.production

# Create necessary directories
mkdir -p backups logs

# Build and start services
echo "🔧 Building and starting services..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Test database connection
echo "🗄️  Testing database connection..."
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT version();"

# Test application
echo "🌐 Testing application..."
sleep 10
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://$(hostname -I | awk '{print $1}'):5000"
    echo "🔧 Admin panel: http://$(hostname -I | awk '{print $1}'):5000/admin"
else
    echo "❌ Application health check failed"
    echo "📋 Check logs with: docker-compose -f docker-compose.prod.yml logs"
fi

echo "📊 Deployment completed!"
echo "📁 Logs location: ./logs/"
echo "💾 Backups location: ./backups/"