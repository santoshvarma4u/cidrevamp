#!/bin/bash

# CID Telangana Docker Management Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

# Help function
show_help() {
    echo "CID Telangana Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev           Start development environment with hot reload"
    echo "  prod          Start production environment"
    echo "  build         Build production Docker images"
    echo "  backup        Create database backup"
    echo "  restore       Restore database from backup"
    echo "  logs          Show application logs"
    echo "  stop          Stop all containers"
    echo "  clean         Remove all containers and volumes (WARNING: Data loss)"
    echo "  setup         Initial setup and database initialization"
    echo "  health        Check container health status"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev                    # Start development environment"
    echo "  $0 backup                 # Create database backup"
    echo "  $0 restore backup.sql     # Restore from specific backup"
    echo "  $0 logs app               # Show app container logs"
}

# Setup function
setup_environment() {
    print_header "Setting Up CID Telangana Environment"
    
    # Create necessary directories
    mkdir -p backups
    mkdir -p uploads
    mkdir -p logs
    
    # Check if database_export.sql exists
    if [ ! -f "database_export.sql" ]; then
        print_warning "database_export.sql not found. Creating empty database."
    fi
    
    print_status "Environment setup completed!"
}

# Development environment
start_dev() {
    print_header "Starting Development Environment"
    
    setup_environment
    
    print_status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_status "Development environment started!"
    echo ""
    echo "Services available at:"
    echo "  - Application: http://localhost:5001"
    echo "  - PostgreSQL: localhost:5433"
    echo ""
    echo "To view logs: $0 logs"
    echo "To stop: $0 stop"
}

# Production environment
start_prod() {
    print_header "Starting Production Environment"
    
    setup_environment
    
    print_status "Building and starting production containers..."
    docker-compose up --build -d
    
    print_status "Production environment started!"
    echo ""
    echo "Services available at:"
    echo "  - Application: http://localhost:5000"
    echo "  - Nginx (if enabled): http://localhost:80"
    echo "  - PostgreSQL: localhost:5432"
    echo ""
    echo "To view logs: $0 logs"
    echo "To stop: $0 stop"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    
    print_status "Building production image..."
    docker-compose build app
    
    print_status "Building development image..."
    docker-compose -f docker-compose.dev.yml build app-dev
    
    print_status "Images built successfully!"
}

# Create backup
create_backup() {
    print_header "Creating Database Backup"
    
    # Check if development or production
    if docker-compose -f docker-compose.dev.yml ps postgres-dev | grep -q "Up"; then
        print_status "Creating backup from development database..."
        docker-compose -f docker-compose.dev.yml --profile backup run --rm db-backup
    elif docker-compose ps postgres | grep -q "Up"; then
        print_status "Creating backup from production database..."
        # Update backup script for production
        POSTGRES_HOST=postgres POSTGRES_DB=ciddb docker-compose run --rm \
            -e POSTGRES_HOST=postgres -e POSTGRES_DB=ciddb \
            postgres /scripts/backup.sh
    else
        print_error "No database container is running!"
        exit 1
    fi
    
    print_status "Backup created successfully! Check ./backups/ directory"
}

# Restore backup
restore_backup() {
    if [ -z "$2" ]; then
        print_error "Please specify backup file to restore"
        echo "Usage: $0 restore <backup_file>"
        echo "Available backups:"
        ls -la backups/ 2>/dev/null || echo "No backups found"
        exit 1
    fi
    
    print_header "Restoring Database Backup"
    
    BACKUP_FILE="$2"
    if [ ! -f "backups/$BACKUP_FILE" ]; then
        print_error "Backup file 'backups/$BACKUP_FILE' not found!"
        exit 1
    fi
    
    print_warning "This will overwrite the current database. Are you sure? (y/N)"
    read -r confirm
    if [[ $confirm != [yY] ]]; then
        print_status "Restore cancelled."
        exit 0
    fi
    
    # Restore to appropriate database
    if docker-compose -f docker-compose.dev.yml ps postgres-dev | grep -q "Up"; then
        print_status "Restoring to development database..."
        docker-compose -f docker-compose.dev.yml run --rm \
            -v "$(pwd)/backups/$BACKUP_FILE:/backup_file" \
            postgres-dev /scripts/restore.sh /backup_file
    else
        print_status "Restoring to production database..."
        docker-compose run --rm \
            -v "$(pwd)/backups/$BACKUP_FILE:/backup_file" \
            postgres /scripts/restore.sh /backup_file
    fi
    
    print_status "Database restored successfully!"
}

# Show logs
show_logs() {
    SERVICE=${2:-""}
    
    if [ -n "$SERVICE" ]; then
        print_header "Showing logs for $SERVICE"
        if docker-compose -f docker-compose.dev.yml ps | grep -q "$SERVICE"; then
            docker-compose -f docker-compose.dev.yml logs -f "$SERVICE"
        else
            docker-compose logs -f "$SERVICE"
        fi
    else
        print_header "Showing all container logs"
        if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
            docker-compose -f docker-compose.dev.yml logs -f
        else
            docker-compose logs -f
        fi
    fi
}

# Stop containers
stop_containers() {
    print_header "Stopping All Containers"
    
    # Stop both development and production
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    
    print_status "All containers stopped!"
}

# Clean up
clean_environment() {
    print_header "Cleaning Up Environment"
    
    print_warning "This will remove ALL containers, volumes, and data. Are you sure? (y/N)"
    read -r confirm
    if [[ $confirm != [yY] ]]; then
        print_status "Cleanup cancelled."
        exit 0
    fi
    
    print_status "Stopping and removing all containers..."
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
    docker-compose down -v --remove-orphans 2>/dev/null || true
    
    print_status "Removing Docker images..."
    docker rmi $(docker images "cid-*" -q) 2>/dev/null || true
    
    print_status "Cleanup completed!"
}

# Check health
check_health() {
    print_header "Container Health Status"
    
    echo "Development Environment:"
    docker-compose -f docker-compose.dev.yml ps
    
    echo ""
    echo "Production Environment:"
    docker-compose ps
    
    echo ""
    print_status "Health check completed!"
}

# Main script logic
case "$1" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "build")
        build_images
        ;;
    "backup")
        create_backup
        ;;
    "restore")
        restore_backup "$@"
        ;;
    "logs")
        show_logs "$@"
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_environment
        ;;
    "setup")
        setup_environment
        ;;
    "health")
        check_health
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac