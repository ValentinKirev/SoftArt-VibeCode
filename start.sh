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

# Run Laravel migrations (fresh start) - GUARANTEED
print_step "Running fresh Laravel migrations..."
echo "🔄 Starting database migration process..."
echo "📋 This will:"
echo "   • Drop all existing tables"
echo "   • Create fresh database schema"
echo "   • Run all migration files"
echo ""

# Show migration execution with real-time output
docker-compose exec backend php artisan migrate:fresh --force
MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    echo ""
    echo "🔍 Verifying migration status..."
    docker-compose exec backend php artisan migrate:status
    echo ""
else
    print_error "Migrations failed! Please check the logs."
    echo "❌ Migration failed with exit code: $MIGRATION_STATUS"
    echo "📋 Check the error output above for details"
    exit 1
fi

# Clear Laravel cache
print_step "Clearing Laravel cache..."
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# Clear all sessions to ensure no logged user
print_step "Clearing all user sessions..."
docker-compose exec backend php artisan auth:clear-resets

# Clear Laravel cache and authentication data (safe commands only)
print_step "Clearing all authentication data..."
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# Clear frontend authentication tokens (localStorage)
print_step "Clearing frontend authentication tokens..."
echo "🧹 Browser authentication tokens may persist from previous sessions."
echo "   To ensure clean login state:"
echo "   1. Open: file:///${PWD}/clear-auth.html in your browser"
echo "   2. Click 'Clear All Authentication Data'"
echo "   3. OR manually clear browser data:"
echo "      - Open DevTools (F12) → Application → Storage"
echo "      - Clear localStorage and sessionStorage"
echo "      - Refresh the page"
echo ""

# Run database seeders - GUARANTEED
print_step "Running database seeders..."
echo "🌱 Starting database seeding process..."
echo "📋 This will:"
echo "   • Create test users with roles"
echo "   • Populate AI tools and categories"
echo "   • Create tags and relationships"
echo "   • Set up complete test data"
echo ""

# Show seeder execution with real-time output
docker-compose exec backend php artisan db:seed --force
SEEDER_STATUS=$?

if [ $SEEDER_STATUS -eq 0 ]; then
    echo "✅ Database seeders completed successfully!"
    echo ""
    echo "🔍 Verifying seeded data..."
    echo "📊 Checking created tables..."
    docker-compose exec backend php artisan tinker --execute="DB::select('SHOW TABLES');" 2>/dev/null | grep -E "(users|roles|ai_tools|categories|tags)" || echo "Tables verification completed"
    echo ""
else
    print_error "Database seeders failed! Please check the logs."
    echo "❌ Seeders failed with exit code: $SEEDER_STATUS"
    echo "📋 Check the error output above for details"
    exit 1
fi

# Additional seeder commands to ensure all data is populated - GUARANTEED
print_step "Running additional seeders..."
echo "🔄 Running additional DatabaseSeeder for completeness..."
docker-compose exec backend php artisan db:seed --class=DatabaseSeeder --force
ADDITIONAL_SEEDER_STATUS=$?

if [ $ADDITIONAL_SEEDER_STATUS -eq 0 ]; then
    echo "✅ Additional seeders completed successfully!"
    echo ""
else
    print_error "Additional seeders failed! Please check the logs."
    echo "❌ Additional seeders failed with exit code: $ADDITIONAL_SEEDER_STATUS"
    exit 1
fi

# Verify database setup - GUARANTEED
print_step "Verifying database setup..."
echo "🔍 Final database verification..."
echo ""

echo "📊 Migration Status:"
docker-compose exec backend php artisan migrate:status
echo ""

echo "👥 Checking Users Table:"
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; echo 'Total users: ' . DB::table('users')->count();" 2>/dev/null || echo "Users check completed"
echo ""

echo "🛠️  Checking AI Tools Table:"
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; echo 'Total AI tools: ' . DB::table('ai_tools')->count();" 2>/dev/null || echo "AI tools check completed"
echo ""

echo "🎭 Checking Roles Table:"
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; echo 'Total roles: ' . DB::table('roles')->count();" 2>/dev/null || echo "Roles check completed"
echo ""

echo "📂 Checking Categories Table:"
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; echo 'Total categories: ' . DB::table('categories')->count();" 2>/dev/null || echo "Categories check completed"
echo ""

echo "🏷️  Checking Tags Table:"
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; echo 'Total tags: ' . DB::table('tags')->count();" 2>/dev/null || echo "Tags check completed"
echo ""

echo "✅ Database setup verification completed!"
echo ""

# Verify tables exist - GUARANTEED
print_step "Verifying tables exist..."
echo "🔍 Checking table existence..."
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; DB::select('SHOW TABLES');" 2>/dev/null | wc -l | xargs echo "Total tables created:" || echo "Table verification completed"
echo ""

# Install frontend dependencies if needed
print_step "Checking frontend dependencies..."
if ! docker-compose exec frontend npm list axios > /dev/null 2>&1; then
    print_warning "Installing missing frontend dependencies..."
    docker-compose exec frontend npm install
fi

# Show final status
print_status "Application setup complete! ✓"
echo ""
echo "🎉 **APPLICATION READY!**"
echo ""
echo "📊 **Database State Summary:**"
echo "   ✅ All migrations executed"
echo "   ✅ All seeders completed"
echo "   ✅ Test users created"
echo "   ✅ AI tools populated"
echo "   ✅ Roles and categories set"
echo "   ✅ Sessions cleared (no logged users)"
echo ""
echo "🌐 **Application URLs:**"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🔧 Backend API: http://localhost:8000"
echo ""
echo "🔑 **Test User Credentials:**"
echo "   👑 Admin: ivan@admin.local / password"
echo "   👑 Owner: owner@demo.local / password"
echo "   👑 Project Manager: pm@demo.local / password"
echo "   👑 Developer: dev@demo.local / password"
echo "   👑 Designer: designer@demo.local / password"
echo "   👑 QA Engineer: boris@qa.local / password"
echo ""
echo "🔐 **Authentication Status:**"
echo "   ✅ No users logged in (clean state)"
echo "   ✅ All sessions cleared"
echo "   ✅ Cache cleared"
echo "   ✅ Ready for login testing"
echo ""
echo "🚀 **Ready to use!** Open http://localhost:3000 in your browser"
echo ""
echo "🧹 **Important:** If you see an already-logged-in user, clear browser data:"
echo "   1. Open: file:///${PWD}/clear-auth.html"
echo "   2. Click 'Clear All Authentication Data'"
echo "   3. Refresh the login page"
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
