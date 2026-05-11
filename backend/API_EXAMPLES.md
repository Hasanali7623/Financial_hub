# API Testing Collection

## Authentication

### Register User

POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
"name": "Test User",
"email": "test@example.com",
"password": "password123"
}

### Login

POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
"email": "test@example.com",
"password": "password123"
}

### Refresh Token

POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
"refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}

## Transactions

### Get All Transactions

GET http://localhost:8080/api/transactions
Authorization: Bearer YOUR_JWT_TOKEN

### Create Transaction

POST http://localhost:8080/api/transactions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"amount": 100.50,
"category": "Food",
"type": "EXPENSE",
"currency": "USD",
"transactionDate": "2025-11-18",
"description": "Grocery shopping",
"merchant": "Walmart",
"paymentMethod": "Credit Card",
"isRecurring": false
}

### Update Transaction

PUT http://localhost:8080/api/transactions/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"amount": 120.00,
"category": "Food",
"type": "EXPENSE",
"currency": "USD",
"transactionDate": "2025-11-18",
"description": "Grocery shopping - Updated",
"merchant": "Walmart"
}

### Delete Transaction

DELETE http://localhost:8080/api/transactions/1
Authorization: Bearer YOUR_JWT_TOKEN

### Filter Transactions

GET http://localhost:8080/api/transactions/filter?category=Food&type=EXPENSE&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer YOUR_JWT_TOKEN

## Budgets

### Create Budget

POST http://localhost:8080/api/budgets
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"category": "Food",
"amount": 500.00,
"month": 11,
"year": 2025,
"alertThreshold": 450.00
}

### Get All Budgets

GET http://localhost:8080/api/budgets
Authorization: Bearer YOUR_JWT_TOKEN

### Get Budgets by Period

GET http://localhost:8080/api/budgets/period?month=11&year=2025
Authorization: Bearer YOUR_JWT_TOKEN

## Savings Goals

### Create Savings Goal

POST http://localhost:8080/api/goals
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"name": "Emergency Fund",
"targetAmount": 10000.00,
"currentAmount": 1000.00,
"targetDate": "2026-12-31",
"description": "Build emergency fund for 6 months expenses"
}

### Get All Goals

GET http://localhost:8080/api/goals
Authorization: Bearer YOUR_JWT_TOKEN

### Add Contribution to Goal

POST http://localhost:8080/api/goals/1/contribute?amount=500.00
Authorization: Bearer YOUR_JWT_TOKEN

### Update Goal

PUT http://localhost:8080/api/goals/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"name": "Emergency Fund - Updated",
"targetAmount": 12000.00,
"currentAmount": 1500.00,
"targetDate": "2026-12-31",
"description": "Build emergency fund"
}

## Analytics & AI

### Get Financial Advice

POST http://localhost:8080/api/ml/advice
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
"query": "How can I save more money on food expenses?",
"context": "I spend $500 monthly on groceries"
}

### Convert Currency

GET http://localhost:8080/api/currency/convert?from=USD&to=EUR&amount=100
Authorization: Bearer YOUR_JWT_TOKEN

### Get Exchange Rates

GET http://localhost:8080/api/currency/rates?base=USD
Authorization: Bearer YOUR_JWT_TOKEN

### Analyze Spending Pattern

POST http://localhost:8080/api/analytics/spending-pattern
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: text/plain

Monthly spending on food: $500, Entertainment: $200, Transport: $150

## OCR Integration

### Upload Receipt (use multipart form-data)

POST http://localhost:8080/api/integrations/ocr/parse
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="receipt.jpg"
Content-Type: image/jpeg

< ./receipt.jpg
------WebKitFormBoundary--

---

## Notes

1. Replace `YOUR_JWT_TOKEN` with the actual token received from login
2. Replace `YOUR_REFRESH_TOKEN_HERE` with actual refresh token
3. For file uploads, use tools like Postman or curl with proper file attachment
4. All dates should be in ISO format: YYYY-MM-DD
5. Categories can be: Food, Travel, Rent, Entertainment, Shopping, Healthcare, etc.
6. Transaction types: INCOME or EXPENSE
