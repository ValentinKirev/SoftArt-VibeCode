# SoftArt VibeCode - Quick Start Guide

This guide provides multiple ways to start the SoftArt VibeCode application with all necessary setup including Docker containers, database migrations, and seeders.

## 🚀 Quick Start Options

### Option 1: PowerShell (Recommended for Windows)
```powershell
.\start.ps1
```

### Option 2: Batch File (Windows Alternative)
```cmd
start.bat
```

### Option 3: Bash Script (Linux/Mac/WSL)
```bash
./start.sh
```

### Option 4: Manual Steps
If you prefer to run commands manually:

```bash
# 1. Stop existing containers
docker-compose down

# 2. Build and start containers
docker-compose up --build -d

# 3. Wait for database (10-15 seconds)
sleep 10

# 4. Run fresh migrations (drops all tables and recreates)
docker-compose exec laravel_backend php artisan migrate:fresh --force

# 5. Clear cache
docker-compose exec laravel_backend php artisan cache:clear
docker-compose exec laravel_backend php artisan config:clear
docker-compose exec laravel_backend php artisan route:clear
docker-compose exec laravel_backend php artisan view:clear

# 6. Clear all sessions (ensures no logged user)
docker-compose exec laravel_backend php artisan session:table
docker-compose exec laravel_backend php artisan migrate --force
docker-compose exec laravel_backend php artisan auth:clear-resets

# 7. Run seeders
docker-compose exec laravel_backend php artisan db:seed --force
docker-compose exec laravel_backend php artisan db:seed --class=DatabaseSeeder --force

# 8. Install frontend dependencies (if needed)
docker-compose exec frontend npm install
```

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Sufficient memory (4GB+ recommended)

## 🌐 Access Points

After running the start script, you can access:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/test

## 🔧 Troubleshooting

### Docker Issues
```bash
# Check Docker status
docker info

# Check container logs
docker-compose logs

# Restart containers
docker-compose restart
```

### Database Issues
```bash
# Check database connection
docker-compose exec mysql mysql -u root -proot_password -e "SHOW DATABASES;"

# Reset database
docker-compose exec laravel_backend php artisan migrate:fresh --seed
```

### Frontend Issues
```bash
# Rebuild frontend
docker-compose exec frontend npm install
docker-compose restart frontend

# Check frontend logs
docker-compose logs frontend
```

## 📊 Default Credentials

### Database
- **Host**: localhost:3306
- **Database**: vibecode_db
- **Username**: root
- **Password**: root_password

### Test Users (created by seeders)
- **Admin**: ivan@admin.local / password
- **Owner**: owner@demo.local / password
- **Project Manager**: pm@demo.local / password
- **Developer**: dev@demo.local / password
- **Designer**: designer@demo.local / password
- **QA Engineer**: boris@qa.local / password

## 🛠 Useful Commands

### Development
```bash
# View live logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f laravel_backend
docker-compose logs -f frontend

# Access backend shell
docker-compose exec laravel_backend bash

# Access database shell
docker-compose exec mysql mysql -u root -proot_password vibecode_db

# Restart specific service
docker-compose restart laravel_backend
docker-compose restart frontend
```

### Maintenance
```bash
# Stop application
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Update dependencies
docker-compose exec frontend npm update
docker-compose exec laravel_backend composer update
```

### Database Management
```bash
# Create new migration
docker-compose exec laravel_backend php artisan make:migration create_new_table

# Run specific migration
docker-compose exec laravel_backend php artisan migrate --path=database/migrations/2023_01_01_000000_create_new_table.php

# Rollback migration
docker-compose exec laravel_backend php artisan migrate:rollback

# Fresh start with seeders
docker-compose exec laravel_backend php artisan migrate:fresh --seed
```

## 📝 What the Start Script Does

1. **Docker Setup**
   - Stops existing containers
   - Builds and starts new containers
   - Verifies all containers are running

2. **Database Setup**
   - Waits for MySQL to be ready
   - Runs **fresh migrations** (drops all tables and recreates)
   - Clears Laravel cache
   - **Clears all user sessions** (ensures no logged user)
   - Runs database seeders
   - Runs additional seeders to ensure complete data population

3. **Frontend Setup**
   - Checks for missing dependencies
   - Installs npm packages if needed

4. **Verification**
   - Displays application URLs
   - Shows container status
   - Provides useful commands

## 🔄 Fresh Start Guarantee

The start script ensures a **completely fresh start** each time:
- ✅ **All database tables are dropped and recreated**
- ✅ **All user sessions are cleared**
- ✅ **No user will be logged in** after startup
- ✅ **All seed data is freshly populated**
- ✅ **Cache is completely cleared**

This means every time you run the start script, you get a clean slate with no logged users and fresh test data.

## 🔄 Reset Everything

If you need to completely reset the application:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images (optional)
docker system prune -a

# Start fresh
./start.sh  # or .\start.ps1 on Windows
```

## 📞 Support

If you encounter issues:

1. Check Docker is running: `docker info`
2. Check container logs: `docker-compose logs`
3. Verify ports aren't in use: 3001, 8000, 3306
4. Ensure sufficient disk space and memory

## 🎯 Next Steps

Once the application is running:

1. Open http://localhost:3001 in your browser
2. Login with test credentials
3. Explore the dashboard and tools management
4. Test the tool editing functionality

Happy coding! 🚀
