-- Add latitude and longitude columns to shifts table
ALTER TABLE shifts 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_shifts_coordinates ON shifts(latitude, longitude);

