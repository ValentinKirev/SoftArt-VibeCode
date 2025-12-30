# 🤖 SoftArt VibeCode AI Tools Platform

An internal company platform for discovering, sharing, and collaborating on AI tools, libraries, and applications across teams.

## 📋 Overview

This platform allows SoftArt VibeCode team members to:
- **Discover** AI tools shared by colleagues
- **Share** new tools, libraries, and applications they've discovered
- **Collaborate** by rating tools and providing feedback
- **Organize** tools by categories, teams, and tags
- **Access** documentation and resources easily

## 🏗️ Architecture

### Backend (Laravel)
- **Framework**: Laravel 10.x
- **Database**: MySQL 8.0
- **API**: RESTful API with JSON responses
- **Authentication**: Ready for Sanctum (JWT)
- **Caching**: Redis support
- **Features**:
  - CRUD operations for AI tools
  - Advanced filtering and search
  - Rating system
  - Tag-based organization
  - Team-based access

### Frontend (Next.js)
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Features**:
  - Responsive design
  - Real-time search and filtering
  - Tool rating system
  - User-friendly forms
  - Mobile-optimized interface

### Infrastructure (Docker)
- **Laravel Backend**: PHP 8.2 + Composer
- **Next.js Frontend**: Node.js 18 + npm
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Web Server**: Nginx (production-ready)

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM available

### 1. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit with your database credentials (optional - defaults work)
# nano .env
```

### 2. Start Development Environment
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Access the Platform
- **Main Platform**: http://localhost:3000
- **Laravel API**: http://localhost:8000
- **Database**: localhost:3306
- **Redis**: localhost:6379

### 4. Run Database Migrations (Optional)
```bash
# Access Laravel container
docker-compose exec laravel bash

# Run migrations
php artisan migrate

# Seed with sample data (if available)
php artisan db:seed
```

## 📊 Database Schema

### AI Tools Table
```sql
CREATE TABLE ai_tools (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NULL,
  tool_type ENUM('library', 'application', 'framework', 'api', 'service') DEFAULT 'library',
  url VARCHAR(255) NULL,
  documentation_url VARCHAR(255) NULL,
  github_url VARCHAR(255) NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NULL,
  team VARCHAR(100) NULL,
  tags JSON NULL,
  use_case TEXT NULL,
  pros TEXT NULL,
  cons TEXT NULL,
  rating TINYINT DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);
```

## 🔧 API Endpoints

### AI Tools
- `GET /api/ai-tools` - List all tools with filtering
- `POST /api/ai-tools` - Create new tool
- `GET /api/ai-tools/{id}` - Get specific tool
- `PUT /api/ai-tools/{id}` - Update tool
- `DELETE /api/ai-tools/{id}` - Delete tool

### Metadata
- `GET /api/ai-tools-meta/categories` - Get all categories
- `GET /api/ai-tools-meta/teams` - Get all teams
- `GET /api/ai-tools-meta/tags` - Get all tags

### Query Parameters
- `category` - Filter by category
- `type` - Filter by tool type
- `team` - Filter by team
- `tag` - Filter by tag
- `search` - Search in name/description/author
- `sort_by` - Sort field (name, rating, created_at)
- `sort_order` - Sort order (asc, desc)
- `per_page` - Items per page

## 🎨 Features

### Tool Management
- ✅ Add new AI tools with detailed information
- ✅ Edit existing tools
- ✅ Rate tools (1-5 stars)
- ✅ Categorize by type and domain
- ✅ Tag-based organization
- ✅ Team attribution

### Discovery & Search
- ✅ Advanced filtering by category, type, team, tags
- ✅ Full-text search across name, description, author
- ✅ Sort by rating, name, or date
- ✅ Pagination support

### User Experience
- ✅ Responsive design (mobile-friendly)
- ✅ Intuitive navigation
- ✅ Real-time search
- ✅ Loading states and error handling
- ✅ Form validation

### Links & Resources
- ✅ Direct links to tools, documentation, GitHub
- ✅ Pros/cons analysis
- ✅ Use case descriptions
- ✅ Author contact information

## 🛠️ Development Commands

### Docker Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service]

# Access containers
docker-compose exec laravel bash
docker-compose exec nextjs bash
docker-compose exec mysql bash
```

### Laravel Commands
```bash
# Run migrations
docker-compose exec laravel php artisan migrate

# Create new migration
docker-compose exec laravel php artisan make:migration create_example_table

# Create new model
docker-compose exec laravel php artisan make:model Example

# Clear cache
docker-compose exec laravel php artisan cache:clear
```

### Next.js Commands
```bash
# Install dependencies
docker-compose exec nextjs npm install

# Run linting
docker-compose exec nextjs npm run lint

# Build for production
docker-compose exec nextjs npm run build
```

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention (Eloquent ORM)
- XSS protection (React's built-in protection)
- CORS configuration ready
- Rate limiting ready for production
- Authentication framework ready (Laravel Sanctum)

## 📈 Scaling Considerations

### Database Optimization
- Indexes on frequently queried columns (category, team, tool_type)
- Full-text search capabilities
- Connection pooling ready

### Caching Strategy
- Redis for session storage
- API response caching ready
- Database query caching

### Performance
- Pagination for large datasets
- Lazy loading for images
- Optimized bundle size
- CDN-ready static assets

## 🚢 Deployment

### Production Setup
1. Update environment variables for production
2. Configure SSL certificates
3. Set up proper database credentials
4. Configure reverse proxy (Nginx)
5. Enable caching layers
6. Set up monitoring and logging

### Docker Production
```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Use production profiles
docker-compose --profile production up -d
```

## 🤝 Contributing

### Adding New Features
1. Create feature branch from `main`
2. Implement backend API changes
3. Update frontend components
4. Add proper validation
5. Test thoroughly
6. Submit pull request

### Code Standards
- Laravel: PSR-12 standards
- React/TypeScript: ESLint configuration
- Commit messages: Conventional commits
- Documentation: Update README for new features

## 📚 Learning Resources

### Laravel
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Eloquent ORM](https://laravel.com/docs/eloquent)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### AI Tools Categories
- **Machine Learning**: TensorFlow, PyTorch, scikit-learn
- **Natural Language Processing**: spaCy, NLTK, Hugging Face
- **Computer Vision**: OpenCV, Pillow, YOLO
- **Data Science**: Pandas, NumPy, Jupyter
- **APIs**: OpenAI API, Google Cloud AI, AWS AI Services

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker status
docker info

# Clean up and restart
docker system prune -a
docker-compose down -v
docker-compose up -d
```

**Database connection issues:**
```bash
# Check database logs
docker-compose logs mysql

# Verify credentials in .env
cat .env | grep DB_
```

**API connection issues:**
```bash
# Test API endpoint
curl http://localhost:8000/api/ai-tools

# Check Laravel logs
docker-compose logs laravel
```

**Frontend build issues:**
```bash
# Clear Next.js cache
docker-compose exec nextjs rm -rf .next

# Reinstall dependencies
docker-compose exec nextjs npm install
```

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review Docker and service logs
3. Check the GitHub repository for known issues
4. Contact the development team

---

**Built with ❤️ by SoftArt VibeCode Team**

*Empowering collaboration through AI tool discovery and sharing.*
