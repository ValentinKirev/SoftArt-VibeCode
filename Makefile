# SoftArt VibeCode - Docker Commands

.PHONY: help up down build rebuild logs clean install migrate seed test

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Development commands
up: ## Start all services in development mode
	docker-compose up -d

up-prod: ## Start all services in production mode (with nginx)
	docker-compose --profile production up -d

down: ## Stop all services
	docker-compose down

build: ## Build all service images
	docker-compose build

rebuild: ## Rebuild all service images without cache
	docker-compose build --no-cache

logs: ## Show logs from all services
	docker-compose logs -f

logs-%: ## Show logs from specific service (e.g., make logs-laravel)
	docker-compose logs -f $*

# Laravel backend commands
laravel-bash: ## Access Laravel container shell
	docker-compose exec laravel bash

laravel-install: ## Install Laravel dependencies
	docker-compose exec laravel composer install

laravel-migrate: ## Run Laravel migrations
	docker-compose exec laravel php artisan migrate

laravel-seed: ## Run Laravel seeders
	docker-compose exec laravel php artisan db:seed

laravel-key: ## Generate Laravel application key
	docker-compose exec laravel php artisan key:generate

laravel-cache: ## Clear Laravel caches
	docker-compose exec laravel php artisan cache:clear
	docker-compose exec laravel php artisan config:clear
	docker-compose exec laravel php artisan route:clear
	docker-compose exec laravel php artisan view:clear

# Next.js frontend commands
nextjs-bash: ## Access Next.js container shell
	docker-compose exec nextjs bash

nextjs-install: ## Install Next.js dependencies
	docker-compose exec nextjs npm install

nextjs-build: ## Build Next.js application
	docker-compose exec nextjs npm run build

# Database commands
db-bash: ## Access MySQL container shell
	docker-compose exec mysql bash

db-cli: ## Access MySQL CLI
	docker-compose exec mysql mysql -u ${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE}

db-backup: ## Create database backup
	docker-compose exec mysql mysqldump -u ${DB_USERNAME} -p${DB_PASSWORD} ${DB_DATABASE} > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Redis commands
redis-cli: ## Access Redis CLI
	docker-compose exec redis redis-cli -a ${REDIS_PASSWORD}

# Cleanup commands
clean: ## Remove all containers and volumes
	docker-compose down -v
	docker system prune -f

clean-all: ## Remove everything including images
	docker-compose down -v --rmi all
	docker system prune -a -f

# Testing commands
test-backend: ## Run Laravel tests
	docker-compose exec laravel php artisan test

test-frontend: ## Run Next.js tests
	docker-compose exec nextjs npm test

# Setup commands
setup: ## Initial project setup
	cp env.example .env
	make build
	make up
	@echo "Waiting for services to be ready..."
	@sleep 10
	make laravel-install
	make nextjs-install
	make laravel-key
	make laravel-migrate
	@echo "Setup complete! Access your app at:"
	@echo "- Frontend: http://localhost:3000"
	@echo "- Backend: http://localhost:8000"
	@echo "- MailHog: http://localhost:8025"

# Health check
health: ## Check service health
	@echo "Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "Testing endpoints..."
	@curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3000 || echo "Frontend: unreachable"
	@curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:8000 || echo "Backend: unreachable"
	@curl -s -o /dev/null -w "Health check: %{http_code}\n" http://localhost/health || echo "Health check: unreachable"






