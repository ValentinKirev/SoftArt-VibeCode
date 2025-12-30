# SoftArt AI HUB - Docker Development Environment

A complete Docker Compose setup for a full-stack web application with Laravel backend, Next.js frontend, MySQL database, Redis cache, and Nginx reverse proxy.

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

### 1. Clone and Setup

```bash
# Copy environment file and configure
cp env.example .env
```

Edit the `.env` file with your desired configuration values.

### 2. Start Development Environment

```bash
# Start all services in development mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MailHog** (development): http://localhost:8025
- **phpMyAdmin** (if added): http://localhost:8080

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

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.override.yml

2. **Permission issues**: Ensure proper file permissions on host volumes

3. **Database connection**: Verify environment variables match between services

4. **Memory issues**: Increase Docker memory allocation

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






