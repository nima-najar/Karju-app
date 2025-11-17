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
('33333333-3333-3333-3333-333333333333', 'کافه رویال', 'رستوران و پذیرایی', 'خیابان ولیعصر، پلاک ۱۲۳', 'تهران', 'تهران', '02188776655', 'verified'),
('44444444-4444-4444-4444-444444444444', 'رستوران سنتی - ولنجک', 'رستوران و پذیرایی', 'خیابان ولنجک', 'تهران', 'تهران', '02122334455', 'verified'),
('55555555-5555-5555-5555-555555555555', 'افق کوروش', 'خرده‌فروشی', 'شهرک غرب', 'تهران', 'تهران', '02133445566', 'verified'),
('66666666-6666-6666-6666-666666666666', 'قهوه لميز', 'رستوران و پذیرایی', 'خیابان فرشته', 'تهران', 'تهران', '02144556677', 'verified'),
('77777777-7777-7777-7777-777777777777', 'کلاب شبانه - زعفرانیه', 'رویدادها', 'خیابان زعفرانیه', 'تهران', 'تهران', '02155667788', 'verified')
ON CONFLICT DO NOTHING;

-- Insert sample shifts matching the design
INSERT INTO shifts (business_id, title, description, industry, location, city, province, shift_date, start_time, end_time, hourly_wage, number_of_positions, required_skills, cancellation_deadline_hours) VALUES
-- شیفت‌های پنج‌شنبه (۳ روز بعد)
(
    (SELECT id FROM businesses WHERE user_id = '44444444-4444-4444-4444-444444444444' LIMIT 1),
    'گارسون رستوران سنتی',
    'به دنبال گارسون با تجربه برای رستوران سنتی خود هستیم. باید مهارت‌های عالی در خدمات مشتری و آشنایی با غذاهای ایرانی داشته باشد.',
    'رستوران و پذیرایی',
    'ولنجک، تهران',
    'تهران',
    'تهران',
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
    'فروشنده سوپرمارکت',
    'به دنبال فروشنده قابل اعتماد برای سوپرمارکت خود هستیم. تجربه در خرده‌فروشی ترجیح داده می‌شود.',
    'خرده‌فروشی',
    'شهرک غرب، تهران',
    'تهران',
    'تهران',
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
    'باریستا قهوه‌خانه',
    'به دنبال باریستا با تجربه برای قهوه‌خانه خود هستیم. باید بتواند انواع نوشیدنی‌های قهوه را درست کند و مهارت‌های عالی در خدمات مشتری داشته باشد.',
    'رستوران و پذیرایی',
    'فرشته، تهران',
    'تهران',
    'تهران',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    '18:00:00',
    1000000,
    2,
    ARRAY['barista', 'coffee', 'customer_service'],
    48
),
-- شیفت‌های جمعه (۴ روز بعد)
(
    (SELECT id FROM businesses WHERE user_id = '55555555-5555-5555-5555-555555555555' LIMIT 1),
    'صندوقدار سوپرمارکت',
    'به دنبال صندوقدار برای شعبه سوپرمارکت خود هستیم. باید در مدیریت پول دقیق باشد و مهارت‌های خوب خدمات مشتری داشته باشد.',
    'خرده‌فروشی',
    'جردن، تهران',
    'تهران',
    'تهران',
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
    'باریستا کافه مدرن',
    'به دنبال باریستا ماهر برای کافه مدرن خود هستیم. تجربه در قهوه‌های تخصصی و لته آرت ترجیح داده می‌شود.',
    'رستوران و پذیرایی',
    'سعادت‌آباد، تهران',
    'تهران',
    'تهران',
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
    'دی‌جی کلاب شبانه',
    'به دنبال دی‌جی با تجربه برای کلاب شبانه خود هستیم. باید تجهیزات خود را داشته باشد و تجربه در موسیقی الکترونیک داشته باشد.',
    'رویدادها',
    'زعفرانیه، تهران',
    'تهران',
    'تهران',
    CURRENT_DATE + INTERVAL '4 days',
    '22:00:00',
    '03:00:00',
    2000000,
    1,
    ARRAY['dj', 'music', 'sound_system'],
    72
)
ON CONFLICT DO NOTHING;

-- Ensure a minimum of four open shifts per day up to 25 آبان 1404 (2025-11-16)
WITH business_refs AS (
    SELECT 'restaurant'::text AS label, id
    FROM businesses
    WHERE user_id = '44444444-4444-4444-4444-444444444444'
    UNION ALL
    SELECT 'supermarket', id
    FROM businesses
    WHERE user_id = '55555555-5555-5555-5555-555555555555'
    UNION ALL
    SELECT 'coffee', id
    FROM businesses
    WHERE user_id = '66666666-6666-6666-6666-666666666666'
    UNION ALL
    SELECT 'event', id
    FROM businesses
    WHERE user_id = '77777777-7777-7777-7777-777777777777'
),
date_series AS (
    SELECT generate_series(DATE '2025-10-23', DATE '2025-11-16', INTERVAL '1 day')::date AS shift_date
),
templates AS (
    SELECT
        br.id AS business_id,
        tpl.title,
        tpl.description,
        tpl.industry,
        tpl.location,
        tpl.city,
        tpl.province,
        tpl.start_time::time AS start_time,
        tpl.end_time::time AS end_time,
        tpl.hourly_wage,
        tpl.number_of_positions,
        tpl.required_skills,
        tpl.dress_code,
        tpl.cancellation_deadline_hours
    FROM business_refs br
    JOIN (
        VALUES
            (
                'restaurant',
                'گارسون شیفت ناهار',
                'پشتیبانی از سالن و سرویس‌دهی در شیفت ناهار رستوران.',
                'رستوران و پذیرایی',
                'ولنجک، تهران',
                'تهران',
                'تهران',
                '11:00',
                '17:00',
                950000,
                3,
                ARRAY['waiting', 'customer_service', 'food_service'],
                'فرم سفید رستوران',
                48
            ),
            (
                'supermarket',
                'فروشنده سوپرمارکت',
                'چیدمان قفسه‌ها، پاسخگویی به مشتری و مدیریت صندوق.',
                'خرده‌فروشی',
                'شهرک غرب، تهران',
                'تهران',
                'تهران',
                '08:00',
                '14:00',
                880000,
                2,
                ARRAY['retail', 'customer_service'],
                'لباس راحت و مرتب',
                48
            ),
            (
                'coffee',
                'باریستا صبحگاهی',
                'آماده‌سازی نوشیدنی‌های صبحگاهی و مدیریت سفارش‌های بیرون‌بر.',
                'رستوران و پذیرایی',
                'فرشته، تهران',
                'تهران',
                'تهران',
                '07:00',
                '13:00',
                980000,
                2,
                ARRAY['barista', 'coffee', 'customer_service'],
                'پیشبند قهوه‌ای کافه',
                48
            ),
            (
                'event',
                'هماهنگ‌کننده رویداد عصر',
                'هماهنگی ورود مهمانان، مدیریت برنامه و تعامل با تیم اجرا.',
                'رویدادها',
                'زعفرانیه، تهران',
                'تهران',
                'تهران',
                '16:00',
                '22:00',
                1350000,
                4,
                ARRAY['event_planning', 'logistics', 'customer_service'],
                'لباس رسمی مشکی',
                72
            )
    ) AS tpl(
        label,
        title,
        description,
        industry,
        location,
        city,
        province,
        start_time,
        end_time,
        hourly_wage,
        number_of_positions,
        required_skills,
        dress_code,
        cancellation_deadline_hours
    ) ON tpl.label = br.label
),
target_shifts AS (
    SELECT
        ds.shift_date,
        tpl.*
    FROM date_series ds
    CROSS JOIN templates tpl
),
missing_shifts AS (
    SELECT ts.*
    FROM target_shifts ts
    LEFT JOIN shifts s
        ON s.business_id = ts.business_id
       AND s.shift_date = ts.shift_date
       AND s.start_time = ts.start_time
    WHERE s.id IS NULL
)
INSERT INTO shifts (
    business_id,
    title,
    description,
    industry,
    location,
    city,
    province,
    shift_date,
    start_time,
    end_time,
    hourly_wage,
    number_of_positions,
    required_skills,
    dress_code,
    cancellation_deadline_hours,
    status
)
SELECT
    ms.business_id,
    ms.title || ' - ' || to_char(ms.shift_date, 'YYYY-MM-DD'),
    ms.description,
    ms.industry,
    ms.location,
    ms.city,
    ms.province,
    ms.shift_date,
    ms.start_time,
    ms.end_time,
    ms.hourly_wage,
    ms.number_of_positions,
    ms.required_skills,
    ms.dress_code,
    ms.cancellation_deadline_hours,
    'open'
FROM missing_shifts ms
ORDER BY ms.shift_date, ms.start_time;







