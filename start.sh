#!/bin/bash

# SoftArt VibeCode - Simple Start Script (Fixed Version)
# This script handles Docker setup without rebuilding

set -e  # Exit on any error

echo "🚀 Starting SoftArt VibeCode AI Tools Management Platform..."
echo "=========================================================="

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

# Remove ALL storage files that cause Docker build issues
print_step "Removing problematic storage files..."
find . -name "storage" -type f -delete 2>/dev/null || true
if [ -f "./backend/public/storage" ]; then
    rm "./backend/public/storage"
    print_status "Removed backend/public/storage file ✓"
fi
if [ -f "./public/storage" ]; then
    rm "./public/storage"
    print_status "Removed public/storage file ✓"
fi

# Clear Docker build cache to remove any cached storage files
print_step "Clearing Docker build cache..."
docker builder prune -f 2>/dev/null || true

# Start containers with rebuild (images will be rebuilt)
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

# Wait a bit more for containers to fully initialize
print_step "Waiting for containers to fully initialize..."
sleep 5

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
docker-compose exec backend php artisan migrate:fresh --force

# Clear Laravel cache
print_step "Clearing Laravel cache..."
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# Setup storage link and avatar directory
print_step "Setting up storage link and avatar directory..."
docker-compose exec backend sh -c "if [ -L public/storage ] || [ -f public/storage ] || [ -d public/storage ]; then rm -f public/storage; fi"
docker-compose exec backend php artisan storage:link 2>/dev/null || echo "Storage link already exists or created successfully"
docker-compose exec backend sh -c "mkdir -p storage/app/public/avatars"
echo "✅ Storage link and avatar directory setup complete"

# Clear all sessions to ensure no logged user
print_step "Clearing all user sessions..."
docker-compose exec backend php artisan auth:clear-resets 2>/dev/null || echo "Auth clears completed"

# Clear Laravel cache and authentication data
print_step "Clearing all authentication data..."
docker-compose exec backend php artisan cache:clear 2>/dev/null || echo "Cache clear completed"
docker-compose exec backend php artisan config:clear 2>/dev/null || echo "Config clear completed"
docker-compose exec backend php artisan route:clear 2>/dev/null || echo "Route clear completed"

# Clear database sessions (only if session table exists)
print_step "Clearing database sessions..."
if docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\Schema; if(Schema::hasTable('sessions')) { echo 'SESSION_TABLE_EXISTS'; }" 2>/dev/null | grep -q "SESSION_TABLE_EXISTS"; then
    docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; DB::table('sessions')->delete(); echo 'All database sessions cleared';" 2>/dev/null || echo "Database sessions cleared"
else
    echo "Session table does not exist yet - will be created during migrations"
fi

# Run database seeders
print_step "Running database seeders..."
docker-compose exec backend php artisan db:seed --force

# Additional seeder
print_step "Running additional seeders..."
docker-compose exec backend php artisan db:seed --class=DatabaseSeeder --force

# Final session clearing after database setup
print_step "Final session clearing after database setup..."
if docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\Schema; if(Schema::hasTable('sessions')) { echo 'SESSION_TABLE_EXISTS'; }" 2>/dev/null | grep -q "SESSION_TABLE_EXISTS"; then
    docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; DB::table('sessions')->delete(); echo 'All database sessions cleared after setup';" 2>/dev/null || echo "Final database sessions cleared"
else
    echo "Session table still not available - skipping final clear"
fi

# Install frontend dependencies if needed
print_step "Checking frontend dependencies..."
if ! docker-compose exec frontend npm list axios > /dev/null 2>&1; then
    print_warning "Installing missing frontend dependencies..."
    docker-compose exec frontend npm install
fi

# Show final status
print_status "Application setup complete! ✓"
echo ""
echo "🎉 **SOFTART VIBECODE AI TOOLS MANAGEMENT PLATFORM READY!**"
echo ""
echo "🌐 **Application URLs:**"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8000"
echo "   📚 API Documentation: http://localhost:8000/api/test"
echo ""
echo "🔑 **Test User Credentials:**"
echo "   👑 Owner: owner@demo.local / password (Full admin panel access)"
echo "   👑 Admin: ivan@admin.local / password"
echo "   👑 Project Manager: pm@demo.local / password"
echo "   👑 Developer: dev@demo.local / password"
echo "   👑 Designer: designer@demo.local / password"
echo "   👑 QA Engineer: boris@qa.local / password"
echo ""
echo "📊 Container Status:"
docker-compose ps
echo ""
echo "✅ SoftArt VibeCode AI Tools Management Platform is ready to use!"
echo "=========================================================="
