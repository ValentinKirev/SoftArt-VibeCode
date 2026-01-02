# SoftArt VibeCode - Complete Start Script (PowerShell)
# This script handles Docker setup, migrations, and seeders

# Set error handling
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting SoftArt VibeCode Application..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Host "[STEP] $Message" -ForegroundColor Blue
}

# Check if Docker is running
try {
    $null = docker info 2>$null
    Write-Status "Docker is running ✓"
} catch {
    Write-Error "Docker is not running. Please start Docker first."
    exit 1
}

# Stop any existing containers
Write-Step "Stopping existing containers..."
try {
    docker-compose down 2>$null | Out-Null
} catch {
    # Ignore errors if containers aren't running
}

# Build and start containers
Write-Step "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for containers to be ready
Write-Status "Waiting for containers to be ready..."
Start-Sleep -Seconds 10

# Check if containers are running
Write-Step "Checking container status..."
$containerStatus = docker-compose ps
if ($containerStatus -notmatch "Up") {
    Write-Error "Some containers failed to start. Check logs with: docker-compose logs"
    exit 1
}

Write-Status "All containers are running ✓"

# Wait for database to be ready
Write-Step "Waiting for database to be ready..."
Write-Host "Checking database connection..."
for ($i = 1; $i -le 30; $i++) {
    try {
        $null = docker-compose exec -T mysql mysql -u root -proot_password -e "SELECT 1" 2>$null
        Write-Status "Database is ready ✓"
        break
    } catch {
        if ($i -eq 30) {
            Write-Error "Database failed to start after 30 seconds"
            exit 1
        }
        Write-Host "Waiting for database... ($i/30)"
        Start-Sleep -Seconds 1
    }
}

# Run Laravel migrations (fresh start) - GUARANTEED
Write-Step "Running fresh Laravel migrations..."
try {
    docker-compose exec laravel_backend php artisan migrate:fresh --force
    if ($LASTEXITCODE -ne 0) { throw "Migrations failed" }
} catch {
    Write-Error "Migrations failed! Please check the logs."
    exit 1
}

# Clear Laravel cache
Write-Step "Clearing Laravel cache..."
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

# Clear all sessions to ensure no logged user
Write-Step "Clearing all user sessions..."
docker-compose exec laravel_backend php artisan session:table
docker-compose exec laravel_backend php artisan migrate --force
docker-compose exec laravel_backend php artisan auth:clear-resets

# Clear Laravel cache and authentication data (safe commands only)
Write-Step "Clearing all authentication data..."
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

# Clear session storage safely (preserve directory structure)
Write-Step "Clearing session storage and tokens..."
docker-compose exec laravel_backend php artisan session:flush
docker-compose exec laravel_backend php artisan cache:flush

# Run database seeders - GUARANTEED
Write-Step "Running database seeders..."
try {
    docker-compose exec laravel_backend php artisan db:seed --force
    if ($LASTEXITCODE -ne 0) { throw "Database seeders failed" }
} catch {
    Write-Error "Database seeders failed! Please check the logs."
    exit 1
}

# Additional seeder commands to ensure all data is populated - GUARANTEED
Write-Step "Running additional seeders..."
try {
    docker-compose exec laravel_backend php artisan db:seed --class=DatabaseSeeder --force
    if ($LASTEXITCODE -ne 0) { throw "Additional seeders failed" }
} catch {
    Write-Error "Additional seeders failed! Please check the logs."
    exit 1
}

# Verify database setup - GUARANTEED
Write-Step "Verifying database setup..."
try {
    docker-compose exec laravel_backend php artisan migrate:status
    if ($LASTEXITCODE -ne 0) { throw "Migration status check failed" }
} catch {
    Write-Error "Migration status check failed! Please check the logs."
    exit 1
}

# Verify tables exist - GUARANTEED
Write-Step "Verifying tables exist..."
try {
    docker-compose exec laravel_backend php artisan tinker --execute="DB::select('SHOW TABLES');" 2>$null
    if ($LASTEXITCODE -ne 0) { throw "Table verification failed" }
} catch {
    Write-Error "Table verification failed! Please check the logs."
    exit 1
}

# Install frontend dependencies if needed
Write-Step "Checking frontend dependencies..."
try {
    $null = docker-compose exec frontend npm list axios 2>$null
} catch {
    Write-Warning "Installing missing frontend dependencies..."
    docker-compose exec frontend npm install
}

# Show final status
Write-Status "Application setup complete! ✓"
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:8000"
Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose logs -f"
Write-Host "   Stop app: docker-compose down"
Write-Host "   Restart: docker-compose restart"
Write-Host ""
Write-Host "📝 Database Credentials:" -ForegroundColor Cyan
Write-Host "   Host: localhost:3306"
Write-Host "   Database: vibecode_db"
Write-Host "   Username: root"
Write-Host "   Password: root_password"
Write-Host ""
Write-Host "✅ SoftArt VibeCode is ready to use!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
