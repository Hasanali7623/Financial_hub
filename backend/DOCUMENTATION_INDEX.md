# 📚 Documentation Index

Welcome to the Financial Health Dashboard Backend documentation! This index will help you find the information you need quickly.

## 🎯 Getting Started

### New Users Start Here

1. **[README.md](README.md)** - Main documentation with complete overview
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step setup instructions
3. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and references

### Quick Start Path

```
1. Read SETUP_GUIDE.md
2. Install prerequisites
3. Run: mvn clean install
4. Run: mvn spring-boot:run
5. Open: http://localhost:8080/swagger-ui.html
6. Test using API_EXAMPLES.md
```

## 📖 Documentation Files

### Core Documentation

| Document               | Purpose                                              | When to Use                        |
| ---------------------- | ---------------------------------------------------- | ---------------------------------- |
| **README.md**          | Complete project overview, features, and basic setup | First-time users, overview needed  |
| **SETUP_GUIDE.md**     | Detailed step-by-step setup instructions             | Setting up development environment |
| **QUICK_REFERENCE.md** | Commands, endpoints, and quick tips                  | Daily development, quick lookups   |
| **PROJECT_SUMMARY.md** | Technical overview, architecture, features           | Understanding project structure    |
| **API_EXAMPLES.md**    | Sample API requests and responses                    | Testing APIs, integration work     |

### Additional Resources

| Document              | Purpose                        |
| --------------------- | ------------------------------ |
| **CHANGELOG.md**      | Version history and updates    |
| **.env.example**      | Environment variables template |
| **database/init.sql** | Database initialization script |
| **start.ps1**         | PowerShell startup script      |

## 🗂️ Documentation by Topic

### Installation & Setup

- [System Requirements](SETUP_GUIDE.md#system-requirements)
- [Database Setup](SETUP_GUIDE.md#database-setup)
- [API Keys Configuration](SETUP_GUIDE.md#api-keys-configuration)
- [Application Setup](SETUP_GUIDE.md#application-setup)
- [Docker Setup](README.md#using-docker)

### Development

- [Project Structure](PROJECT_SUMMARY.md#project-structure)
- [Technology Stack](PROJECT_SUMMARY.md#technology-stack)
- [API Endpoints](PROJECT_SUMMARY.md#api-endpoints)
- [Database Schema](README.md#database-schema)
- [Running Tests](README.md#development)

### API Documentation

- [Authentication Flow](QUICK_REFERENCE.md#authentication-flow)
- [Request Examples](API_EXAMPLES.md)
- [Swagger UI](http://localhost:8080/swagger-ui.html) (when running)
- [Endpoint Reference](QUICK_REFERENCE.md#api-endpoints-summary)

### Configuration

- [Application Properties](README.md#environment-variables)
- [Database Configuration](SETUP_GUIDE.md#database-setup)
- [External APIs](PROJECT_SUMMARY.md#external-api-integrations)
- [Security Settings](README.md#security-features)

### Troubleshooting

- [Common Issues](SETUP_GUIDE.md#troubleshooting)
- [Quick Fixes](QUICK_REFERENCE.md#quick-troubleshooting)
- [Database Issues](SETUP_GUIDE.md#issue-1-database-connection-failed)
- [Build Problems](SETUP_GUIDE.md#issue-3-maven-build-failed)

### Deployment

- [Docker Deployment](README.md#using-docker)
- [Production Checklist](QUICK_REFERENCE.md#production-checklist)
- [Environment Variables](README.md#environment-variables)

## 🎓 Learning Paths

### Path 1: Quick Start (15 minutes)

1. Read QUICK_REFERENCE.md
2. Run start.ps1
3. Test with Swagger UI
4. Try API_EXAMPLES.md samples

### Path 2: Full Setup (1 hour)

1. Read README.md overview
2. Follow SETUP_GUIDE.md step-by-step
3. Configure API keys
4. Test all endpoints
5. Review PROJECT_SUMMARY.md

### Path 3: Development (2+ hours)

1. Complete Full Setup path
2. Study PROJECT_SUMMARY.md architecture
3. Review source code structure
4. Explore database schema
5. Customize and extend features

## 📋 Cheat Sheets

### Quick Commands

See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#quick-start-commands)

### API Endpoints

See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#api-endpoints-summary)

### Database Queries

See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#database-quick-commands)

### Docker Commands

See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md#docker-commands)

## 🔍 Find Information By...

### ...Feature

- **Authentication**: README.md, API_EXAMPLES.md
- **Transactions**: README.md, API_EXAMPLES.md
- **Budgets**: README.md, API_EXAMPLES.md
- **Savings Goals**: README.md, API_EXAMPLES.md
- **OCR Integration**: README.md, PROJECT_SUMMARY.md
- **AI Features**: README.md, PROJECT_SUMMARY.md

### ...Technology

- **Spring Boot**: PROJECT_SUMMARY.md
- **MySQL**: database/init.sql, SETUP_GUIDE.md
- **JWT**: README.md, PROJECT_SUMMARY.md
- **Docker**: docker-compose.yml, README.md
- **Swagger**: README.md, QUICK_REFERENCE.md

### ...Task

- **Setting up project**: SETUP_GUIDE.md
- **Testing APIs**: API_EXAMPLES.md, Swagger UI
- **Deploying**: README.md, Docker section
- **Troubleshooting**: SETUP_GUIDE.md
- **Understanding code**: PROJECT_SUMMARY.md

## 📊 Documentation Stats

- **Total Documentation Files**: 11
- **Total Code Files**: 50+
- **API Endpoints**: 24
- **Database Tables**: 5
- **External Integrations**: 3

## 🎯 Common Use Cases

### "I want to get started quickly"

→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) + [start.ps1](start.ps1)

### "I need detailed setup instructions"

→ [SETUP_GUIDE.md](SETUP_GUIDE.md)

### "I want to test the API"

→ [API_EXAMPLES.md](API_EXAMPLES.md) + Swagger UI

### "I need to understand the architecture"

→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### "Something is not working"

→ [SETUP_GUIDE.md#troubleshooting](SETUP_GUIDE.md#troubleshooting)

### "I want to deploy to production"

→ [README.md#deployment](README.md#deployment-options)

## 🆘 Getting Help

### Step 1: Check Documentation

- Search this index for your topic
- Check QUICK_REFERENCE.md for quick answers
- Review SETUP_GUIDE.md troubleshooting section

### Step 2: Check Logs

- Application logs in console
- MySQL logs
- Docker logs: `docker-compose logs -f`

### Step 3: Verify Configuration

- Check application.properties
- Verify API keys
- Check database connection

### Step 4: Test Components

- Health check: http://localhost:8080/api/health
- Database connection
- API endpoints in Swagger

## 📝 Documentation Updates

This documentation is actively maintained. Last update: **November 18, 2025**

To suggest improvements or report issues:

1. Review existing documentation
2. Create detailed issue description
3. Submit through project repository

## 🎉 Success Stories

After reading the docs, you should be able to:

- ✅ Set up the project in under 30 minutes
- ✅ Understand the complete architecture
- ✅ Test all API endpoints
- ✅ Deploy using Docker
- ✅ Troubleshoot common issues
- ✅ Extend the application with new features

## 🚀 Next Steps

After reading the documentation:

1. Set up your development environment
2. Run the application
3. Test the APIs
4. Integrate with a frontend
5. Deploy to production

---

## Quick Navigation

| What You Need   | Go To                                    |
| --------------- | ---------------------------------------- |
| 🏁 Quick Start  | [start.ps1](start.ps1)                   |
| 📖 Full Guide   | [SETUP_GUIDE.md](SETUP_GUIDE.md)         |
| 🔍 Quick Ref    | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| 🧪 API Tests    | [API_EXAMPLES.md](API_EXAMPLES.md)       |
| 🏗️ Architecture | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| 📊 Swagger UI   | http://localhost:8080/swagger-ui.html    |

---

**Happy Coding! 🎯**

_Financial Health Dashboard Backend v1.0.0_
