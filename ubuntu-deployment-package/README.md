# CID Application - Ubuntu Server Deployment

## 🚀 Quick Start (Recommended)

### 1. Prepare Ubuntu Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for Docker group to take effect
```

### 2. Copy Files to Server

```bash
# Upload this entire directory to your server
scp -r ubuntu-deployment-package/ user@your-server:/home/user/cid-app
```

### 3. Deploy Application

```bash
cd /home/user/cid-app
./quick-deploy.sh
```

### 4. Access Application

- **Application**: `http://your-server-ip:5000`
- **Admin Panel**: `http://your-server-ip:5000/admin`
- **Default Admin**: Username: `admin`, Password: `admin123` (change immediately!)

## 📁 Package Contents

- **Complete application source code**
- **Database export with all current data**
- **Production Docker configuration**
- **One-click deployment script**
- **All uploads and media files**

## 🔧 Manual Commands

### Check Service Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Database Access
```bash
docker exec -it cid-postgres-prod psql -U ciduser -d ciddb_prod
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

## 🛡️ Security Setup (Recommended)

### 1. Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/cid-app << EOF
server {
    listen 80;
    server_name your-domain.com;
    
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
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/cid-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Setup SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. Setup Firewall

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

## 🗄️ Database Backup

### Manual Backup
```bash
docker exec cid-postgres-prod pg_dump -U ciduser ciddb_prod > backup_$(date +%Y%m%d).sql
```

### Automated Daily Backups
```bash
# Create backup script
cat > ~/backup-cid.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/cid-backups"
mkdir -p $BACKUP_DIR

# Database backup
docker exec cid-postgres-prod pg_dump -U ciduser ciddb_prod > "$BACKUP_DIR/db_backup_$DATE.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x ~/backup-cid.sh

# Schedule daily backup at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * $HOME/backup-cid.sh") | crontab -
```

## 🔧 Troubleshooting

### Application Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check database connection
docker exec cid-app-prod node -e "console.log('DB URL:', process.env.DATABASE_URL)"
```

### Database Issues
```bash
# Check database status
docker exec cid-postgres-prod pg_isready -U ciduser -d ciddb_prod

# Check database tables
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "\\dt"
```

### Performance Issues
```bash
# Check system resources
htop
df -h
free -h

# Check Docker stats
docker stats
```

### Page Creation Still Failing
```bash
# Check specific table schema
docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "\\d pages"

# Test API directly
curl -X POST http://localhost:5000/api/admin/pages \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Page","slug":"test-page","content":"Test content","isPublished":false}'
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify all services are running: `docker-compose -f docker-compose.prod.yml ps`
3. Test database connectivity: `docker exec cid-postgres-prod psql -U ciduser -d ciddb_prod -c "SELECT 1;"`
4. Check application health: `curl http://localhost:5000/api/health`

## 🎯 Production Checklist

- [ ] Application accessible at server IP:5000
- [ ] Admin login works
- [ ] Page creation functionality works
- [ ] File uploads work
- [ ] Database backup script scheduled
- [ ] Nginx reverse proxy configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Firewall configured
- [ ] Default admin password changed

Your CID application is now ready for production use!