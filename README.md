# Financial Health Dashboard - Complete Application

## 🎯 Project Overview

A full-stack web application for personal financial management with AI-powered insights, OCR receipt processing, and real-time currency conversion.

## 📁 Project Structure

```
AI-Assisted Personal Financial Health Dashboard/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
└── frontend/                # React Frontend
    ├── src/
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
mvn clean install -DskipTests
java -jar target/financial-health-dashboard-1.0.0.jar
```

Backend will run on: `http://localhost:8080`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## 📊 Features

✅ User Authentication (JWT)
✅ Transaction Management
✅ OCR Receipt Upload
✅ Budget Tracking with Progress Bars
✅ Savings Goals
✅ AI Financial Advice
✅ Currency Conversion
✅ Interactive Charts & Graphs
✅ Responsive Mobile Design
✅ Dark Mode Support

## 🛠️ Technology Stack

### Backend

- Spring Boot 3.2.0
- MySQL 8.0
- Spring Security + JWT
- Spring Data JPA
- WebClient for APIs
- Swagger/OpenAPI

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide Icons

### External APIs

- OCR.Space (Receipt parsing)
- Frankfurter (Currency conversion)
- HuggingFace (AI advice)

## 📝 Default Credentials

After running the database initialization script:

**Email:** demo@example.com  
**Password:** password123

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/finance_db
spring.datasource.username=root
spring.datasource.password=hasanali7623

# API Keys
ocr.space.api.key=your_ocr_space_api_key
huggingface.api.key=your_hf_api_key
```

### Frontend Configuration

The frontend auto-connects to backend via Vite proxy (no config needed).

## 📱 Screenshots & Demo

### Dashboard

- Total balance, income, expenses
- Monthly trends chart
- Category-wise spending pie chart

### Transactions

- Add transactions manually
- Upload receipt images
- Filter and search
- Edit/delete operations

### Budgets

- Create category budgets
- Visual progress bars
- Overspending alerts

### Savings Goals

- Set financial goals
- Track progress
- Add contributions

### AI Advice

- Chat-based interface
- Personalized financial tips

### Currency Converter

- Real-time exchange rates
- 8+ currencies supported

## 🎓 Educational Purpose

This project was developed as part of an MCA (Master of Computer Applications) major project to demonstrate:

- Full-stack development skills
- RESTful API design
- Modern frontend frameworks
- Database design and integration
- External API integration
- Security best practices
- Responsive UI/UX design

## 📄 Documentation

- Backend API Documentation: http://localhost:8080/swagger-ui.html
- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`

## 🐛 Common Issues

### Backend won't start

- Check MySQL is running
- Verify database credentials
- Ensure port 8080 is available

### Frontend can't connect to backend

- Ensure backend is running on port 8080
- Check browser console for errors
- Verify API proxy in vite.config.js

### OCR/AI features not working

- Add valid API keys in application.properties
- Restart the backend after adding keys

## 🔮 Future Enhancements

- [ ] Email notifications for budget alerts
- [ ] Export reports to PDF
- [ ] Recurring transactions
- [ ] Multi-user support
- [ ] Investment tracking
- [ ] Tax calculations

## 👨‍💻 Development

### Running in Development Mode

**Backend:**

```bash
cd backend
mvn spring-boot:run
```

**Frontend:**

```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**

```bash
cd backend
mvn clean package -DskipTests
```

**Frontend:**

```bash
cd frontend
npm run build
```

## 📞 Support

For issues or questions:

1. Check the README files in backend/ and frontend/
2. Review Swagger API documentation
3. Check application logs

## 🙏 Acknowledgments

- Spring Boot Community
- React Community
- Tailwind CSS Team
- Open Source Contributors

---

**Made with ❤️ for MCA Major Project**
