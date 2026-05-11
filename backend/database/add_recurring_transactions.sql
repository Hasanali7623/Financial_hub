-- Add recurring transactions for demo user
INSERT INTO transactions (user_id, amount, category, type, currency, transaction_date, description, merchant, payment_method, is_recurring, recurring_frequency, next_due_date) 
VALUES 
((SELECT id FROM users WHERE email='demo@example.com'), 120.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-21', 'Electricity bill', 'Power Company', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-21'),
((SELECT id FROM users WHERE email='demo@example.com'), 49.99, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-20', 'Netflix subscription', 'Netflix', 'Credit Card', TRUE, 'MONTHLY', '2025-11-22'),
((SELECT id FROM users WHERE email='demo@example.com'), 15.00, 'Utilities', 'EXPENSE', 'USD', '2025-10-20', 'Internet bill', 'ISP Provider', 'Auto Pay', TRUE, 'MONTHLY', '2025-11-23'),
((SELECT id FROM users WHERE email='demo@example.com'), 30.00, 'Subscriptions', 'EXPENSE', 'USD', '2025-10-18', 'Spotify Premium', 'Spotify', 'Credit Card', TRUE, 'MONTHLY', '2025-11-24');
