#!/bin/bash

# Prepare deployment package for Ubuntu server
set -e

DEPLOYMENT_DIR="ubuntu-deployment-package"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Preparing Ubuntu deployment package..."

# Create deployment directory
mkdir -p $DEPLOYMENT_DIR

# Copy application files
echo "📁 Copying application files..."
cp -r . $DEPLOYMENT_DIR/
# Remove unnecessary files
rm -rf $DEPLOYMENT_DIR/node_modules $DEPLOYMENT_DIR/.git $DEPLOYMENT_DIR/ubuntu-deployment-package 2>/dev/null || true

# Copy database export
echo "📊 Including database export..."
if [ -f "database_export.sql" ]; then
    cp database_export.sql $DEPLOYMENT_DIR/
    echo "✅ Database export included"
else
    echo "⚠️  database_export.sql not found - you'll need to export manually"
fi

# Copy uploads if they exist
echo "📁 Copying uploads..."
if [ -d "uploads" ]; then
    cp -r uploads $DEPLOYMENT_DIR/
    echo "✅ Uploads directory copied"
else
    echo "⚠️  No uploads directory found"
fi

# Create production docker-compose
cat > $DEPLOYMENT_DIR/docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cid-postgres-prod
    environment:
      POSTGRES_DB: ciddb_prod
      POSTGRES_USER: ciduser
      POSTGRES_PASSWORD: ${DB_PASSWORD:-CHANGE_THIS_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
      - ./database_export.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - cid-network-prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ciduser -d ciddb_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: cid-app-prod
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://ciduser:${DB_PASSWORD:-CHANGE_THIS_PASSWORD}@postgres:5432/ciddb_prod
      SESSION_SECRET: ${SESSION_SECRET:-CHANGE_THIS_SESSION_SECRET}
    ports:
      - "5000:5000"
    volumes:
      - app_uploads_prod:/app/uploads
      - ./uploads:/app/uploads:ro
    networks:
      - cid-network-prod
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data_prod:
    driver: local
  app_uploads_prod:
    driver: local

networks:
  cid-network-prod:
    driver: bridge
EOF

# Create production environment template
cat > $DEPLOYMENT_DIR/.env.production.template << 'EOF'
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_PASSWORD=YOUR_SECURE_DATABASE_PASSWORD
DATABASE_URL=postgresql://ciduser:YOUR_SECURE_DATABASE_PASSWORD@postgres:5432/ciddb_prod

# Session Security
SESSION_SECRET=YOUR_SUPER_SECRET_SESSION_KEY

# PostgreSQL Environment Variables
PGUSER=ciduser
PGPASSWORD=YOUR_SECURE_DATABASE_PASSWORD
PGDATABASE=ciddb_prod
PGHOST=postgres
PGPORT=5432
EOF

# Create quick deployment script
cat > $DEPLOYMENT_DIR/quick-deploy.sh << 'EOF'
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
    cp .env.production.template .env.production
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d /=+ | cut -c -25)
    SESSION_SECRET=$(openssl rand -base64 64)
    
    # Update environment file
    sed -i "s/YOUR_SECURE_DATABASE_PASSWORD/$DB_PASSWORD/g" .env.production
    sed -i "s/YOUR_SUPER_SECRET_SESSION_KEY/$SESSION_SECRET/g" .env.production
    
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
EOF

chmod +x $DEPLOYMENT_DIR/quick-deploy.sh

# Create deployment instructions
cat > $DEPLOYMENT_DIR/DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Ubuntu Server Deployment Instructions

## Quick Start (Recommended)

1. **Prepare Ubuntu Server:**
   ```bash
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Logout and login again for Docker group to take effect
   ```

2. **Copy Files to Server:**
   ```bash
   # Upload this entire directory to your server
   scp -r ubuntu-deployment-package/ user@your-server:/home/user/cid-app
   ```

3. **Deploy Application:**
   ```bash
   cd /home/user/cid-app
   ./quick-deploy.sh
   ```

4. **Access Application:**
   - Application: `http://your-server-ip:5000`
   - Admin Panel: `http://your-server-ip:5000/admin`

## Manual Deployment

If you prefer manual control, follow the detailed guide in `scripts/deploy-to-ubuntu.md`.

## Security Notes

- The quick deployment generates secure random passwords
- Change the default admin credentials after first login
- Consider setting up SSL/HTTPS for production use
- Configure firewall to only allow necessary ports

## Troubleshooting

### Check Service Status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Restart Services:
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Database Access:
```bash
docker exec -it cid-postgres-prod psql -U ciduser -d ciddb_prod
```

## Backup & Maintenance

### Create Backup:
```bash
docker exec cid-postgres-prod pg_dump -U ciduser ciddb_prod > backup_$(date +%Y%m%d).sql
```

### Update Application:
```bash
git pull  # if using git
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```
EOF

# Create package info
cat > $DEPLOYMENT_DIR/PACKAGE_INFO.txt << EOF
CID Application - Ubuntu Deployment Package
==========================================

Created: $(date)
Package Contents:
- Complete application source code
- Database export with schema and data
- Production Docker configuration
- Quick deployment script
- Detailed deployment instructions

Files:
- docker-compose.prod.yml (Production Docker setup)
- .env.production.template (Environment configuration template)
- quick-deploy.sh (One-click deployment script)
- DEPLOYMENT_INSTRUCTIONS.md (Step-by-step guide)
- database_export.sql (Database with current data)
- uploads/ (Uploaded files directory)

Quick Start:
1. Copy this package to your Ubuntu server
2. Install Docker and Docker Compose
3. Run: ./quick-deploy.sh
4. Access: http://your-server-ip:5000

For detailed instructions, see DEPLOYMENT_INSTRUCTIONS.md
EOF

echo "✅ Ubuntu deployment package created successfully!"
echo "📦 Package location: $DEPLOYMENT_DIR/"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the '$DEPLOYMENT_DIR' directory to your Ubuntu server"
echo "2. Follow instructions in '$DEPLOYMENT_DIR/DEPLOYMENT_INSTRUCTIONS.md'"
echo "3. Run the quick deployment: ./quick-deploy.sh"
echo ""
echo "📁 Package contents:"
ls -la $DEPLOYMENT_DIR/