# AI-Assisted Personal Financial Health Dashboard - Backend

A comprehensive Spring Boot backend for managing personal finances with AI-powered features, OCR receipt parsing, currency conversion, and intelligent financial advice.

## Features

### Core Functionality

- 🔐 **JWT Authentication** - Secure user registration and login
- 💰 **Transaction Management** - Track income and expenses
- 📊 **Budget Tracking** - Set and monitor monthly budgets
- 🎯 **Savings Goals** - Create and track financial goals
- 📷 **OCR Receipt Parsing** - Automatic expense extraction from receipts
- 💱 **Currency Conversion** - Real-time exchange rates
- 🤖 **AI Financial Advice** - Smart recommendations using HuggingFace

### Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger/OpenAPI 3
- **External APIs**:
  - OCR.Space for receipt parsing
  - Frankfurter for currency conversion
  - HuggingFace for AI advice

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Docker & Docker Compose (optional)

## Installation & Setup

### 1. Clone the Repository

```bash
cd "H:\MCA ALL PROJECT\AI-Assisted Personal Financial Health Dashboard\backend"
```

### 2. Configure Database

Create a MySQL database:

```sql
CREATE DATABASE finance_db;
```

Update `src/main/resources/application.properties` with your credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=hasanali7623
```

### 3. Configure API Keys

Update the following in `application.properties`:

```properties
ocr.space.api.key=your_ocr_space_api_key
huggingface.api.key=your_hf_api_key
jwt.secret=yourSuperSecretJWTKeyThatIsAtLeast256BitsLongForHS256Algorithm
```

To get API keys:

- **OCR.Space**: https://ocr.space/ocrapi
- **HuggingFace**: https://huggingface.co/settings/tokens

### 4. Build the Application

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or run the JAR file:

```bash
java -jar target/financial-health-dashboard-1.0.0.jar
```

The application will start on `http://localhost:8080`

## Using Docker

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This will:

- Start MySQL database on port 3306
- Start the backend application on port 8080

### Stop the containers

```bash
docker-compose down
```

## API Documentation

Once the application is running, access the Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

API Documentation JSON:

```
http://localhost:8080/api-docs
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction by ID
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/filter` - Filter transactions

### Budgets

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/{id}` - Get budget by ID
- `GET /api/budgets/period` - Get budgets by period

### Savings Goals

- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `GET /api/goals/{id}` - Get goal by ID
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal
- `POST /api/goals/{id}/contribute` - Add contribution

### OCR Integration

- `POST /api/integrations/ocr/parse` - Upload and parse receipt

### Analytics & AI

- `POST /api/ml/advice` - Get AI financial advice
- `GET /api/currency/convert` - Convert currency
- `GET /api/currency/rates` - Get exchange rates
- `POST /api/analytics/spending-pattern` - Analyze spending

## Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Transaction (with JWT)

```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50.00,
    "category": "Food",
    "type": "EXPENSE",
    "transactionDate": "2025-11-18",
    "description": "Grocery shopping",
    "merchant": "Walmart"
  }'
```

### 4. Upload Receipt

```bash
curl -X POST http://localhost:8080/api/integrations/ocr/parse \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@receipt.jpg"
```

### 5. Get Financial Advice

```bash
curl -X POST http://localhost:8080/api/ml/advice \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "How can I save more money?",
    "context": "I spend $500 monthly on food"
  }'
```

## Database Schema

### Users Table

- id, name, email, password, role, is_active, created_at, updated_at

### Transactions Table

- id, user_id, amount, category, type, currency, transaction_date, description, merchant, payment_method, is_recurring, ocr_processed, created_at, updated_at

### Budgets Table

- id, user_id, category, amount, spent_amount, month, year, start_date, end_date, alert_threshold, created_at, updated_at

### Savings Goals Table

- id, user_id, name, target_amount, current_amount, target_date, description, status, created_at, updated_at

### OCR Logs Table

- id, user_id, file_name, raw_text, parsed_amount, parsed_date, parsed_merchant, parsed_description, parsing_status, error_message, transaction_id, created_at

## Security Features

- Password encryption using BCrypt
- JWT token-based authentication
- Secure API key management via environment variables
- CORS configuration for frontend integration
- Role-based access control

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/finance_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=hasanali7623
JWT_SECRET=yourSuperSecretJWTKey
OCR_SPACE_API_KEY=your_ocr_space_api_key
HUGGINGFACE_API_KEY=your_hf_api_key
```

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check if database `finance_db` exists

### API Key Errors

- Verify OCR.Space API key is valid
- Check HuggingFace API key has proper permissions
- Ensure API keys are properly set in configuration

### Build Errors

- Ensure Java 17 is installed: `java -version`
- Clear Maven cache: `mvn clean`
- Update dependencies: `mvn clean install -U`

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package -DskipTests
```

### Hot Reload (Development)

The application uses Spring Boot DevTools for automatic restart during development.

## Future Enhancements

- [ ] Email notifications via Mailgun
- [ ] Advanced analytics dashboard
- [ ] Recurring transaction automation
- [ ] Multi-currency support enhancement
- [ ] Mobile app integration
- [ ] Export reports (PDF/CSV)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Create an issue on GitHub
- Email: support@financialhealth.com

## Acknowledgments

- Spring Boot Team
- OCR.Space API
- Frankfurter Currency API
- HuggingFace
- MySQL Team
