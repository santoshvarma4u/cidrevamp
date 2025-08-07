#!/bin/bash

# CID Telangana Docker Run Script
# This script helps you run the application with Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if command -v docker-compose > /dev/null 2>&1; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version > /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    print_success "Docker Compose is available: $COMPOSE_CMD"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p uploads
    mkdir -p uploads/officers
    mkdir -p uploads/videos
    mkdir -p uploads/photos
    mkdir -p uploads/documents
    print_success "Directories created"
}

# Function to copy environment file
setup_environment() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your production settings before running in production"
    else
        print_success ".env file already exists"
    fi
}

# Function to build and run the application
run_application() {
    local profile=${1:-""}
    
    print_status "Building and starting CID Telangana application..."
    
    if [ "$profile" = "dev" ]; then
        print_status "Starting in development mode..."
        $COMPOSE_CMD -f docker-compose.dev.yml up --build -d
    elif [ "$profile" = "production" ]; then
        print_status "Starting in production mode with Nginx..."
        $COMPOSE_CMD --profile production up --build -d
    else
        print_status "Starting in standard mode..."
        $COMPOSE_CMD up --build -d
    fi
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 10
    
    # Check if services are running
    if $COMPOSE_CMD ps | grep -q "Up"; then
        print_success "Application is running!"
        print_status "Access the application at: http://localhost:5000"
        
        if [ "$profile" = "production" ]; then
            print_status "Nginx proxy available at: http://localhost:80"
        fi
        
        if [ "$profile" = "dev" ]; then
            print_status "Development database available at: localhost:5433"
            print_status "PgAdmin available at: http://localhost:8080 (if enabled)"
        fi
    else
        print_error "Some services failed to start. Check logs with: $COMPOSE_CMD logs"
        exit 1
    fi
}

# Function to show logs
show_logs() {
    $COMPOSE_CMD logs -f
}

# Function to stop the application
stop_application() {
    print_status "Stopping CID Telangana application..."
    $COMPOSE_CMD down
    print_success "Application stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    $COMPOSE_CMD down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup complete"
}

# Main script logic
case "${1:-start}" in
    "start")
        check_docker
        check_docker_compose
        create_directories
        setup_environment
        run_application
        ;;
    "dev")
        check_docker
        check_docker_compose
        create_directories
        setup_environment
        run_application "dev"
        ;;
    "prod")
        check_docker
        check_docker_compose
        create_directories
        setup_environment
        run_application "production"
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop_application
        ;;
    "restart")
        stop_application
        sleep 2
        run_application
        ;;
    "clean")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "CID Telangana Docker Management Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  start     Start the application (default)"
        echo "  dev       Start in development mode with dev database"
        echo "  prod      Start in production mode with Nginx"
        echo "  logs      Show application logs"
        echo "  stop      Stop the application"
        echo "  restart   Restart the application"
        echo "  clean     Stop and clean up all Docker resources"
        echo "  help      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Start the application"
        echo "  $0 dev      # Start with development database"
        echo "  $0 prod     # Start with Nginx proxy"
        echo "  $0 logs     # View logs"
        echo "  $0 stop     # Stop everything"
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac