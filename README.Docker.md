# CID Telangana - Docker Deployment Guide

This guide explains how to run the CID Telangana application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose v2.0 or later
- At least 2GB of available RAM
- 5GB of free disk space

## Quick Start

### 1. Clone and Setup

```bash
# Make the run script executable
chmod +x docker-run.sh

# Start the application (creates .env file from template)
./docker-run.sh start
```

### 2. Access the Application

- **Web Application**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login

## Deployment Options

### Standard Deployment
```bash
# Start with PostgreSQL and web application
./docker-run.sh start
```

### Development Mode
```bash
# Start with development database and optional PgAdmin
./docker-run.sh dev

# Access PgAdmin (if enabled): http://localhost:8080
# Default credentials: admin@cidtelangana.gov.in / admin123
```

### Production Mode
```bash
# Start with Nginx reverse proxy
./docker-run.sh prod

# Access via: http://localhost:80
```

## Docker Compose Files

### docker-compose.yml (Production)
- PostgreSQL database with persistent storage
- CID web application with health checks
- Optional Nginx reverse proxy
- Automatic service recovery

### docker-compose.dev.yml (Development)
- Separate development database (port 5433)
- PgAdmin for database management
- Development-specific configurations

## Environment Configuration

### .env File
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://ciduser:cidpassword@postgres:5432/ciddb

# Application
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key

# Security
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=10485760
```

### Important Security Notes

⚠️ **Before Production Deployment:**

1. **Change Default Passwords**: Update database credentials in `.env`
2. **Generate Secure Session Secret**: Use a cryptographically secure random string
3. **Configure SSL**: Set up SSL certificates for HTTPS
4. **Update Admin Credentials**: Change default admin passwords
5. **Configure Firewall**: Restrict access to necessary ports only

## Container Details

### PostgreSQL Container
- **Image**: postgres:15-alpine
- **Port**: 5432 (internal), 5432 (external)
- **Data**: Persistent volume `postgres_data`
- **Init**: Loads `database_export.sql` on first run

### Application Container
- **Build**: Multi-stage optimized build
- **Port**: 5000
- **Uploads**: Persistent volume `app_uploads`
- **Health Check**: `/api/health` endpoint
- **User**: Non-root user for security

### Nginx Container (Production Only)
- **Image**: nginx:alpine
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Features**: Rate limiting, compression, security headers
- **SSL**: Ready for certificate configuration

## Management Commands

```bash
# View logs
./docker-run.sh logs

# Stop application
./docker-run.sh stop

# Restart application
./docker-run.sh restart

# Clean up (removes volumes!)
./docker-run.sh clean

# Show help
./docker-run.sh help
```

## Data Persistence

### Volumes
- `postgres_data`: Database storage
- `app_uploads`: User uploaded files

### Backup Database
```bash
# Export database
docker exec cid-postgres pg_dump -U ciduser ciddb > backup.sql

# Import database
docker exec -i cid-postgres psql -U ciduser ciddb < backup.sql
```

### Backup Uploads
```bash
# Backup uploads
docker cp cid-app:/app/uploads ./uploads-backup

# Restore uploads
docker cp ./uploads-backup/. cid-app:/app/uploads/
```

## Monitoring and Health Checks

### Health Check Endpoints
- **Application**: http://localhost:5000/api/health
- **Database**: Automated PostgreSQL health checks

### Container Status
```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Check health status
docker inspect cid-app | grep Health -A 10
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 5000
   sudo lsof -i :5000
   
   # Change port in docker-compose.yml
   ports:
     - "3000:5000"  # External:Internal
   ```

2. **Database Connection Failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Verify database is healthy
   docker-compose exec postgres pg_isready -U ciduser
   ```

3. **File Upload Issues**
   ```bash
   # Check upload directory permissions
   docker-compose exec app ls -la uploads
   
   # Fix permissions if needed
   docker-compose exec app chown -R nextjs:nodejs uploads
   ```

4. **Out of Disk Space**
   ```bash
   # Clean up Docker resources
   ./docker-run.sh clean
   
   # Remove unused images
   docker image prune -a
   ```

### Logs and Debugging

```bash
# Application logs
docker-compose logs app

# Database logs
docker-compose logs postgres

# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Container shell access
docker-compose exec app sh
```

## Production Deployment Checklist

- [ ] Update all default passwords
- [ ] Configure SSL certificates
- [ ] Set up proper backup strategy
- [ ] Configure monitoring and alerting
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Test disaster recovery procedures
- [ ] Set up database replication (if needed)
- [ ] Configure automated security updates
- [ ] Document incident response procedures

## Security Considerations

### Container Security
- Non-root user execution
- Multi-stage builds to minimize attack surface
- Regular base image updates
- Resource limits and health checks

### Network Security
- Internal container network
- Rate limiting via Nginx
- Security headers configuration
- CORS protection

### Data Security
- Encrypted database connections
- Secure session management
- File upload validation
- SQL injection protection via ORM

## Performance Optimization

### Production Tuning
- Enable Nginx compression and caching
- Configure PostgreSQL connection pooling
- Set appropriate resource limits
- Use CDN for static assets
- Implement database indexing

### Scaling Options
- Horizontal scaling with load balancer
- Database read replicas
- Redis for session storage
- Container orchestration (Kubernetes)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review container logs
3. Consult the main application documentation
4. Contact system administrators