# Changelog

All notable changes to the Financial Health Dashboard Backend will be documented in this file.

## [1.0.0] - 2025-11-18

### Added

- Initial release of Financial Health Dashboard Backend
- JWT-based authentication system with token refresh
- User registration and login functionality
- Complete transaction management (CRUD operations)
- Budget tracking with monthly allocations
- Savings goals with progress tracking
- OCR integration for receipt parsing (OCR.Space API)
- Currency conversion using Frankfurter API
- AI-powered financial advice using HuggingFace API
- Swagger/OpenAPI documentation
- Docker and Docker Compose support
- MySQL database with complete schema
- Global exception handling
- Request/Response DTOs
- Input validation with Jakarta Bean Validation
- CORS configuration for frontend integration
- Sample data initialization script
- Comprehensive README and documentation
- API testing examples
- PowerShell startup script

### Security Features

- BCrypt password hashing
- JWT token generation and validation
- Refresh token mechanism
- Spring Security configuration
- API key protection via environment variables
- Role-based access control

### API Endpoints

- 3 Authentication endpoints
- 6 Transaction endpoints
- 4 Budget endpoints
- 6 Savings Goal endpoints
- 1 OCR endpoint
- 4 Analytics endpoints

### Database

- 5 main tables (users, transactions, budgets, savings_goals, ocr_logs)
- 3 analytical views
- Foreign key relationships
- Proper indexing for performance
- Sample data for testing

### External Integrations

- OCR.Space API for receipt parsing
- Frankfurter API for currency conversion
- HuggingFace API for AI financial advice

### Documentation

- Complete README with setup instructions
- API examples in API_EXAMPLES.md
- Project summary in PROJECT_SUMMARY.md
- Database initialization script
- Environment variable examples

### Configuration

- application.properties with all settings
- Docker Compose configuration
- Dockerfile for containerization
- .gitignore for version control
- Maven POM with all dependencies

## [Unreleased]

### Planned Features

- Email notifications via Mailgun/Brevo
- Advanced analytics dashboard
- Recurring transaction automation
- Export reports (PDF/CSV)
- Mobile app integration
- Advanced AI recommendations
- Budget alerts and notifications
- Multi-user support with family accounts
- Investment tracking
- Bill reminders
- Custom category creation
- Data import/export features
- Scheduled reports

### Planned Improvements

- Unit and integration tests
- Performance optimization
- Caching layer (Redis)
- Rate limiting
- Enhanced logging
- Metrics and monitoring
- API versioning
- GraphQL support
- WebSocket for real-time updates
- Advanced security features
- Multi-language support
- Dark mode support (for frontend)

---

## Version History

- **1.0.0** - Initial release with core features
- More versions to come...

## Notes

This project follows [Semantic Versioning](https://semver.org/).

Format based on [Keep a Changelog](https://keepachangelog.com/).
