# Quick Reference Card - Financial Health Dashboard Backend

## 🚀 Quick Start Commands

```powershell
# Navigate to project
cd "H:\MCA ALL PROJECT\AI-Assisted Personal Financial Health Dashboard\backend"

# Build and run
mvn clean install
mvn spring-boot:run

# Or use Docker
docker-compose up --build

# Or use script
.\start.ps1
```

## 🔗 Important URLs

| Resource     | URL                                   |
| ------------ | ------------------------------------- |
| Application  | http://localhost:8080                 |
| Swagger UI   | http://localhost:8080/swagger-ui.html |
| API Docs     | http://localhost:8080/api-docs        |
| Health Check | http://localhost:8080/api/health      |
| Info         | http://localhost:8080/api/info        |

## 🔑 Default Credentials

| Field          | Value            |
| -------------- | ---------------- |
| MySQL Username | root             |
| MySQL Password | hasanali7623     |
| Database Name  | finance_db       |
| Demo Email     | demo@example.com |
| Demo Password  | password123      |

## 📡 API Endpoints Summary

### Authentication (No Auth Required)

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
POST /api/auth/refresh      - Refresh token
```

### Transactions (Auth Required)

```
GET    /api/transactions              - Get all
POST   /api/transactions              - Create
GET    /api/transactions/{id}         - Get by ID
PUT    /api/transactions/{id}         - Update
DELETE /api/transactions/{id}         - Delete
GET    /api/transactions/filter       - Filter
```

### Budgets (Auth Required)

```
GET  /api/budgets           - Get all
POST /api/budgets           - Create
GET  /api/budgets/{id}      - Get by ID
GET  /api/budgets/period    - Get by month/year
```

### Savings Goals (Auth Required)

```
GET    /api/goals                    - Get all
POST   /api/goals                    - Create
GET    /api/goals/{id}               - Get by ID
PUT    /api/goals/{id}               - Update
DELETE /api/goals/{id}               - Delete
POST   /api/goals/{id}/contribute    - Add contribution
```

### Analytics & AI (Auth Required)

```
POST /api/ml/advice                   - Get AI advice
GET  /api/currency/convert            - Convert currency
GET  /api/currency/rates              - Get exchange rates
POST /api/analytics/spending-pattern  - Analyze pattern
```

### OCR (Auth Required)

```
POST /api/integrations/ocr/parse     - Upload receipt
```

## 🔐 Authentication Flow

1. **Register**: POST `/api/auth/register`

   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**: POST `/api/auth/login`

   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Use Token**: Add to headers
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```

## 📊 Sample Request Bodies

### Create Transaction

```json
{
  "amount": 50.0,
  "category": "Food",
  "type": "EXPENSE",
  "transactionDate": "2025-11-18",
  "description": "Grocery shopping",
  "merchant": "Walmart"
}
```

### Create Budget

```json
{
  "category": "Food",
  "amount": 500.0,
  "month": 11,
  "year": 2025,
  "alertThreshold": 450.0
}
```

### Create Savings Goal

```json
{
  "name": "Emergency Fund",
  "targetAmount": 10000.0,
  "currentAmount": 1000.0,
  "targetDate": "2026-12-31",
  "description": "6 months expenses"
}
```

### Get Financial Advice

```json
{
  "query": "How can I save money?",
  "context": "I spend $500 on food monthly"
}
```

## 🛠️ Common Maven Commands

```powershell
mvn clean                    # Clean build artifacts
mvn compile                  # Compile source code
mvn test                     # Run tests
mvn package                  # Create JAR file
mvn clean install            # Full build
mvn spring-boot:run          # Run application
mvn clean install -DskipTests # Build without tests
```

## 🐳 Docker Commands

```powershell
docker-compose up              # Start services
docker-compose up -d           # Start in background
docker-compose down            # Stop services
docker-compose logs -f         # View logs
docker-compose ps              # List containers
docker-compose restart         # Restart services
```

## 🗄️ Database Quick Commands

```sql
-- Show databases
SHOW DATABASES;

-- Use database
USE finance_db;

-- Show tables
SHOW TABLES;

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM transactions;
SELECT COUNT(*) FROM budgets;

-- View sample data
SELECT * FROM users LIMIT 5;
SELECT * FROM transactions LIMIT 5;

-- Drop and recreate (CAUTION!)
DROP DATABASE finance_db;
CREATE DATABASE finance_db;
```

## 🔧 Configuration Properties

### Database

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=hasanali7623
```

### JWT

```properties
jwt.secret=yourSuperSecretKey
jwt.expiration=86400000        # 24 hours
jwt.refresh.expiration=604800000 # 7 days
```

### External APIs

```properties
ocr.space.api.key=your_key
huggingface.api.key=your_key
frankfurter.base.url=https://api.frankfurter.app
```

## 🐛 Quick Troubleshooting

| Problem                 | Solution                                  |
| ----------------------- | ----------------------------------------- |
| Port 8080 in use        | `taskkill /F /IM java.exe` or change port |
| MySQL connection failed | `net start MySQL80`                       |
| Build failed            | `mvn clean install -U`                    |
| JWT token expired       | Login again                               |
| OCR not working         | Check API key and internet                |

## 📁 Project Structure

```
backend/
├── src/main/java/com/finance/
│   ├── controller/      # REST endpoints
│   ├── service/         # Business logic
│   ├── repository/      # Database access
│   ├── entity/          # JPA entities
│   ├── dto/             # Data transfer objects
│   ├── security/        # JWT & auth
│   ├── config/          # Configuration
│   └── exception/       # Error handling
├── database/            # SQL scripts
├── docker-compose.yml   # Docker config
├── pom.xml             # Maven dependencies
└── README.md           # Documentation
```

## 🎯 Categories List

Common expense categories:

- Food
- Travel
- Rent
- Entertainment
- Shopping
- Healthcare
- Utilities
- Education
- Transport
- Insurance

## 📞 Get Help

| Resource           | Location                              |
| ------------------ | ------------------------------------- |
| Full Documentation | README.md                             |
| Setup Guide        | SETUP_GUIDE.md                        |
| API Examples       | API_EXAMPLES.md                       |
| Project Summary    | PROJECT_SUMMARY.md                    |
| Swagger UI         | http://localhost:8080/swagger-ui.html |

## ✅ Pre-Flight Checklist

Before starting:

- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] MySQL 8.0+ running
- [ ] Database created (finance_db)
- [ ] API keys configured
- [ ] JWT secret set
- [ ] Port 8080 available

## 🚀 Production Checklist

Before deployment:

- [ ] Change default passwords
- [ ] Update JWT secret
- [ ] Configure production DB
- [ ] Set up HTTPS
- [ ] Enable logging
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Security audit

---

**Version**: 1.0.0  
**Last Updated**: November 18, 2025  
**Status**: Production Ready ✅
