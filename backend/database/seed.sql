-- Seed data for development and testing

-- Insert sample users (passwords are 'password123' hashed with bcrypt)
-- For production, use proper password hashing
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, user_type, verification_status, id_verified, cv_uploaded, work_permit_uploaded) VALUES
('11111111-1111-1111-1111-111111111111', 'worker1@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Ali', 'Rezaei', '09121234567', 'worker', 'verified', TRUE, TRUE, TRUE),
('22222222-2222-2222-2222-222222222222', 'worker2@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Maryam', 'Khosravi', '09129876543', 'worker', 'verified', TRUE, TRUE, TRUE),
('33333333-3333-3333-3333-333333333333', 'business1@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Hassan', 'Mohammadi', '02188776655', 'business', 'verified', TRUE, TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert worker profiles
INSERT INTO worker_profiles (user_id, bio, skills, experience_years, hourly_rate_min, hourly_rate_max, preferred_locations, average_rating, total_ratings) VALUES
('11111111-1111-1111-1111-111111111111', 'Experienced waiter with 3 years in hospitality', ARRAY['waiting', 'customer_service', 'food_service'], 3, 500000, 800000, ARRAY['Tehran', 'Shiraz'], 4.5, 10),
('22222222-2222-2222-2222-222222222222', 'Event coordinator and logistics specialist', ARRAY['event_planning', 'logistics', 'coordination'], 2, 600000, 1000000, ARRAY['Tehran', 'Isfahan'], 4.8, 15)
ON CONFLICT DO NOTHING;

-- Insert businesses
INSERT INTO businesses (user_id, business_name, business_type, address, city, province, phone, verification_status) VALUES
('33333333-3333-3333-3333-333333333333', 'Cafe Royale', 'hospitality', '123 Valiasr Street', 'Tehran', 'Tehran', '02188776655', 'verified')
ON CONFLICT DO NOTHING;

-- Insert sample shifts
INSERT INTO shifts (business_id, title, description, industry, location, city, province, shift_date, start_time, end_time, hourly_wage, number_of_positions, required_skills, cancellation_deadline_hours) VALUES
(
    (SELECT id FROM businesses WHERE user_id = '33333333-3333-3333-3333-333333333333' LIMIT 1),
    'Waiter Needed - Weekend Shift',
    'Looking for an experienced waiter for our busy weekend service. Must have excellent customer service skills.',
    'hospitality',
    '123 Valiasr Street, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '3 days',
    '09:00:00',
    '17:00:00',
    700000,
    2,
    ARRAY['waiting', 'customer_service'],
    48
),
(
    (SELECT id FROM businesses WHERE user_id = '33333333-3333-3333-3333-333333333333' LIMIT 1),
    'Event Setup Assistant',
    'Need help setting up for a corporate event. Experience in event logistics preferred.',
    'events',
    '123 Valiasr Street, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '7 days',
    '14:00:00',
    '20:00:00',
    800000,
    1,
    ARRAY['event_planning', 'logistics'],
    72
)
ON CONFLICT DO NOTHING;



