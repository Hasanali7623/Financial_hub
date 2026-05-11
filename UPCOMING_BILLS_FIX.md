# Adding Upcoming Bills to Dashboard

## Issue Fixed

The "Upcoming Bills" section wasn't showing any data because there were no recurring transactions in the database.

## What Changed

### 1. Database Schema (backend/database/init.sql)

Added sample recurring transactions with:

- `is_recurring` = TRUE
- `recurring_frequency` = 'MONTHLY'
- `next_due_date` = dates within the next 3 days

### 2. Sample Bills Added

- Electricity bill - ₹120.00 (due Nov 21)
- Netflix subscription - ₹49.99 (due Nov 22)
- Internet bill - ₹15.00 (due Nov 23)
- Spotify Premium - ₹30.00 (due Nov 24)

## How to Add the Bills to Your Database

### Option 1: Using MySQL Workbench or phpMyAdmin

1. Open your MySQL client
2. Connect to database: `finance_db`
3. Run the SQL file: `backend/database/add_recurring_transactions.sql`

### Option 2: Using MySQL Command Line

```bash
mysql -u root -p finance_db < backend/database/add_recurring_transactions.sql
```

### Option 3: Manual SQL Execution

Connect to MySQL and run:

```sql
USE finance_db;

INSERT INTO transactions (user_id, amount, category, type, currency, transaction_date, description, merchant, payment_method, is_recurring, recurring_frequency, next_due_date)
VALUES
((SELECT id FROM users WHERE email='demo@example.com'), 120.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-21', 'Electricity bill', 'Power Company', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-21'),
((SELECT id FROM users WHERE email='demo@example.com'), 49.99, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-20', 'Netflix subscription', 'Netflix', 'Credit Card', TRUE, 'MONTHLY', '2025-11-22'),
((SELECT id FROM users WHERE email='demo@example.com'), 15.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-20', 'Internet bill', 'ISP Provider', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-23'),
((SELECT id FROM users WHERE email='demo@example.com'), 30.00, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-18', 'Spotify Premium', 'Spotify', 'Credit Card', TRUE, 'MONTHLY', '2025-11-24');
```

## How It Works

1. **Backend API**: `/api/transactions/recurring/upcoming`

   - Retrieves transactions where:
     - `is_recurring` = TRUE
     - `next_due_date` is within the next 3 days from today

2. **Frontend**: Dashboard loads upcoming bills automatically
   - Shows bill details with category, amount, and due date
   - Color-coded urgency (red for due today/tomorrow, orange for later)
   - Displays "Due today", "Due tomorrow", or "in X days"

## Testing

1. Login to the application (demo@example.com / demo123)
2. Navigate to Dashboard
3. Scroll down to "Upcoming Bills" section
4. You should see 4 bills listed with their due dates

## Adding More Bills via UI

To add recurring transactions through the application:

1. Go to **Transactions** page
2. Click "Add Transaction"
3. Fill in transaction details
4. Check ✓ "Recurring Transaction"
5. Select frequency (Daily/Weekly/Monthly/Yearly)
6. The system will automatically calculate the next due date
