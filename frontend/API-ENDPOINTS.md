# API Endpoints Reference

## Authentication Endpoints

### Register

- **URL:** `POST /api/auth/register`
- **Body:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:** `{ "success": true, "data": { "accessToken": "...", "user": {...} } }`

### Login

- **URL:** `POST /api/auth/login`
- **Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "success": true, "data": { "accessToken": "...", "user": {...} } }`

### Refresh Token

- **URL:** `POST /api/auth/refresh`
- **Body:** `{ "refreshToken": "string" }`
- **Response:** `{ "success": true, "data": { "accessToken": "...", "user": {...} } }`

---

## Transaction Endpoints

### Get All Transactions

- **URL:** `GET /api/transactions`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": [...] }`

### Get Transaction by ID

- **URL:** `GET /api/transactions/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": {...} }`

### Create Transaction

- **URL:** `POST /api/transactions`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "amount": number, "type": "INCOME|EXPENSE", "category": "string", "description": "string", "date": "YYYY-MM-DD" }`
- **Response:** `{ "success": true, "data": {...} }`

### Update Transaction

- **URL:** `PUT /api/transactions/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "amount": number, "type": "INCOME|EXPENSE", "category": "string", "description": "string", "date": "YYYY-MM-DD" }`
- **Response:** `{ "success": true, "data": {...} }`

### Delete Transaction

- **URL:** `DELETE /api/transactions/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "message": "..." }`

### Filter Transactions

- **URL:** `GET /api/transactions/filter?category={category}&type={type}&startDate={date}&endDate={date}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": [...] }`

---

## Budget Endpoints

### Get All Budgets

- **URL:** `GET /api/budgets`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": [...] }`

### Get Budget by ID

- **URL:** `GET /api/budgets/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": {...} }`

### Create Budget

- **URL:** `POST /api/budgets`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "category": "string", "amount": number, "period": "WEEKLY|MONTHLY|YEARLY", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }`
- **Response:** `{ "success": true, "data": {...} }`

### Update Budget

- **URL:** `PUT /api/budgets/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Same as Create
- **Response:** `{ "success": true, "data": {...} }`

### Delete Budget

- **URL:** `DELETE /api/budgets/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "message": "..." }`

### Get Budgets by Period

- **URL:** `GET /api/budgets/period/{period}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": [...] }`

---

## Savings Goal Endpoints

### Get All Savings Goals

- **URL:** `GET /api/goals`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": [...] }`

### Get Savings Goal by ID

- **URL:** `GET /api/goals/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": {...} }`

### Create Savings Goal

- **URL:** `POST /api/goals`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "name": "string", "targetAmount": number, "currentAmount": number, "deadline": "YYYY-MM-DD" }`
- **Response:** `{ "success": true, "data": {...} }`

### Update Savings Goal

- **URL:** `PUT /api/goals/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** Same as Create
- **Response:** `{ "success": true, "data": {...} }`

### Delete Savings Goal

- **URL:** `DELETE /api/goals/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "message": "..." }`

### Add Contribution

- **URL:** `POST /api/goals/{id}/contribute`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "amount": number }`
- **Response:** `{ "success": true, "data": {...} }`

---

## Analytics & AI Endpoints

### Get AI Financial Advice

- **URL:** `POST /api/ml/advice`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `{ "query": "string", "context": "string (optional)" }`
- **Response:** `{ "success": true, "data": "advice string" }`

### Convert Currency

- **URL:** `GET /api/currency/convert?from={currency}&to={currency}&amount={number}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": number }`

### Get Exchange Rates

- **URL:** `GET /api/currency/rates?base={currency}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** `{ "success": true, "data": {...} }`

### Analyze Spending Pattern

- **URL:** `POST /api/analytics/spending-pattern`
- **Headers:** `Authorization: Bearer {token}`
- **Body:** `"transaction data string"`
- **Response:** `{ "success": true, "data": "analysis string" }`

---

## OCR Integration Endpoints

### Upload and Parse Receipt

- **URL:** `POST /api/integrations/ocr/parse`
- **Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`
- **Body:** FormData with `file` field
- **Response:** `{ "success": true, "data": {...} }`

---

## Response Structure

All endpoints follow this structure:

```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": T | null
}
```

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## Frontend Service Updates Made

1. ✅ **AuthContext** - Fixed to use `response.data.data` and `accessToken`
2. ✅ **transactionService** - Fixed all methods to extract `data` property
3. ✅ **budgetService** - Fixed all methods to extract `data` property
4. ✅ **savingsGoalService** - Fixed all methods to extract `data` property
5. ✅ **analyticsService** -
   - Calculate summary from transactions (no backend endpoint)
   - Calculate category spending from transactions
   - Calculate monthly trends from transactions
   - Fixed AI advice to send `query` instead of `prompt`
   - Fixed currency converter to wrap BigDecimal response
6. ✅ **OCR endpoint** - Fixed path from `/ocr/parse` to `/integrations/ocr/parse`

---

## Known Issues Fixed

- ❌ Analytics summary endpoint doesn't exist → ✅ Calculate from transactions
- ❌ Category spending endpoint doesn't exist → ✅ Calculate from transactions
- ❌ Monthly trends endpoint doesn't exist → ✅ Calculate from transactions
- ❌ AI advice used wrong field name → ✅ Changed `prompt` to `query`
- ❌ Currency converter response mismatch → ✅ Wrapped BigDecimal in object
- ❌ OCR endpoint path incorrect → ✅ Updated to `/integrations/ocr/parse`
- ❌ All responses not extracting nested data → ✅ All services now use `response.data.data`
