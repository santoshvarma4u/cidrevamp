# Complete Ubuntu Server Deployment Guide

## Prerequisites

- Ubuntu 20.04+ server
- Root or sudo access
- At least 2GB RAM and 20GB disk space
- Domain name (optional but recommended)

## Step 1: Server Preparation

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Dependencies
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for building)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client tools
sudo apt-get install -y postgresql-client

# Install other utilities
sudo apt-get install -y git nginx certbot python3-certbot-nginx
```

### 1.3 Create Application User
```bash
sudo useradd -m -s /bin/bash cidapp
sudo usermod -aG docker cidapp
sudo su - cidapp
```

## Step 2: Application Setup

### 2.1 Create Application Directory
```bash
mkdir -p /home/cidapp/cid-application
cd /home/cidapp/cid-application
```

### 2.2 Copy Application Files
```bash
# Copy your application code to the server
# You can use scp, rsync, or git clone

# Example using scp from your local machine:
# scp -r /path/to/your/app/* user@server:/home/cidapp/cid-application/

# Or clone from repository:
# git clone https://github.com/your-repo/cid-application.git .
```

### 2.3 Copy Database Backup
```bash
# Copy the deployment-backup directory to the server
# scp -r deployment-backup/ user@server:/home/cidapp/cid-application/
```

## Step 3: Database Setup

### 3.1 Create Production Environment File
```bash
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://ciduser:CHANGE_THIS_PASSWORD@localhost:5432/ciddb_prod
SESSION_SECRET=$(openssl rand -base64 32)
PGUSER=ciduser
PGPASSWORD=CHANGE_THIS_PASSWORD
PGDATABASE=ciddb_prod
PGHOST=localhost
PGPORT=5432
EOF
```

### 3.2 Update Docker Compose for Production
```bash
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cid-postgres-prod
    environment:
      POSTGRES_DB: ciddb_prod
      POSTGRES_USER: ciduser
      POSTGRES_PASSWORD: CHANGE_THIS_PASSWORD
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
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
      DATABASE_URL: postgresql://ciduser:CHANGE_THIS_PASSWORD@postgres:5432/ciddb_prod
      SESSION_SECRET: CHANGE_THIS_SESSION_SECRET
    ports:
      - "5000:5000"
    volumes:
      - app_uploads_prod:/app/uploads
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
```

### 3.3 Start Database Container
```bash
docker-compose -f docker-compose.prod.yml up -d postgres
```

### 3.4 Wait for Database to Start
```bash
# Wait for database to be ready
sleep 30
docker-compose -f docker-compose.prod.yml logs postgres
```

### 3.5 Import Database
```bash
# Find the latest backup file
LATEST_BACKUP=$(ls deployment-backup/full_database_*.sql | head -1)

# Import the database
docker exec -i cid-postgres-prod psql -U ciduser -d ciddb_prod < $LATEST_BACKUP

# Verify import
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "\\dt"
```

### 3.6 Import Uploads (if exists)
```bash
# Extract uploads if they exist
if [ -f "deployment-backup/uploads_*.tar.gz" ]; then
  LATEST_UPLOADS=$(ls deployment-backup/uploads_*.tar.gz | head -1)
  tar -xzf $LATEST_UPLOADS
  
  # Copy to Docker volume
  docker run --rm -v cid_app_uploads_prod:/uploads -v $(pwd)/uploads:/source alpine sh -c "cp -r /source/* /uploads/"
fi
```

## Step 4: Application Deployment

### 4.1 Build and Start Application
```bash
# Build the application
docker-compose -f docker-compose.prod.yml build app

# Start the full application
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4.2 Verify Application
```bash
# Check if application is running
curl http://localhost:5000/api/health

# Check database connection
docker exec cid-app-prod node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB Connected:', res.rows[0]);
  process.exit(0);
});
"
```

## Step 5: Nginx Reverse Proxy Setup

### 5.1 Create Nginx Configuration
```bash
sudo tee /etc/nginx/sites-available/cid-app << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
```

### 5.2 Configure Rate Limiting
```bash
sudo tee /etc/nginx/conf.d/rate-limiting.conf << EOF
# Rate limiting zones
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;
EOF
```

### 5.3 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/cid-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificate (Optional but Recommended)

### 6.1 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6.2 Auto-renewal
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 7: Systemd Service (Optional)

### 7.1 Create Systemd Service
```bash
sudo tee /etc/systemd/system/cid-app.service << EOF
[Unit]
Description=CID Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/cidapp/cid-application
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=cidapp
Group=cidapp

[Install]
WantedBy=multi-user.target
EOF
```

### 7.2 Enable Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable cid-app
sudo systemctl start cid-app
```

## Step 8: Backup Configuration

### 8.1 Create Backup Script
```bash
mkdir -p /home/cidapp/backups
cat > /home/cidapp/backups/backup.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/cidapp/backups"

# Database backup
docker exec cid-postgres-prod pg_dump -U ciduser ciddb_prod > "\$BACKUP_DIR/db_backup_\$DATE.sql"

# Uploads backup
docker run --rm -v cid_app_uploads_prod:/uploads -v \$BACKUP_DIR:/backup alpine tar -czf /backup/uploads_\$DATE.tar.gz -C /uploads .

# Keep only last 30 days
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: \$DATE"
EOF

chmod +x /home/cidapp/backups/backup.sh
```

### 8.2 Schedule Backups
```bash
crontab -e
# Add this line for daily backups at 2 AM:
0 2 * * * /home/cidapp/backups/backup.sh
```

## Step 9: Monitoring and Logs

### 9.1 Log Rotation
```bash
sudo tee /etc/logrotate.d/docker-containers << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF
```

### 9.2 Monitoring Commands
```bash
# Check application status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check system resources
htop
df -h
free -h

# Database status
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT version();"
```

## Step 10: Security Hardening

### 10.1 Firewall Setup
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 5432  # Don't expose database port
```

### 10.2 Security Updates
```bash
# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT 1;"
   ```

2. **Application Not Starting**
   ```bash
   docker-compose -f docker-compose.prod.yml logs app
   ```

3. **Permission Issues**
   ```bash
   sudo chown -R cidapp:cidapp /home/cidapp/cid-application
   ```

4. **Nginx Issues**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   sudo journalctl -u nginx
   ```

## Final Verification Checklist

- [ ] Database is running and accessible
- [ ] Application starts without errors
- [ ] Website loads at http://your-server-ip:5000
- [ ] Admin login works
- [ ] Page creation functionality works
- [ ] File uploads work
- [ ] Nginx proxy works (if configured)
- [ ] SSL certificate works (if configured)
- [ ] Backups are working
- [ ] Logs are being rotated

Your CID application should now be fully deployed and operational on your Ubuntu server!