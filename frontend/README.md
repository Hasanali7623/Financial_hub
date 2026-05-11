# Financial Health Dashboard - Frontend

A modern, responsive React.js frontend for managing personal finances with AI-powered insights.

## 🚀 Features

- **Authentication**: Secure login and registration with JWT
- **Dashboard**: Overview of finances with interactive charts
- **Transactions**: Manual entry and OCR receipt upload
- **Budgets**: Create and track spending limits with progress bars
- **Savings Goals**: Set targets and track progress
- **AI Advisor**: Get personalized financial advice
- **Currency Converter**: Real-time currency conversion
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode Ready**: Supports dark/light themes

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Charts and graphs
- **Lucide React** - Beautiful icons
- **date-fns** - Date utilities

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

## 🔧 Installation

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── Modal.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── SavingsGoals.jsx
│   │   ├── AIAdvice.jsx
│   │   ├── CurrencyConverter.jsx
│   │   └── Profile.jsx
│   ├── context/         # React Context (State Management)
│   │   └── AuthContext.jsx
│   ├── services/        # API service layer
│   │   ├── api.js
│   │   ├── transactionService.js
│   │   ├── budgetService.js
│   │   ├── savingsGoalService.js
│   │   └── analyticsService.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔗 API Integration

The frontend connects to the Spring Boot backend via proxy configuration in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

All API calls are routed through `/api` which proxies to the backend.

## 🌐 Pages & Routes

| Route           | Page               | Description                     |
| --------------- | ------------------ | ------------------------------- |
| `/login`        | Login              | User authentication             |
| `/register`     | Register           | New user registration           |
| `/dashboard`    | Dashboard          | Financial overview with charts  |
| `/transactions` | Transactions       | View and manage transactions    |
| `/budgets`      | Budgets            | Create and track budgets        |
| `/savings`      | Savings Goals      | Set and track savings goals     |
| `/ai-advice`    | AI Advisor         | Get AI-powered financial advice |
| `/currency`     | Currency Converter | Convert between currencies      |
| `/profile`      | Profile            | User account settings           |

## 🎯 Key Features

### Authentication

- JWT-based authentication
- Auto-redirect for authenticated/unauthenticated users
- Token stored in localStorage
- Auto-logout on token expiration

### Dashboard

- Total balance, income, expenses overview
- Monthly trends line chart
- Category-wise spending pie chart
- Quick action buttons

### Transactions

- Add transactions manually
- Upload receipt images for OCR processing
- Filter and search transactions
- Edit and delete transactions
- Category and merchant tagging

### Budgets

- Create monthly/weekly/yearly budgets
- Visual progress bars
- Color-coded warnings (green/yellow/red)
- Track spending vs budget

### Savings Goals

- Set target amounts and deadlines
- Track progress with visual indicators
- Add contributions
- Achievement celebrations

### AI Advice

- Chat-like interface
- Contextual financial suggestions
- Pre-defined question templates
- HuggingFace API integration

### Currency Converter

- Real-time exchange rates
- Support for 8+ currencies
- Swap functionality
- Visual conversion display

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Dark Mode

The app supports dark mode via Tailwind's `dark:` classes.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🔐 Security

- JWT tokens with auto-refresh
- Protected routes
- Auto-logout on 401 responses
- Secure API communication

## 🐛 Troubleshooting

### Port already in use

Change port in `vite.config.js`:

```javascript
server: {
  port: 3001; // Change this
}
```

### API connection issues

Ensure backend is running on `http://localhost:8080`

### Build errors

```bash
rm -rf node_modules
npm install
```

## 📄 License

This project is part of an MCA major project.

## 👥 Author

MCA Student - Financial Health Dashboard Project

## 🙏 Acknowledgments

- Spring Boot Backend Integration
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide for icons
