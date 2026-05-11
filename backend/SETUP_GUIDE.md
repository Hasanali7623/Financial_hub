# Complete Setup Guide - Financial Health Dashboard Backend

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Database Setup](#database-setup)
3. [API Keys Configuration](#api-keys-configuration)
4. [Application Setup](#application-setup)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## System Requirements

### Required Software

- **Java Development Kit (JDK)**: Version 17 or higher
- **Apache Maven**: Version 3.6 or higher
- **MySQL Server**: Version 8.0 or higher
- **Git**: For version control (optional)
- **Docker Desktop**: For containerized deployment (optional)
- **Postman/Insomnia**: For API testing (optional)

### Verify Installations

```powershell
# Check Java version
java -version
# Should show: java version "17" or higher

# Check Maven version
mvn -version
# Should show: Apache Maven 3.6 or higher

# Check MySQL version
mysql --version
# Should show: MySQL 8.0 or higher

# Check Docker (if using)
docker --version
docker-compose --version
```

## Database Setup

### Step 1: Start MySQL Server

**Option A: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Password: `hasanali7623`

**Option B: Using Command Line**

```powershell
# Start MySQL service
net start MySQL80

# Login to MySQL
mysql -u root -p
# Enter password: hasanali7623
```

### Step 2: Create Database

**Method 1: Using SQL Script (Recommended)**

```powershell
# Navigate to backend directory
cd "H:\MCA ALL PROJECT\AI-Assisted Personal Financial Health Dashboard\backend"

# Run the initialization script
mysql -u root -p < database/init.sql
# Enter password: hasanali7623
```

**Method 2: Manual Creation**

```sql
-- Login to MySQL and run:
CREATE DATABASE finance_db;
USE finance_db;
```

### Step 3: Verify Database

```sql
-- Check if database exists
SHOW DATABASES;

-- Use the database
USE finance_db;

-- Show tables (after running app or init.sql)
SHOW TABLES;
```

## API Keys Configuration

### Step 1: Get OCR.Space API Key

1. Visit: https://ocr.space/ocrapi
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier: 25,000 requests/month

### Step 2: Get HuggingFace API Token

1. Visit: https://huggingface.co/
2. Create an account or login
3. Go to Settings → Access Tokens
4. Create a new token
5. Copy the token

### Step 3: Generate JWT Secret

```powershell
# Generate a secure random string (at least 256 bits)
# You can use online tools or PowerShell:
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() * 4))
```

### Step 4: Update Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database (already configured)
spring.datasource.password=hasanali7623

# API Keys (REPLACE THESE!)
ocr.space.api.key=YOUR_ACTUAL_OCR_KEY_HERE
huggingface.api.key=YOUR_ACTUAL_HF_TOKEN_HERE

# JWT Secret (REPLACE THIS!)
jwt.secret=YOUR_GENERATED_SECRET_HERE
```

## Application Setup

### Step 1: Navigate to Project

```powershell
cd "H:\MCA ALL PROJECT\AI-Assisted Personal Financial Health Dashboard\backend"
```

### Step 2: Build the Project

```powershell
# Clean and build
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests
```

This will:

- Download all dependencies
- Compile the code
- Create JAR file in `target/` directory
- Run tests (unless skipped)

### Step 3: Verify Build

Check for successful build message:

```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

## Running the Application

### Method 1: Using Maven (Development)

```powershell
mvn spring-boot:run
```

### Method 2: Using JAR File

```powershell
java -jar target/financial-health-dashboard-1.0.0.jar
```

### Method 3: Using PowerShell Script

```powershell
.\start.ps1
# Choose option 1 for Maven build and run
```

### Method 4: Using Docker Compose (Full Stack)

```powershell
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Verify Application is Running

1. **Console Output**: Look for:

   ```
   Started FinancialHealthDashboardApplication in X.XXX seconds
   ```

2. **Health Check**:

   ```powershell
   curl http://localhost:8080/api/health
   ```

3. **Swagger UI**: Open browser to:
   ```
   http://localhost:8080/swagger-ui.html
   ```

## Testing

### Step 1: Access Swagger UI

1. Open browser: `http://localhost:8080/swagger-ui.html`
2. You'll see all available endpoints

### Step 2: Register a User

1. Find "Authentication" section
2. Click on "POST /api/auth/register"
3. Click "Try it out"
4. Enter:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
5. Click "Execute"
6. Copy the `accessToken` from response

### Step 3: Test Protected Endpoints

1. Click "Authorize" button at top
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"
4. Now you can test all endpoints

### Step 4: Test Transaction Creation

```json
POST /api/transactions
{
  "amount": 100.00,
  "category": "Food",
  "type": "EXPENSE",
  "transactionDate": "2025-11-18",
  "description": "Grocery shopping"
}
```

### Step 5: Test Budget Creation

```json
POST /api/budgets
{
  "category": "Food",
  "amount": 500.00,
  "month": 11,
  "year": 2025
}
```

## Troubleshooting

### Issue 1: Database Connection Failed

**Error**: `Could not open JDBC Connection`

**Solution**:

```powershell
# Check MySQL is running
net start MySQL80

# Verify credentials in application.properties
# spring.datasource.password=hasanali7623
```

### Issue 2: Port 8080 Already in Use

**Error**: `Port 8080 is already in use`

**Solution**:

```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in application.properties
# server.port=8081
```

### Issue 3: Maven Build Failed

**Error**: `Failed to execute goal`

**Solution**:

```powershell
# Clean Maven cache
mvn clean

# Delete .m2 repository (if needed)
# rm -r ~/.m2/repository

# Rebuild
mvn clean install -U
```

### Issue 4: OCR API Not Working

**Error**: `OCR processing failed`

**Solution**:

1. Verify API key is correct
2. Check internet connection
3. Verify OCR.Space service status
4. Check API usage limits

### Issue 5: JWT Token Invalid

**Error**: `Invalid JWT token`

**Solution**:

1. Generate new JWT secret (at least 256 bits)
2. Update `jwt.secret` in application.properties
3. Restart application
4. Login again to get new token

### Issue 6: Swagger UI Not Loading

**Error**: `Whitelabel Error Page`

**Solution**:

1. Verify application is running
2. Check URL: `http://localhost:8080/swagger-ui.html`
3. Clear browser cache
4. Try: `http://localhost:8080/swagger-ui/index.html`

## Advanced Configuration

### Enable Email Notifications (Optional)

1. Get Mailgun API key
2. Update application.properties:
   ```properties
   mailgun.api.key=your_mailgun_key
   mailgun.domain=your_domain
   ```

### Enable Debug Logging

```properties
logging.level.com.finance=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Configure External Database

For production, use external MySQL:

```properties
spring.datasource.url=jdbc:mysql://your-server:3306/finance_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Performance Tuning

```properties
# Connection pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# JPA optimizations
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
```

## Production Deployment Checklist

- [ ] Change JWT secret to strong random value
- [ ] Update database credentials
- [ ] Configure external API keys
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Enable monitoring
- [ ] Set up CI/CD pipeline
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up error tracking
- [ ] Configure CORS for production domains

## Getting Help

### Resources

- README.md - Complete documentation
- API_EXAMPLES.md - API testing examples
- PROJECT_SUMMARY.md - Project overview
- Swagger UI - Interactive API docs

### Common Commands

```powershell
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Package for production
mvn clean package -DskipTests

# Run with Docker
docker-compose up --build

# View logs
docker-compose logs -f backend
```

## Success Criteria

You know everything is working when:

1. ✅ Application starts without errors
2. ✅ Swagger UI loads at http://localhost:8080/swagger-ui.html
3. ✅ You can register a new user
4. ✅ You can login and receive JWT token
5. ✅ You can create transactions with the token
6. ✅ Database tables are created and accessible
7. ✅ Health endpoint returns "UP" status

## Next Steps

After successful setup:

1. Review API documentation in Swagger
2. Test all endpoints using provided examples
3. Integrate with frontend application
4. Customize categories and settings
5. Add sample data for testing
6. Configure production environment

---

**Setup Complete! 🎉**

Your Financial Health Dashboard backend is now ready to use!
