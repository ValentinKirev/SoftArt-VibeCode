# SoftArt VibeCode - AI Tools Management Platform

A comprehensive Docker-based full-stack application for managing AI tools with role-based access control, authentication, and a modern React interface.

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
- ✅ Admin panel access control working
- ✅ Avatar upload system configured
- ✅ Owner auto-approval system enabled
- ✅ CORS properly configured
- ✅ Session management optimized

**⚡ After running the start script, your application will be ready at:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

---

## 🎯 **Project Overview**

SoftArt VibeCode is an AI tools management platform featuring:

- **🔐 Role-Based Access Control** - Owner, Admin, Developer, Designer, QA roles
- **🛠️ AI Tools Management** - Create, edit, approve, and manage AI tools
- **📊 Dashboard Analytics** - Tool statistics, status tracking, pending approvals
- **🎨 Modern UI** - React with TypeScript, responsive design, real-time updates
- **🔍 Advanced Filtering** - Search by name, category, tags, roles, status
- **✅ Approval Workflow** - Tool approval system with owner auto-approval
- **📱 Mobile Responsive** - Works seamlessly on all devices
- **👤 Avatar Management** - User avatar upload and display system
- **🔧 Enhanced Tool Editor** - Improved form handling and data persistence
- **🌐 CORS Optimized** - Proper cross-origin request handling

---

## Architecture

- **Backend**: Laravel 10 (PHP 8.2) - API, authentication, business logic
- **Frontend**: Next.js 14 with React 18 and TypeScript - Modern UI
- **Database**: MySQL 8.0 - Data persistence with proper relationships
- **Cache**: Redis 7 - Session management and caching
- **Authentication**: Laravel Breeze with cookie-based sessions
- **UI Framework**: Custom components with Tailwind CSS styling
- **Custom Router**: Optimized PHP router for enhanced API performance

---

## 🌐 **Key Features**

### **Authentication & Authorization**
- Laravel Breeze authentication system
- Role-based access control (RBAC)
- Cookie-based sessions with CSRF protection
- Secure API endpoints with middleware
- Enhanced session management and cleanup

### **Admin Panel (Owner Access Only)**
- Complete tools management interface
- Approval workflow for new tools
- **Owner Auto-Approval**: Tools created by owners are automatically approved
- User management and role assignment
- System statistics and analytics
- Advanced filtering and pagination
- **Enhanced Tool Editor**: Improved form handling with proper data persistence

### **User Dashboard**
- Personal tool recommendations
- Tool browsing and searching
- **Profile Management**: Avatar upload and display
- Activity tracking

### **Tool Management**
- Create and edit AI tools with detailed information
- **"How to Use" Field**: Properly saved and displayed long descriptions
- Category and tag organization
- Status management (active, beta, inactive)
- Documentation and examples
- API integration support
- **Enhanced Form Handling**: No more field repopulation issues

### **Avatar System**
- **User Avatar Upload**: Drag-and-drop or click-to-upload functionality
- **File Validation**: JPEG, PNG, GIF, WebP support with size limits
- **Secure Storage**: Proper file storage and serving
- **Real-time Display**: Immediate avatar updates in UI

---

## Prerequisites

- Docker Desktop installed and running
- Docker Compose
- At least 4GB RAM available for containers
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

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
- **API Documentation**: http://localhost:8000/api/test

**🔑 Test User Credentials:**
- **Admin**: ivan@admin.local / password
- **Owner**: owner@demo.local / password (Full admin panel access, auto-approval)
- **Project Manager**: pm@demo.local / password
- **Developer**: dev@demo.local / password
- **Designer**: designer@demo.local / password
- **QA Engineer**: boris@qa.local / password

---

## 📁 **Project Structure**

```
.
├── docker-compose.yml          # Docker services configuration
├── backend/                    # Laravel application
│   ├── app/                    # Application logic
│   ├── database/              # Migrations and seeders
│   ├── routes/                # API routes
│   ├── public/index.php       # Custom PHP router
│   └── Dockerfile
├── frontend/                   # Next.js application
│   ├── components/            # React components
│   ├── pages/                 # Next.js pages
│   ├── hooks/                 # Custom React hooks
│   ├── contexts/              # React contexts
│   └── Dockerfile
├── docker/                    # Docker configurations
├── ssl/                       # SSL certificates (optional)
├── start.sh                   # Automated setup script
├── README.md                  # This file
├── README-START.md           # Start script guide
└── env.example                # Environment variables template
```

---

## 🛠️ **Development Workflow**

### Starting Services

```bash
# Development mode (with hot reload)
docker-compose up -d

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Working with Individual Services

```bash
# Laravel backend
docker-compose exec backend bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan tinker

# Next.js frontend
docker-compose exec frontend bash
docker-compose exec frontend npm install
docker-compose exec frontend npm run build
```

### Database Operations

```bash
# Create backup
docker-compose exec mysql mysqldump -u root -proot_password vibecode_db > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u root -proot_password vibecode_db < backup.sql

# Access MySQL CLI
docker-compose exec mysql mysql -u root -proot_password vibecode_db
```

---

## 🔧 **Environment Configuration**

Key environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_KEY` | Laravel application key | Auto-generated |
| `DB_DATABASE` | MySQL database name | `vibecode_db` |
| `DB_USERNAME` | MySQL user | `vibecode_user` |
| `DB_PASSWORD` | MySQL password | `secure_password` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `root_password` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🚀 **Deployment Notes**

### Production Considerations

1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use production MySQL credentials
3. **SSL**: Configure HTTPS with SSL certificates
4. **Performance**: Enable Redis caching and optimization
5. **Security**: Update all default passwords and keys

### Docker Production

```bash
# Production mode
docker-compose -f docker-compose.yml --profile production up -d

# With SSL
docker-compose -f docker-compose.yml --profile ssl up -d
```

---

## 🐛 **Troubleshooting**

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
- Admin panel access issues
- Avatar upload configuration
- CORS configuration issues
- Storage link problems

### Common Issues

1. **Port conflicts**: 
   - Frontend uses port 3000 (external) / 3001 (internal)
   - Backend uses port 8000
   - MySQL uses port 3306

2. **Authentication problems**: 
   - Run start script to clear sessions
   - Clear browser cookies and localStorage
   - Use `clear-auth.html` for complete reset

3. **Admin panel access**: 
   - Only users with 'owner' role can access admin panel
   - Use owner@demo.local / password for full access

4. **Database connection**: 
   - Ensure MySQL container is running
   - Check database credentials in .env
   - Run migrations: `docker-compose exec backend php artisan migrate:fresh`

5. **Frontend build errors**: 
   - Install dependencies: `docker-compose exec frontend npm install`
   - Restart frontend: `docker-compose restart frontend`

6. **Avatar upload issues**: 
   - Check storage permissions: `docker-compose exec backend ls -la storage/app/public/avatars`
   - Verify CORS configuration
   - Check file size limits (max 5MB)

7. **Tool editing issues**: 
   - "How to use" field not saving: Check long_description field mapping
   - Field repopulation: Form state management issue - restart frontend
   - CORS errors on update: Check credentials mode in fetch requests

8. **Storage link errors**: 
   - Run start script to fix storage link issues
   - Manual fix: `docker-compose exec backend php artisan storage:link`

### Reset Environment

```bash
# Stop and remove all containers, volumes
docker-compose down -v

# Rebuild all images
docker-compose build --no-cache

# Start fresh
./start.sh
```

---

## 📊 **Application Features**

### **Role-Based Access Control**
- **Owner**: Full admin panel access, tool approval, user management, auto-approval for created tools
- **Admin**: Tool management, basic user operations
- **Project Manager**: Project oversight, tool coordination
- **Developer**: Tool development, technical access
- **Designer**: UI/UX tool access, design resources
- **QA Engineer**: Testing tools, quality assurance access

### **Tool Management**
- Create and edit AI tools with detailed information
- **"How to Use" Instructions**: Properly saved and displayed long descriptions
- Categorize tools by type and purpose
- Tag tools for better discoverability
- Set tool status (active, beta, inactive)
- **Owner Auto-Approval**: Tools created by owners are automatically approved
- Approval workflow for quality control
- **Enhanced Form Handling**: No field repopulation issues

### **Dashboard Analytics**
- Tool usage statistics
- User activity tracking
- System performance metrics
- Pending approval notifications

### **Avatar Management**
- **Upload System**: Drag-and-drop or click-to-upload
- **File Validation**: JPEG, PNG, GIF, WebP support
- **Size Limits**: Maximum 5MB file size
- **Secure Storage**: Proper file handling and serving
- **Real-time Updates**: Immediate UI reflection

---

## 🤝 **Contributing**

1. Make changes to the codebase
2. Test with `docker-compose up -d`
3. Ensure all services start correctly
4. Run the start script to verify setup
5. Update documentation as needed
6. Test all user roles and permissions
7. Verify avatar upload functionality
8. Test tool creation and editing features

---

## 📄 **License**

This project is part of the SoftArt VibeCode platform.

---

## 🎯 **Getting Help**

- **Documentation**: Check README-START.md for detailed setup
- **Issues**: Run the start script first for most problems
- **Logs**: Use `docker-compose logs -f` to debug
- **Database**: Access via `docker-compose exec mysql mysql -u root -proot_password vibecode_db`
- **Avatar Issues**: Check storage permissions and CORS configuration
- **Tool Editing**: Verify long_description field mapping and form state management

---

## 🆕 **Recent Updates & Fixes**

### **✅ Latest Improvements:**
- **Avatar Upload System**: Complete upload and display functionality
- **Owner Auto-Approval**: Tools created by owners automatically approved
- **Enhanced Tool Editor**: Fixed field repopulation issues
- **CORS Optimization**: Proper cross-origin request handling
- **Session Management**: Improved session clearing and cleanup
- **Storage Link Fix**: Resolved "storage link already exists" errors
- **Form State Management**: Better handling of tool editing forms
- **Long Description Field**: Proper saving and display of "How to use" content

### **🔧 Technical Improvements:**
- **Custom PHP Router**: Optimized API request handling
- **Enhanced Error Handling**: Better error messages and logging
- **Docker Optimization**: Improved build context and caching
- **TypeScript Interface Updates**: Added missing field definitions
- **Authentication Flow**: Improved token handling and validation

---

**🚀 Ready to build amazing AI tools management with SoftArt VibeCode!**






