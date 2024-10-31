#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_message() {
    echo -e "${GREEN}=== $1 ===${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

# Function to check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed. Please install it first."
        exit 1
    fi
}

# Check required commands
check_command "docker"
check_command "docker-compose"

# Stop any running containers
print_message "Stopping running containers"
docker-compose down

# Remove old containers, images, and volumes if they exist
print_message "Cleaning up old containers and images"
docker-compose rm -f
docker image prune -f

# Build new images
print_message "Building new Docker images"
docker-compose build --no-cache

# Start the services
print_message "Starting services"
docker-compose up -d

# Check if services are running
print_message "Checking service status"
sleep 5

if docker-compose ps | grep -q "Up"; then
    print_message "Services are running successfully!"
    echo -e "${GREEN}You can access the application at: http://localhost:3001${NC}"
    
    # Display container logs
    print_message "Container logs:"
    docker-compose logs --tail=50
else
    print_error "Services failed to start properly"
    docker-compose logs
    exit 1
fi