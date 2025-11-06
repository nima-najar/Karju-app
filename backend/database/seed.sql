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

-- Insert additional business users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, user_type, verification_status, id_verified, cv_uploaded, work_permit_uploaded) VALUES
('44444444-4444-4444-4444-444444444444', 'restaurant@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Mohammad', 'Ahmadi', '02122334455', 'business', 'verified', TRUE, TRUE, TRUE),
('55555555-5555-5555-5555-555555555555', 'supermarket@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Fatemeh', 'Karimi', '02133445566', 'business', 'verified', TRUE, TRUE, TRUE),
('66666666-6666-6666-6666-666666666666', 'coffee@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Reza', 'Nouri', '02144556677', 'business', 'verified', TRUE, TRUE, TRUE),
('77777777-7777-7777-7777-777777777777', 'club@karju.ir', '$2a$10$rOzJLSvzGRcMHZyZgKYjOuYXHqJxYvL1GNnqI0x9J5vM2wJ3xZ5G6', 'Sara', 'Hosseini', '02155667788', 'business', 'verified', TRUE, TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert businesses
INSERT INTO businesses (user_id, business_name, business_type, address, city, province, phone, verification_status) VALUES
('33333333-3333-3333-3333-333333333333', 'Cafe Royale', 'hospitality', '123 Valiasr Street', 'Tehran', 'Tehran', '02188776655', 'verified'),
('44444444-4444-4444-4444-444444444444', 'رستوران سنتی - ولنجک', 'hospitality', 'Velenjak Street', 'Tehran', 'Tehran', '02122334455', 'verified'),
('55555555-5555-5555-5555-555555555555', 'افق کوروش', 'retail', 'Shahrak Gharb', 'Tehran', 'Tehran', '02133445566', 'verified'),
('66666666-6666-6666-6666-666666666666', 'قهوه لميز', 'hospitality', 'Fereshteh Street', 'Tehran', 'Tehran', '02144556677', 'verified'),
('77777777-7777-7777-7777-777777777777', 'کلاب شبانه - زعفرانیه', 'events', 'Zaferanieh Street', 'Tehran', 'Tehran', '02155667788', 'verified')
ON CONFLICT DO NOTHING;

-- Insert sample shifts matching the design
INSERT INTO shifts (business_id, title, description, industry, location, city, province, shift_date, start_time, end_time, hourly_wage, number_of_positions, required_skills, cancellation_deadline_hours) VALUES
-- Thursday shifts (March 6th equivalent - set to 3 days from now)
(
    (SELECT id FROM businesses WHERE user_id = '44444444-4444-4444-4444-444444444444' LIMIT 1),
    'رستوران سنتی - ولنجک',
    'Looking for an experienced waiter for our traditional restaurant. Must have excellent customer service skills and knowledge of Persian cuisine.',
    'hospitality',
    'Velenjak, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '3 days',
    '11:00:00',
    '19:00:00',
    900000,
    3,
    ARRAY['waiting', 'customer_service', 'food_service'],
    48
),
(
    (SELECT id FROM businesses WHERE user_id = '55555555-5555-5555-5555-555555555555' LIMIT 1),
    'افق کوروش - شهرک غرب',
    'Looking for reliable employees for our supermarket. Experience in retail preferred.',
    'retail',
    'Shahrak Gharb, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '3 days',
    '12:00:00',
    '20:00:00',
    1200000,
    2,
    ARRAY['retail', 'customer_service'],
    48
),
(
    (SELECT id FROM businesses WHERE user_id = '66666666-6666-6666-6666-666666666666' LIMIT 1),
    'قهوه لميز - فرشته',
    'Looking for an experienced barista for our coffee shop. Must know how to make various coffee drinks and have excellent customer service.',
    'hospitality',
    'Fereshteh, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    '18:00:00',
    1000000,
    2,
    ARRAY['barista', 'coffee', 'customer_service'],
    48
),
-- Friday shifts (March 7th equivalent - set to 4 days from now)
(
    (SELECT id FROM businesses WHERE user_id = '55555555-5555-5555-5555-555555555555' LIMIT 1),
    'سوپر مارکت - جردن',
    'Looking for a cashier for our supermarket branch. Must be accurate with money handling and have good customer service skills.',
    'retail',
    'Jordan, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '4 days',
    '09:00:00',
    '17:00:00',
    850000,
    2,
    ARRAY['cashier', 'retail', 'customer_service'],
    48
),
(
    (SELECT id FROM businesses WHERE user_id = '33333333-3333-3333-3333-333333333333' LIMIT 1),
    'کافه مدرن - سعادت آباد',
    'Looking for a skilled barista for our modern cafe. Experience with specialty coffee and latte art preferred.',
    'hospitality',
    'Saadat Abad, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '4 days',
    '08:00:00',
    '16:00:00',
    1100000,
    1,
    ARRAY['barista', 'coffee', 'latte_art'],
    48
),
(
    (SELECT id FROM businesses WHERE user_id = '77777777-7777-7777-7777-777777777777' LIMIT 1),
    'کلاب شبانه - زعفرانیه',
    'Looking for an experienced DJ for our night club. Must have own equipment and experience with electronic music.',
    'events',
    'Zaferanieh, Tehran',
    'Tehran',
    'Tehran',
    CURRENT_DATE + INTERVAL '4 days',
    '22:00:00',
    '03:00:00',
    2000000,
    1,
    ARRAY['dj', 'music', 'sound_system'],
    72
)
ON CONFLICT DO NOTHING;



