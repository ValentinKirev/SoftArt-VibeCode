#!/bin/bash

# SoftArt VibeCode - Complete Start Script
# This script handles Docker setup, migrations, and seeders

set -e  # Exit on any error

echo "🚀 Starting SoftArt VibeCode Application..."
echo "=========================================="

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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_status "Docker is running ✓"

# Stop any existing containers
print_step "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start containers
print_step "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 10

# Check if containers are running
print_step "Checking container status..."
if ! docker-compose ps | grep -q "Up"; then
    print_error "Some containers failed to start. Check logs with: docker-compose logs"
    exit 1
fi

print_status "All containers are running ✓"

# Wait for database to be ready
print_step "Waiting for database to be ready..."
echo "Checking database connection..."
for i in {1..30}; do
    if docker-compose exec -T mysql mysql -u root -proot_password -e "SELECT 1" > /dev/null 2>&1; then
        print_status "Database is ready ✓"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Database failed to start after 30 seconds"
        exit 1
    fi
    echo "Waiting for database... ($i/30)"
    sleep 1
done

# Run Laravel migrations (fresh start)
print_step "Running fresh Laravel migrations..."
docker-compose exec laravel_backend php artisan migrate:fresh --force

# Clear Laravel cache
print_step "Clearing Laravel cache..."
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

# Clear all sessions to ensure no logged user
print_step "Clearing all user sessions..."
docker-compose exec laravel_backend php artisan session:table
docker-compose exec laravel_backend php artisan migrate --force
docker-compose exec laravel_backend php artisan auth:clear-resets

# Clear Laravel cache and authentication data (safe commands only)
print_step "Clearing all authentication data..."
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

# Clear session storage safely (preserve directory structure)
print_step "Clearing session storage and tokens..."
docker-compose exec laravel_backend php artisan session:flush
docker-compose exec laravel_backend php artisan cache:flush

# Run database seeders
print_step "Running database seeders..."
docker-compose exec laravel_backend php artisan db:seed --force

# Additional seeder commands to ensure all data is populated
print_step "Running additional seeders..."
docker-compose exec laravel_backend php artisan db:seed --class=DatabaseSeeder --force

# Verify database setup
print_step "Verifying database setup..."
docker-compose exec laravel_backend php artisan migrate:status

# Install frontend dependencies if needed
print_step "Checking frontend dependencies..."
if ! docker-compose exec frontend npm list axios > /dev/null 2>&1; then
    print_warning "Installing missing frontend dependencies..."
    docker-compose exec frontend npm install
fi

# Show final status
print_status "Application setup complete! ✓"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📊 Container Status:"
docker-compose ps
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop app: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "📝 Database Credentials:"
echo "   Host: localhost:3306"
echo "   Database: vibecode_db"
echo "   Username: root"
echo "   Password: root_password"
echo ""
echo "✅ SoftArt VibeCode is ready to use!"
echo "=========================================="
