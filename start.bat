@echo off
REM SoftArt VibeCode - Complete Start Script (Batch)
REM This script handles Docker setup, migrations, and seeders

title SoftArt VibeCode - Starting Application

echo 🚀 Starting SoftArt VibeCode Application...
echo ==========================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

echo [INFO] Docker is running ✓

REM Stop any existing containers
echo [STEP] Stopping existing containers...
docker-compose down >nul 2>&1

REM Build and start containers
echo [STEP] Building and starting Docker containers...
docker-compose up --build -d

REM Wait for containers to be ready
echo [INFO] Waiting for containers to be ready...
timeout /t 10 /nobreak >nul

REM Check if containers are running
echo [STEP] Checking container status...
docker-compose ps | find "Up" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Some containers failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo [INFO] All containers are running ✓

REM Wait for database to be ready
echo [STEP] Waiting for database to be ready...
echo Checking database connection...
:wait_db
set /a count=0
:db_loop
set /a count+=1
docker-compose exec -T mysql mysql -u root -proot_password -e "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Database is ready ✓
    goto db_ready
)
if %count% geq 30 (
    echo [ERROR] Database failed to start after 30 seconds
    pause
    exit /b 1
)
echo Waiting for database... (%count%/30)
timeout /t 1 /nobreak >nul
goto db_loop

:db_ready

REM Run Laravel migrations (fresh start) - GUARANTEED
echo [STEP] Running fresh Laravel migrations...
docker-compose exec laravel_backend php artisan migrate:fresh --force
if %errorlevel% neq 0 (
    echo [ERROR] Migrations failed! Please check the logs.
    exit /b 1
)

REM Clear Laravel cache
echo [STEP] Clearing Laravel cache...
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

REM Clear all sessions to ensure no logged user
echo [STEP] Clearing all user sessions...
docker-compose exec laravel_backend php artisan session:table
docker-compose exec laravel_backend php artisan migrate --force
docker-compose exec laravel_backend php artisan auth:clear-resets

REM Clear Laravel cache and authentication data (safe commands only)
echo [STEP] Clearing all authentication data...
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

REM Clear session storage safely (preserve directory structure)
echo [STEP] Clearing session storage and tokens...
docker-compose exec laravel_backend php artisan session:flush
docker-compose exec laravel_backend php artisan cache:flush

REM Run database seeders - GUARANTEED
echo [STEP] Running database seeders...
docker-compose exec laravel_backend php artisan db:seed --force
if %errorlevel% neq 0 (
    echo [ERROR] Database seeders failed! Please check the logs.
    exit /b 1
)

REM Additional seeder commands to ensure all data is populated - GUARANTEED
echo [STEP] Running additional seeders...
docker-compose exec laravel_backend php artisan db:seed --class=DatabaseSeeder --force
if %errorlevel% neq 0 (
    echo [ERROR] Additional seeders failed! Please check the logs.
    exit /b 1
)

REM Verify database setup - GUARANTEED
echo [STEP] Verifying database setup...
docker-compose exec laravel_backend php artisan migrate:status
if %errorlevel% neq 0 (
    echo [ERROR] Migration status check failed! Please check the logs.
    exit /b 1
)

REM Verify tables exist - GUARANTEED
echo [STEP] Verifying tables exist...
docker-compose exec laravel_backend php artisan tinker --execute="DB::select('SHOW TABLES');" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Table verification failed! Please check the logs.
    exit /b 1
)

REM Install frontend dependencies if needed
echo [STEP] Checking frontend dependencies...
docker-compose exec frontend npm list axios >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Installing missing frontend dependencies...
    docker-compose exec frontend npm install
)

REM Show final status
echo [INFO] Application setup complete! ✓
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo.
echo 📊 Container Status:
docker-compose ps
echo.
echo 🔧 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop app: docker-compose down
echo    Restart: docker-compose restart
echo.
echo 📝 Database Credentials:
echo    Host: localhost:3306
echo    Database: vibecode_db
echo    Username: root
echo    Password: root_password
echo.
echo ✅ SoftArt VibeCode is ready to use!
echo ==========================================
pause
