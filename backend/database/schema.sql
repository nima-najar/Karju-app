-- Karju Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for workers/freelancers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('worker', 'business')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    id_verified BOOLEAN DEFAULT FALSE,
    cv_uploaded BOOLEAN DEFAULT FALSE,
    work_permit_uploaded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50),
    registration_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop ALL check constraints on business_type column (must be after table creation)
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    -- Drop by known name first
    EXECUTE 'ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_business_type_check';
    
    -- Also try to find and drop any constraint that references business_type
    FOR constraint_name IN (
        SELECT conname::TEXT
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'businesses'
        AND c.contype = 'c'
        AND (
            c.conname::TEXT LIKE '%business_type%' 
            OR pg_get_constraintdef(c.oid) LIKE '%business_type%'
        )
    ) LOOP
        EXECUTE format('ALTER TABLE businesses DROP CONSTRAINT IF EXISTS %I', constraint_name);
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors, continue
        NULL;
END $$;

-- Update existing data to Persian
UPDATE businesses SET business_type = 'رستوران و پذیرایی' WHERE business_type = 'hospitality';
UPDATE businesses SET business_type = 'رویدادها' WHERE business_type = 'events';
UPDATE businesses SET business_type = 'لجستیک' WHERE business_type = 'logistics';
UPDATE businesses SET business_type = 'خرده‌فروشی' WHERE business_type = 'retail';
UPDATE businesses SET business_type = 'سایر' WHERE business_type = 'other';

-- Add new constraint with Persian values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'businesses_business_type_check'
    ) THEN
        ALTER TABLE businesses ADD CONSTRAINT businesses_business_type_check 
            CHECK (business_type IN ('رستوران و پذیرایی', 'رویدادها', 'لجستیک', 'خرده‌فروشی', 'سایر'));
    END IF;
END $$;

-- Worker profiles table
CREATE TABLE IF NOT EXISTS worker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    skills TEXT[],
    experience_years INTEGER DEFAULT 0,
    hourly_rate_min INTEGER,
    hourly_rate_max INTEGER,
    preferred_locations TEXT[],
    availability_calendar JSONB, -- Stores availability for upcoming month
    profile_picture_url TEXT, -- Stores base64 image or image URL
    certificates JSONB DEFAULT '[]',
    birth_date DATE,
    gender VARCHAR(50),
    national_id VARCHAR(50),
    passport_number VARCHAR(50),
    phone_number VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    bank_account_holder VARCHAR(150),
    bank_card_number VARCHAR(32),
    bank_iban VARCHAR(34),
    phone_verified BOOLEAN DEFAULT FALSE,
    military_status VARCHAR(100),
    education_level VARCHAR(100),
    education_field VARCHAR(255),
    education_institution VARCHAR(255),
    education_graduation_year VARCHAR(10),
    about_me TEXT,
    personality_traits TEXT,
    languages JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    verification_progress INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shifts table
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(50),
    location TEXT NOT NULL,
    city VARCHAR(100),
    province VARCHAR(100),
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hourly_wage INTEGER NOT NULL, -- Excludes platform fee
    number_of_positions INTEGER DEFAULT 1,
    required_skills TEXT[],
    dress_code TEXT,
    cancellation_deadline_hours INTEGER DEFAULT 48, -- Hours before shift start
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'filled', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop ALL check constraints on industry column (must be after table creation)
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    -- Drop by known name first
    EXECUTE 'ALTER TABLE shifts DROP CONSTRAINT IF EXISTS shifts_industry_check';
    
    -- Also try to find and drop any constraint that references industry
    FOR constraint_name IN (
        SELECT conname::TEXT
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'shifts'
        AND c.contype = 'c'
        AND (
            c.conname::TEXT LIKE '%industry%' 
            OR pg_get_constraintdef(c.oid) LIKE '%industry%'
        )
    ) LOOP
        EXECUTE format('ALTER TABLE shifts DROP CONSTRAINT IF EXISTS %I', constraint_name);
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore errors, continue
        NULL;
END $$;

-- Update existing data to Persian
UPDATE shifts SET industry = 'رستوران و پذیرایی' WHERE industry = 'hospitality';
UPDATE shifts SET industry = 'رویدادها' WHERE industry = 'events';
UPDATE shifts SET industry = 'لجستیک' WHERE industry = 'logistics';
UPDATE shifts SET industry = 'خرده‌فروشی' WHERE industry = 'retail';
UPDATE shifts SET industry = 'سایر' WHERE industry = 'other';

-- Add new constraint with Persian values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'shifts_industry_check'
    ) THEN
        ALTER TABLE shifts ADD CONSTRAINT shifts_industry_check 
            CHECK (industry IN ('رستوران و پذیرایی', 'رویدادها', 'لجستیک', 'خرده‌فروشی', 'سایر'));
    END IF;
END $$;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_text TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shift_id, worker_id)
);

-- Shift assignments (when worker is selected)
CREATE TABLE IF NOT EXISTS shift_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id),
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'completed', 'cancelled', 'no_show')),
    hours_worked DECIMAL(4,2),
    total_payment DECIMAL(12,2),
    platform_fee DECIMAL(12,2),
    worker_payment DECIMAL(12,2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shift_id, worker_id)
);

-- Ratings and reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_assignment_id UUID REFERENCES shift_assignments(id) ON DELETE CASCADE,
    rater_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who gave the rating
    ratee_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who received the rating
    rating_type VARCHAR(20) CHECK (rating_type IN ('worker', 'business')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shift_assignment_id, rater_id, rating_type)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_assignment_id UUID REFERENCES shift_assignments(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id),
    worker_id UUID REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL,
    platform_fee DECIMAL(12,2) NOT NULL,
    net_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50), -- 'shift', 'application', 'rating', etc.
    related_entity_id UUID,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_business_id ON shifts(business_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_applications_shift_id ON applications(shift_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker_id ON applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_worker_id ON shift_assignments(worker_id);
CREATE INDEX IF NOT EXISTS idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shifts_updated_at ON shifts;
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shift_assignments_updated_at ON shift_assignments;
CREATE TRIGGER update_shift_assignments_updated_at BEFORE UPDATE ON shift_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


