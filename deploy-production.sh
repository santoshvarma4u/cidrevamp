#!/bin/bash

# CID Telangana Production Deployment Script
# This script deploys the CID application with production security settings

set -e

echo "🚀 Starting CID Telangana Production Deployment..."

# Check if SSL certificates exist
if [ ! -d "./ssl" ] || [ ! -f "./ssl/cert.pem" ] || [ ! -f "./ssl/key.pem" ]; then
    echo "❌ SSL certificates not found!"
    echo "Please ensure you have SSL certificates in ./ssl/ directory:"
    echo "  - ./ssl/cert.pem (SSL certificate)"
    echo "  - ./ssl/key.pem (SSL private key)"
    echo ""
    echo "For development/testing, you can generate self-signed certificates:"
    echo "  mkdir -p ssl"
    echo "  openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes"
    exit 1
fi

echo "✅ SSL certificates found"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start production containers
echo "🔨 Building production containers..."
docker-compose build

echo "🚀 Starting production services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker exec cid-postgres pg_isready -U ciduser -d ciddb > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
    exit 1
fi

# Check App
if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is ready"
else
    echo "❌ Application is not ready"
    exit 1
fi

# Check Nginx
if curl -f -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx is ready"
else
    echo "❌ Nginx is not ready"
    exit 1
fi

echo ""
echo "🎉 CID Telangana Production Deployment Complete!"
echo ""
echo "📊 Service Status:"
echo "  - PostgreSQL: ✅ Running on port 5432"
echo "  - Application: ✅ Running on port 5000 (internal)"
echo "  - Nginx: ✅ Running on ports 80/443"
echo "  - pgAdmin: ✅ Running on port 5050"
echo ""
echo "🌐 Access URLs:"
echo "  - HTTPS (Production): https://your-domain.com"
echo "  - HTTP (Redirects to HTTPS): http://your-domain.com"
echo "  - Admin Panel: https://your-domain.com/admin"
echo "  - Database Admin: https://your-domain.com:5050"
echo ""
echo "🔒 Security Features Enabled:"
echo "  - HTTPS Only (HTTP redirects to HTTPS)"
echo "  - Secure Cookies (HttpOnly, Secure, SameSite=Strict)"
echo "  - TLS 1.2+ Only (TLS 1.0/1.1 disabled)"
echo "  - Strong Cipher Suites Only"
echo "  - HSTS Headers"
echo "  - Rate Limiting"
echo "  - Host Header Validation"
echo "  - XSS Protection"
echo "  - CSRF Protection"
echo "  - Content Security Policy"
echo ""
echo "📝 Next Steps:"
echo "  1. Update DNS to point to your server"
echo "  2. Replace SSL certificates with production certificates"
echo "  3. Update SESSION_SECRET in docker-compose.yml"
echo "  4. Configure firewall (ports 80, 443, 22)"
echo "  5. Set up monitoring and backups"
echo ""
echo "🔧 Management Commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Update application: docker-compose build && docker-compose up -d"
echo ""
echo "✨ Deployment successful! Your CID Telangana application is now running in production mode."
