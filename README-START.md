# SoftArt VibeCode - Quick Start Guide

This guide provides the **single recommended way** to start the SoftArt VibeCode AI Tools Management Platform with all necessary setup including Docker containers, database migrations, and seeders.

## 🚀 Quick Start Options

### Option 1: Bash Script (Recommended for Linux/Mac/WSL)
```bash
./start.sh
```

### Option 2: PowerShell Script (Windows)
```powershell
.\start.ps1
```

### Option 3: Batch Script (Windows)
```cmd
.\start.bat
```

---

## 🎯 **What This Script Does**

The start script performs a **complete automated setup** of your SoftArt VibeCode application:

### **🐳 Docker Setup**
- ✅ Stops existing containers to prevent conflicts
- ✅ Removes problematic storage files that cause build issues
- ✅ Clears Docker build cache for clean builds
- ✅ Builds and starts all Docker services with optimized context
- ✅ Verifies all containers are running properly
- ✅ Checks service health and connectivity

### **🗄️ Database Setup** 
- ✅ Waits for MySQL to be fully ready
- ✅ Runs **fresh migrations** (drops all tables and recreates) **GUARANTEED**
- ✅ **Clears authentication data safely** with enhanced error handling
- ✅ **Clears all user sessions** with table existence checks
- ✅ Runs database seeders **GUARANTEED**
- ✅ **Verifies database setup** with migration status check **GUARANTEED**
- ✅ **Verifies tables exist** with database validation **GUARANTEED**

### **🔧 Storage & File System Setup**
- ✅ **Setup storage link** with proper error handling
- ✅ **Create avatar directory** for user profile uploads
- ✅ **Fix storage link conflicts** (handles "already exists" errors)
- ✅ **Optimized file permissions** for upload functionality

### **🔐 Authentication Setup**
- ✅ **Enhanced session clearing** with graceful error handling
- ✅ **Two-phase session cleanup** (before and after database setup)
- ✅ **Session table existence verification** before clearing
- ✅ **Cache clearing** with error resilience
- ✅ **Authentication data reset** with proper fallbacks
- ✅ **Ensures clean login state** with no logged users

### **🎨 Frontend Setup**
- ✅ Checks for missing dependencies
- ✅ Installs npm packages if needed
- ✅ Verifies frontend build process
- ✅ Ensures proper API connectivity
- ✅ **Avatar upload functionality** ready

### **🔧 System Configuration**
- ✅ **CORS configuration** optimized for cross-origin requests
- ✅ **Owner auto-approval system** configured
- ✅ **Custom PHP router** optimized for API performance
- ✅ **Enhanced error handling** throughout the setup process

---

## 📋 Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** available
- **4GB+ RAM** available for containers
- **4GB+ available disk space**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

---

## 🌐 Access Points

After running the start script, you can access:

### **Main Application**
- **🖥️ Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/api/test

### **Development Tools**
- **🐳 Docker Containers**: All running via `docker-compose ps`
- **📊 Database**: MySQL on port 3306
- **🗃️ Cache**: Redis on port 6379

---

## 🔑 **Test User Credentials**

All test users are created automatically by the seeders:

### **👑 Administrative Users**
- **Owner**: `owner@demo.local` / `password` *(Full admin panel access + auto-approval)*
- **Admin**: `ivan@admin.local` / `password` *(Administrative access)*

### **👥 Team Members**
- **Project Manager**: `pm@demo.local` / `password`
- **Developer**: `dev@demo.local` / `password`
- **Designer**: `designer@demo.local` / `password`
- **QA Engineer**: `boris@qa.local` / `password`

---

## 🛠️ **Troubleshooting**

### **Docker Issues**
```bash
# Check Docker status
docker info

# Check container logs
docker-compose logs -f

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Clear Docker cache (build context issues)
docker system prune -f
docker builder prune -f
```

### **Database Issues**
```bash
# Check database connection
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\DB; DB::select('SHOW TABLES');"

# Reset database manually
docker-compose exec backend php artisan migrate:fresh --seed

# Check storage link
docker-compose exec backend php artisan storage:link
```

### **Frontend Issues**
```bash
# Rebuild frontend
docker-compose exec frontend npm install
docker-compose restart frontend

# Check frontend logs
docker-compose logs frontend

# Access frontend container
docker-compose exec frontend bash
```

### **Authentication Issues**
```bash
# Clear all authentication data (enhanced)
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear

# Clear sessions (with table check)
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\Schema; if(Schema::hasTable('sessions')) { DB::table('sessions')->delete(); echo 'Sessions cleared'; }"
```

### **Avatar Upload Issues**
```bash
# Check avatar directory
docker-compose exec backend ls -la storage/app/public/avatars

# Fix storage permissions
docker-compose exec backend chmod -R 755 storage/app/public

# Recreate storage link
docker-compose exec backend php artisan storage:link
```

### **Tool Editing Issues**
```bash
# Restart frontend (form state issues)
docker-compose restart frontend

# Check CORS configuration
docker-compose logs backend | grep -i cors

# Verify long_description field
docker-compose exec backend php artisan tinker --execute="use Illuminate\Support\Facades\Schema; echo Schema::hasColumn('ai_tools', 'long_description') ? 'Field exists' : 'Field missing';"
```

---

## 📊 **Database Information**

### **Connection Details**
- **Host**: localhost:3306
- **Database**: vibecode_db
- **Username**: root
- **Password**: root_password

### **Tables Created**
- `users` - User accounts and profiles
- `roles` - User roles and permissions
- `ai_tools` - AI tools registry (with long_description field)
- `categories` - Tool categories
- `tags` - Tool tags for filtering
- `tool_categories` - Tool-category relationships
- `tool_tags` - Tool-tag relationships
- `tool_roles` - Tool-role permissions
- `sessions` - User sessions
- And other Laravel system tables

---

## 🔄 **Fresh Start Guarantee**

The start script ensures a **completely fresh start** each time:

- ✅ **All database tables are dropped and recreated** **GUARANTEED**
- ✅ **Enhanced authentication data clearing** with error resilience
- ✅ **All user sessions cleared** with proper verification
- ✅ **No user will be logged in** after startup
- ✅ **All seed data is freshly populated** **GUARANTEED**
- ✅ **Cache completely cleared** with fallback handling
- ✅ **Storage link properly configured** with conflict resolution
- ✅ **Avatar system ready** with proper directories
- ✅ **CORS properly configured** for cross-origin requests
- ✅ **Owner auto-approval system enabled**
- ✅ **Laravel structure preserved** (no broken directories)
- ✅ **Database setup verified** (migration status check) **GUARANTEED**
- ✅ **Tables existence verified** (database validation) **GUARANTEED**
- ✅ **Error handling with exit on failure** **GUARANTEED**

This means every time you run the start script, you get a clean slate with no logged users, fresh test data, a working authentication system, verified database integrity, guaranteed success or clear error reporting, and all the latest features ready to use.

---

## 🔄 **Reset Everything**

If you need to completely reset the application:

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images and cache (build context issues)
docker system prune -a
docker builder prune -a

# Start fresh
./start.sh  # or .\start.ps1 on Windows
```

---

## 🛠️ **Useful Commands**

### **Development Workflow**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql

# Access containers
docker-compose exec backend bash
docker-compose exec frontend bash
docker-compose exec mysql mysql -u root -proot_password vibecode_db
```

### **Database Management**
```bash
# Create new migration
docker-compose exec backend php artisan make:migration create_new_table

# Run specific migration
docker-compose exec backend php artisan migrate --path=database/migrations/2023_01_01_000000_create_new_table.php

# Rollback migration
docker-compose exec backend php artisan migrate:rollback

# Fresh start with seeders
docker-compose exec backend php artisan migrate:fresh --seed
```

### **Frontend Development**
```bash
# Install new dependencies
docker-compose exec frontend npm install package-name

# Update dependencies
docker-compose exec frontend npm update

# Build for production
docker-compose exec frontend npm run build
```

### **Avatar Management**
```bash
# Check avatar storage
docker-compose exec backend ls -la storage/app/public/avatars/

# Test avatar upload permissions
docker-compose exec backend touch storage/app/public/avatars/test.txt

# Clean avatar directory
docker-compose exec backend rm -rf storage/app/public/avatars/*
```

---

## 🎯 **Next Steps**

Once the application is running:

### **1. Access the Application**
- Open http://localhost:3000 in your browser
- You should see the login page (no user should be logged in)

### **2. Test Different User Roles**
- **Owner Login**: Use `owner@demo.local` for full admin panel access + auto-approval
- **Other Roles**: Test different user roles and permissions
- **Admin Panel**: Only accessible to users with 'owner' role

### **3. Explore Features**
- **Dashboard**: View tools and statistics
- **Tool Management**: Create, edit, and manage AI tools with "How to use" fields
- **Avatar Upload**: Test user profile picture upload functionality
- **User Management**: Manage users and roles (owner only)
- **Filtering**: Test search and filtering functionality
- **Owner Auto-Approval**: Create tools as owner to see auto-approval in action

### **4. Verify New Features**
- **Avatar Upload**: Upload and display user profile pictures
- **Tool Editor**: Test "How to use" field saving and editing
- **Form State**: Verify no field repopulation when editing
- **CORS**: Test cross-origin requests without errors
- **Owner Auto-Approval**: Create tools as owner and see automatic approval

### **5. Verify Authentication**
- Test login/logout functionality
- Verify role-based access control
- Check session management
- Test API authentication

---

## 📞 **Support & Help**

### **Common Issues & Solutions**

1. **"Port already in use"**: 
   - Stop other services using ports 3000, 8000, 3306
   - Or modify ports in docker-compose.yml

2. **"Authentication not working"**:
   - Run the start script again (enhanced session clearing)
   - Clear browser cookies and localStorage
   - Use the clear-auth.html page

3. **"Admin panel not accessible"**:
   - Ensure you're logged in as `owner@demo.local`
   - Check that the user has the 'owner' role
   - Verify role-based access control is working

4. **"Database connection failed"**:
   - Ensure MySQL container is running
   - Check database credentials
   - Run the start script to reset database

5. **"Avatar upload not working"**:
   - Check storage permissions and directory existence
   - Verify CORS configuration
   - Test with different file formats (JPEG, PNG, GIF, WebP)

6. **"Tool editing issues"**:
   - Restart frontend for form state issues
   - Check long_description field in database
   - Verify CORS configuration for update requests

7. **"Storage link errors"**:
   - Run start script (handles storage link conflicts)
   - Manual fix: `docker-compose exec backend php artisan storage:link`

8. **"Build context issues"**:
   - Run `docker system prune -f` and `docker builder prune -f`
   - Check .dockerignore files in backend/frontend
   - Remove large files from build context

### **Debugging Steps**

1. **Check Docker**: `docker info` and `docker-compose ps`
2. **Check Logs**: `docker-compose logs -f`
3. **Verify Ports**: Ensure 3000, 8000, 3306 are available
4. **Check Resources**: Ensure sufficient disk space and memory
5. **Run Start Script**: Always try this first for most issues
6. **Check Storage**: Verify avatar directory and permissions
7. **Test Features**: Verify avatar upload and tool editing functionality

---

## 🎉 **Success Indicators**

When the start script completes successfully, you should see:

- ✅ "APPLICATION SETUP COMPLETE!" message
- ✅ All containers running (docker-compose ps)
- ✅ Database migrations completed
- ✅ Seed data populated
- ✅ Storage link created successfully
- ✅ Avatar directory ready
- ✅ Sessions cleared (no logged users)
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend API accessible at http://localhost:8000
- ✅ No users logged in (clean state)
- ✅ Test users created and ready for login
- ✅ Avatar upload functionality ready
- ✅ Owner auto-approval system enabled
- ✅ Enhanced error handling throughout

---

## 🆕 **Recent Start Script Improvements**

### **✅ Enhanced Features:**
- **Build Context Optimization**: Resolved Docker build context issues
- **Storage Link Handling**: Fixed "storage link already exists" errors
- **Session Management**: Two-phase session clearing with verification
- **Error Resilience**: Graceful handling of all setup operations
- **Avatar System**: Complete avatar upload and display setup
- **CORS Configuration**: Optimized cross-origin request handling
- **Owner Auto-Approval**: Automatic tool approval for owner users

### **🔧 Technical Improvements:**
- **Docker Cache Clearing**: Prevents build context conflicts
- **Enhanced Error Handling**: All operations have fallback mechanisms
- **Storage Verification**: Proper checks before storage operations
- **Session Table Validation**: Checks existence before clearing sessions
- **Graceful Degradation**: Script continues even if some operations fail

---

**🚀 Happy coding with SoftArt VibeCode!**

*Your AI Tools Management Platform is ready to use with all the latest features!*
