# SoftArt AI HUB - Docker Development Environment

A complete Docker Compose setup for a full-stack web application with Laravel backend, Next.js frontend, MySQL database, Redis cache, and Nginx reverse proxy.

## 🚀 **IMPORTANT: First Time Setup**

**⚠️ BEFORE RUNNING THE APPLICATION:**

You **MUST** run the start script to properly initialize the database and clear all authentication data:

```bash
# Run the automated start script (REQUIRED for first-time setup)
./start.sh

# Or use PowerShell on Windows
.\start.ps1

# Or use Batch on Windows
.\start.bat
```

**📖 For detailed start script instructions, see: [README-START.md](README-START.md)**

**The start script ensures:**
- ✅ Fresh database migrations
- ✅ All test users and data are created
- ✅ No users are logged in (clean start)
- ✅ Authentication system is properly configured
- ✅ All dependencies are installed

**⚡ After running the start script, your application will be ready at:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

---

## Architecture

- **Backend**: Laravel (PHP 8.2) - API and business logic
- **Frontend**: Next.js with React and TypeScript - User interface
- **Database**: MySQL 8.0 - Data persistence
- **Cache**: Redis 7 - Caching and sessions
- **Web Server**: Nginx - Reverse proxy and static file serving

## Prerequisites

- Docker Engine
- Docker Compose
- At least 4GB RAM available for containers

## Quick Start

### 🚀 **Recommended: Use Start Script (First Time Setup)**

```bash
# Run the automated start script (RECOMMENDED)
./start.sh

# Or use PowerShell on Windows
.\start.ps1

# Or use Batch on Windows
.\start.bat
```

**📖 See [README-START.md](README-START.md) for detailed start script instructions.**

### 🔧 **Manual Setup (Advanced Users Only)**

> ⚠️ **Note**: Manual setup is not recommended. Use the start script above for proper database initialization.

```bash
# Copy environment file and configure
cp env.example .env

# Start all services in development mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 🌐 Access Your Application

**After running the start script:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MailHog** (development): http://localhost:8025
- **phpMyAdmin** (if added): http://localhost:8080

**🔑 Test User Credentials:**
- **Admin**: ivan@admin.local / password
- **Owner**: owner@demo.local / password
- **Project Manager**: pm@demo.local / password
- **Developer**: dev@demo.local / password
- **Designer**: designer@demo.local / password
- **QA Engineer**: boris@qa.local / password

## Project Structure

```
.
├── docker-compose.yml          # Production configuration
├── docker-compose.override.yml # Development overrides
├── backend/                    # Laravel application
│   └── Dockerfile
├── frontend/                   # Next.js application
│   └── Dockerfile
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── conf.d/
│   │       └── app.conf
│   └── mysql/
│       └── my.cnf
├── ssl/                        # SSL certificates (optional)
└── env.example                 # Environment variables template
```

## Development Workflow

### Starting Services

```bash
# Development mode (with hot reload)
docker-compose up -d

# Production mode (with nginx)
docker-compose --profile production up -d

# Include development tools (MailHog)
docker-compose --profile dev-tools up -d
```

### Working with Individual Services

```bash
# Laravel backend
docker-compose exec laravel bash
docker-compose exec laravel php artisan migrate
docker-compose exec laravel composer install

# Next.js frontend
docker-compose exec nextjs bash
docker-compose exec nextjs npm install

# Database
docker-compose exec mysql mysql -u vibecode_user -p vibecode_db
```

### Database Operations

```bash
# Create backup
docker-compose exec mysql mysqldump -u vibecode_user -p vibecode_db > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u vibecode_user -p vibecode_db < backup.sql

# Access Redis CLI
docker-compose exec redis redis-cli -a redis_secure_password
```

## Environment Variables

Key environment variables to configure in your `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_KEY` | Laravel application key | `base64:your_generated_key` |
| `DB_DATABASE` | MySQL database name | `vibecode_db` |
| `DB_USERNAME` | MySQL user | `vibecode_user` |
| `DB_PASSWORD` | MySQL password | `secure_password` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root_secure_password` |
| `REDIS_PASSWORD` | Redis password | `redis_secure_password` |

Generate Laravel APP_KEY:
```bash
docker-compose exec laravel php artisan key:generate
```

## SSL Configuration (Optional)

For HTTPS support:

1. Place your SSL certificates in the `ssl/` directory:
   - `fullchain.pem` - Certificate chain
   - `privkey.pem` - Private key

2. Uncomment SSL configuration in `docker/nginx/conf.d/app.conf`

3. Update docker-compose.yml to mount SSL certificates

## Performance Optimization

### Production Considerations

1. **Enable Nginx profile** for production:
   ```bash
   docker-compose --profile production up -d
   ```

2. **Database optimization**:
   - Adjust MySQL settings in `docker/mysql/my.cnf`
   - Configure connection pooling in Laravel

3. **Redis optimization**:
   - Configure persistence if needed
   - Set up Redis cluster for high availability

### Monitoring

```bash
# Check container resource usage
docker stats

# View service logs
docker-compose logs -f [service_name]

# Health check
curl http://localhost/health
```

## Troubleshooting

### 🚀 **First Step: Run Start Script**

**Before troubleshooting any issues, always run the start script first:**

```bash
# This resolves most common issues
./start.sh

# Or PowerShell
.\start.ps1

# Or Batch
.\start.bat
```

**The start script fixes:**
- Database connection issues
- Authentication problems
- Missing test data
- Cache/session issues
- Dependency problems

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.override.yml

2. **Permission issues**: Ensure proper file permissions on host volumes

3. **Database connection**: Run the start script first, then verify environment variables

4. **Authentication problems**: Run the start script to clear sessions and reset auth

5. **Memory issues**: Increase Docker memory allocation

6. **Missing test data**: Run the start script to populate database

### Reset Environment

```bash
# Stop and remove all containers, volumes
docker-compose down -v

# Rebuild all images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## Contributing

1. Make changes to the codebase
2. Test with `docker-compose up -d`
3. Ensure all services start correctly
4. Update documentation as needed

## License

This project is part of the SoftArt AI HUB application.






