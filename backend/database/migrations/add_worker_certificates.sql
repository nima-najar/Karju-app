ALTER TABLE worker_profiles
ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::jsonb;

