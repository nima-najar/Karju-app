/**
 * Script to run the add_shift_coordinates migration
 */

require('dotenv').config();
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Running migration: add_shift_coordinates.sql');
    
    const migrationPath = path.join(__dirname, '../database/migrations/add_shift_coordinates.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(migrationSQL);
    
    console.log('✓ Migration completed successfully!');
    
    // Verify columns were added
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'shifts' 
      AND column_name IN ('latitude', 'longitude')
    `);
    
    if (result.rows.length === 2) {
      console.log('✓ Verified: latitude and longitude columns exist');
    } else {
      console.log('⚠ Warning: Could not verify columns');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

