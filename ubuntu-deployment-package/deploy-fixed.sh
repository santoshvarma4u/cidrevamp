#!/bin/bash

# Fixed deployment script for CID Application
set -e

echo "🚀 Starting CID Application deployment with fixed Docker build..."

# Stop and remove any existing containers and images
echo "🧹 Cleaning up existing containers and images..."
docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# Remove problematic .env.production file if it exists
if [ -f .env.production ]; then
    echo "🗑️  Removing existing .env.production file..."
    rm .env.production
fi

# Generate secure credentials using hex encoding (no special characters)
echo "🔐 Generating secure credentials..."
DB_PASSWORD=$(openssl rand -hex 16)
SESSION_SECRET=$(openssl rand -hex 32)

# Create clean environment file
echo "📝 Creating .env.production file..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://ciduser:${DB_PASSWORD}@postgres:5432/ciddb_prod

# Session Security
SESSION_SECRET=${SESSION_SECRET}

# PostgreSQL Environment Variables
PGUSER=ciduser
PGPASSWORD=${DB_PASSWORD}
PGDATABASE=ciddb_prod
PGHOST=postgres
PGPORT=5432
EOF

echo "✅ Environment file created with secure credentials"

# Load environment variables
source .env.production

# Create necessary directories
mkdir -p backups logs

# Build with no cache to ensure fresh build with fixed Dockerfile
echo "🔧 Building application with fixed Dockerfile (this may take a few minutes)..."
docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

echo "⏳ Waiting for services to be ready..."
sleep 60

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Test database connection
echo "🗄️  Testing database connection..."
for i in {1..3}; do
    if docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT version();" 2>/dev/null; then
        echo "✅ Database connected successfully!"
        break
    else
        echo "⏳ Database not ready yet, waiting... (attempt $i/3)"
        sleep 20
    fi
done

# Test application health
echo "🌐 Testing application..."
sleep 15
for i in {1..5}; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        SERVER_IP=$(hostname -I | awk '{print $1}')
        echo "✅ Application is running successfully!"
        echo ""
        echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🌐 Access your application:"
        echo "   Main Website: http://$SERVER_IP:5000"
        echo "   Admin Panel:  http://$SERVER_IP:5000/admin"
        echo ""
        echo "🔐 Login Credentials:"
        echo "   Username: admin"
        echo "   Password: admin123"
        echo "   ⚠️  IMPORTANT: Change admin password immediately!"
        echo ""
        echo "📋 Management Commands:"
        echo "   View logs:    docker-compose -f docker-compose.prod.yml logs -f"
        echo "   Restart:      docker-compose -f docker-compose.prod.yml restart"
        echo "   Stop:         docker-compose -f docker-compose.prod.yml down"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        break
    else
        echo "⏳ Application not ready yet, waiting... (attempt $i/5)"
        sleep 30
    fi
done

# Show final status
echo ""
echo "📊 Final Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "💾 Configuration saved in .env.production"
echo "📁 Logs available in ./logs/"
echo "🗄️  Backups will be stored in ./backups/"

# Check if application failed to start
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo ""
    echo "⚠️  Application may still be starting or encountered an issue."
    echo "📋 Check the logs for details:"
    echo "   docker-compose -f docker-compose.prod.yml logs app"
fi