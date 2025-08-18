# CID Telangana - Docker Deployment Guide

This guide provides comprehensive instructions for deploying the CID Telangana website using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 2GB RAM available for containers

### Development Environment
```bash
# Start development environment with hot reload
./docker-run.sh dev

# Application will be available at:
# - Web App: http://localhost:5001
# - PostgreSQL: localhost:5433
```

### Production Environment
```bash
# Start production environment
./docker-run.sh prod

# Application will be available at:
# - Web App: http://localhost:5000
# - Nginx (if enabled): http://localhost:80
# - PostgreSQL: localhost:5432
```

## 📁 Project Structure

```
cid-telangana/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile                  # Production image
├── Dockerfile.dev              # Development image
├── docker-run.sh              # Management script
├── nginx.conf                 # Nginx configuration
├── database_export.sql        # Database initialization
├── scripts/
│   └── backup/
│       ├── backup.sh          # Database backup script
│       ├── restore.sh         # Database restore script
│       └── cron-backup.sh     # Automated backup script
├── backups/                   # Database backups storage
└── uploads/                   # File uploads storage
```

## 🛠️ Management Commands

The `docker-run.sh` script provides easy management of the Docker environment:

```bash
# Development
./docker-run.sh dev              # Start development environment
./docker-run.sh logs app-dev     # View development app logs

# Production  
./docker-run.sh prod             # Start production environment
./docker-run.sh logs app         # View production app logs

# Database Operations
./docker-run.sh backup           # Create database backup
./docker-run.sh restore backup.sql  # Restore from backup

# Maintenance
./docker-run.sh build            # Build Docker images
./docker-run.sh health           # Check container health
./docker-run.sh stop             # Stop all containers
./docker-run.sh clean            # Remove containers and data (⚠️ DATA LOSS)

# Help
./docker-run.sh help             # Show all available commands
```

## 🗄️ Database Management

### Automatic Initialization
The database is automatically initialized with data from `database_export.sql` on first startup.

### Manual Backup
```bash
# Create backup
./docker-run.sh backup

# Backups are stored in ./backups/ directory with timestamps
# Format: cid_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Restore from Backup
```bash
# List available backups
ls -la backups/

# Restore specific backup
./docker-run.sh restore cid_backup_20250818_120000.sql.gz
```

### Automated Backups
Set up automated daily backups using cron:

```bash
# Add to crontab (crontab -e)
0 2 * * * /path/to/cid-telangana/scripts/backup/cron-backup.sh
```

## 🔧 Configuration

### Environment Variables

#### Production (docker-compose.yml)
```yaml
environment:
  NODE_ENV: production
  PORT: 5000
  DATABASE_URL: postgresql://ciduser:cidpassword@postgres:5432/ciddb
  SESSION_SECRET: your-super-secret-session-key-change-this-in-production
```

#### Development (docker-compose.dev.yml)
```yaml
environment:
  NODE_ENV: development
  PORT: 5000
  DATABASE_URL: postgresql://ciduser:cidpassword@postgres-dev:5432/ciddb_dev
  SESSION_SECRET: dev-session-secret-key
```

### Custom Configuration
1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your specific values:
   ```bash
   SESSION_SECRET=your-production-secret-key
   POSTGRES_PASSWORD=your-secure-password
   ```

3. Update docker-compose.yml to use environment file:
   ```yaml
   env_file:
     - .env
   ```

## 🌐 Nginx Reverse Proxy

For production deployments, Nginx is included as a reverse proxy with the following features:

- **Rate Limiting**: API endpoints and login protection
- **Static File Caching**: Optimized asset delivery  
- **Security Headers**: XSS protection, content security policy
- **Gzip Compression**: Reduced bandwidth usage
- **SSL/TLS Ready**: Uncomment HTTPS configuration

### Enable Nginx
```bash
# Start with Nginx (production profile)
docker-compose --profile production up -d

# Or use the management script
COMPOSE_PROFILES=production ./docker-run.sh prod
```

### SSL/HTTPS Setup
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `./ssl/` directory
3. Uncomment HTTPS server block in `nginx.conf`
4. Update your domain configuration

## 📊 Monitoring and Health Checks

### Container Health Status
```bash
./docker-run.sh health
```

### Application Logs
```bash
# All containers
./docker-run.sh logs

# Specific container
./docker-run.sh logs app          # Production app
./docker-run.sh logs app-dev      # Development app
./docker-run.sh logs postgres     # Production database
./docker-run.sh logs nginx        # Nginx proxy
```

### Health Check Endpoints
- Application: `http://localhost:5000/api/health`
- Database: Automatic health checks in Docker Compose

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Change default database passwords
- [ ] Use strong SESSION_SECRET
- [ ] Enable SSL/HTTPS with valid certificates
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Database backup encryption
- [ ] Monitor logs for suspicious activity

### File Permissions
```bash
# Ensure proper permissions for scripts
chmod +x docker-run.sh
chmod +x scripts/backup/*.sh

# Secure backup directory
chmod 700 backups/
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :5000

# Stop conflicting services or change port in docker-compose.yml
```

#### Database Connection Failed
```bash
# Check database logs
./docker-run.sh logs postgres

# Verify database is healthy
docker-compose ps
```

#### Permission Denied Errors
```bash
# Fix script permissions
chmod +x docker-run.sh scripts/backup/*.sh

# Fix volume permissions
sudo chown -R $USER:$USER uploads/ backups/
```

#### Out of Disk Space
```bash
# Clean up Docker resources
docker system prune -a

# Remove old backups
find backups/ -name "*.sql.gz" -mtime +7 -delete
```

### Reset Everything
If you need to completely reset the environment:

```bash
# WARNING: This will delete all data
./docker-run.sh clean

# Remove all Docker resources
docker system prune -a --volumes

# Start fresh
./docker-run.sh setup
./docker-run.sh dev
```

## 📈 Performance Optimization

### Production Optimizations
1. **Enable Nginx caching** for static assets
2. **Configure PostgreSQL** memory settings
3. **Use Docker BuildKit** for faster builds
4. **Implement log rotation** to prevent disk filling

### Development Optimizations
1. **Use bind mounts** for hot reload (already configured)
2. **Disable health checks** in development if needed
3. **Reduce image size** with multi-stage builds

## 🤝 Support and Maintenance

### Regular Maintenance Tasks
- Weekly: Check logs and backup integrity
- Monthly: Update Docker images and dependencies
- Quarterly: Security audit and password rotation

### Backup Best Practices
- Test restore procedures regularly
- Store backups in multiple locations
- Encrypt sensitive backups
- Document recovery procedures

### Updates and Upgrades
```bash
# Pull latest images
docker-compose pull

# Restart with new images
./docker-run.sh stop
./docker-run.sh prod

# Clean up old images
docker image prune
```

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Note**: This documentation assumes a Linux/Unix environment. For Windows, use PowerShell or WSL2 for the best experience.