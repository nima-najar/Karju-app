-- Migration: Add profile_picture_url column to worker_profiles table
-- Run this if the column doesn't exist yet

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'worker_profiles' 
        AND column_name = 'profile_picture_url'
    ) THEN
        ALTER TABLE worker_profiles 
        ADD COLUMN profile_picture_url TEXT;
        
        RAISE NOTICE 'Column profile_picture_url added to worker_profiles table';
    ELSE
        RAISE NOTICE 'Column profile_picture_url already exists';
    END IF;
END $$;

