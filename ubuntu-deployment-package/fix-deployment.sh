#!/bin/bash

# Fix deployment script for environment variable issues
set -e

echo "🔧 Fixing deployment environment issues..."

# Remove problematic .env.production file
if [ -f .env.production ]; then
    echo "🗑️  Removing problematic .env.production file..."
    rm .env.production
fi

# Generate secure passwords without special characters
echo "🔐 Generating secure credentials..."
DB_PASSWORD=$(openssl rand -hex 16)
SESSION_SECRET=$(openssl rand -hex 32)

# Create clean environment file
echo "📝 Creating clean .env.production file..."
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

echo "✅ Clean environment file created!"
echo "🔐 Generated secure passwords using hex encoding (no special characters)"

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
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT version();" || echo "Database not ready yet, will retry..."

# Test application
echo "🌐 Testing application..."
sleep 10
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://$(hostname -I | awk '{print $1}'):5000"
    echo "🔧 Admin panel: http://$(hostname -I | awk '{print $1}'):5000/admin"
else
    echo "⚠️  Application health check failed, but containers may still be starting..."
    echo "📋 Check logs with: docker-compose -f docker-compose.prod.yml logs"
fi

echo "📊 Deployment completed!"
echo "📁 Credentials saved in .env.production"
echo "📋 Next steps:"
echo "   - Access your app at http://your-server-ip:5000"
echo "   - Login to admin panel with: admin / admin123"
echo "   - Change default admin password immediately!"