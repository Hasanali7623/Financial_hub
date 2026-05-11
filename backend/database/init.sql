-- Financial Health Dashboard Database Initialization Script
-- MySQL Database Setup

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS finance_db;

-- Use the database
USE finance_db;

-- Drop existing tables if they exist (for fresh setup)
-- Uncomment below lines if you want to reset database
-- DROP TABLE IF EXISTS ocr_logs;
-- DROP TABLE IF EXISTS transactions;
-- DROP TABLE IF EXISTS budgets;
-- DROP TABLE IF EXISTS savings_goals;
-- DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_date DATE NOT NULL,
    description VARCHAR(500),
    merchant VARCHAR(255),
    payment_method VARCHAR(100),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(20),
    next_due_date DATE,
    ocr_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_next_due_date (next_due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    spent_amount DECIMAL(15, 2) DEFAULT 0.00,
    month INT NOT NULL,
    year INT NOT NULL,
    start_date DATE,
    end_date DATE,
    alert_threshold DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_budget (user_id, category, month, year),
    INDEX idx_user_id (user_id),
    INDEX idx_period (month, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0.00,
    target_date DATE,
    description VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OCR Logs Table
CREATE TABLE IF NOT EXISTS ocr_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255),
    raw_text TEXT,
    parsed_amount DECIMAL(15, 2),
    parsed_date DATE,
    parsed_merchant VARCHAR(255),
    parsed_description VARCHAR(500),
    parsing_status VARCHAR(50),
    error_message VARCHAR(500),
    transaction_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_parsing_status (parsing_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data (optional - for testing)

-- Sample User (password: password123 - BCrypt hashed)
INSERT INTO users (name, email, password, role, is_active) VALUES
('Demo User', 'demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye/IcEhZJa.JozjGjJv9eFWGLt0Yzx3S6', 'USER', TRUE);

-- Get the inserted user ID
SET @demo_user_id = LAST_INSERT_ID();

-- Sample Transactions
INSERT INTO transactions (user_id, amount, category, type, currency, transaction_date, description, merchant, payment_method) VALUES
(@demo_user_id, 50.00, 'Food', 'EXPENSE', 'USD', '2025-11-15', 'Grocery shopping', 'Walmart', 'Credit Card'),
(@demo_user_id, 3000.00, 'Salary', 'INCOME', 'USD', '2025-11-01', 'Monthly salary', 'Company Inc.', 'Bank Transfer'),
(@demo_user_id, 100.00, 'Entertainment', 'EXPENSE', 'USD', '2025-11-10', 'Movie tickets', 'Cinema', 'Credit Card'),
(@demo_user_id, 800.00, 'Rent', 'EXPENSE', 'USD', '2025-11-01', 'Monthly rent', 'Landlord', 'Bank Transfer');

-- Sample Recurring Transactions (Upcoming Bills)
INSERT INTO transactions (user_id, amount, category, type, currency, transaction_date, description, merchant, payment_method, is_recurring, recurring_frequency, next_due_date) VALUES
(@demo_user_id, 120.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-21', 'Electricity bill', 'Power Company', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-21'),
(@demo_user_id, 49.99, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-20', 'Netflix subscription', 'Netflix', 'Credit Card', TRUE, 'MONTHLY', '2025-11-22'),
(@demo_user_id, 15.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-20', 'Internet bill', 'ISP Provider', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-23'),
(@demo_user_id, 30.00, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-18', 'Spotify Premium', 'Spotify', 'Credit Card', TRUE, 'MONTHLY', '2025-11-24');

-- Sample Budgets
INSERT INTO budgets (user_id, category, amount, spent_amount, month, year, start_date, end_date, alert_threshold) VALUES
(@demo_user_id, 'Food', 500.00, 50.00, 11, 2025, '2025-11-01', '2025-11-30', 450.00),
(@demo_user_id, 'Entertainment', 200.00, 100.00, 11, 2025, '2025-11-01', '2025-11-30', 180.00),
(@demo_user_id, 'Rent', 1000.00, 800.00, 11, 2025, '2025-11-01', '2025-11-30', 1000.00);

-- Sample Savings Goals
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, target_date, description, status) VALUES
(@demo_user_id, 'Emergency Fund', 10000.00, 2000.00, '2026-12-31', 'Build 6 months emergency fund', 'ACTIVE'),
(@demo_user_id, 'Vacation Fund', 5000.00, 1000.00, '2026-06-30', 'Save for summer vacation', 'ACTIVE'),
(@demo_user_id, 'New Laptop', 1500.00, 500.00, '2026-03-31', 'Save for new laptop', 'ACTIVE');

-- Create views for analytics (optional)

-- Monthly expense summary view
CREATE OR REPLACE VIEW v_monthly_expenses AS
SELECT 
    user_id,
    YEAR(transaction_date) as year,
    MONTH(transaction_date) as month,
    category,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions
WHERE type = 'EXPENSE'
GROUP BY user_id, YEAR(transaction_date), MONTH(transaction_date), category;

-- Budget progress view
CREATE OR REPLACE VIEW v_budget_progress AS
SELECT 
    b.id,
    b.user_id,
    b.category,
    b.amount as budget_amount,
    b.spent_amount,
    b.amount - b.spent_amount as remaining_amount,
    ROUND((b.spent_amount / b.amount) * 100, 2) as percentage_used,
    b.month,
    b.year,
    CASE 
        WHEN b.spent_amount >= b.amount THEN 'EXCEEDED'
        WHEN b.spent_amount >= b.alert_threshold THEN 'WARNING'
        ELSE 'NORMAL'
    END as status
FROM budgets b;

-- Savings goals progress view
CREATE OR REPLACE VIEW v_savings_progress AS
SELECT 
    sg.id,
    sg.user_id,
    sg.name,
    sg.target_amount,
    sg.current_amount,
    sg.target_amount - sg.current_amount as remaining_amount,
    ROUND((sg.current_amount / sg.target_amount) * 100, 2) as progress_percentage,
    sg.target_date,
    DATEDIFF(sg.target_date, CURDATE()) as days_remaining,
    sg.status
FROM savings_goals sg;

-- Show table information
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as UserCount FROM users;
SELECT COUNT(*) as TransactionCount FROM transactions;
SELECT COUNT(*) as BudgetCount FROM budgets;
SELECT COUNT(*) as GoalCount FROM savings_goals;
