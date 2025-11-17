/**
 * Script to geocode existing shifts in the database
 * Run this script to add coordinates to shifts that don't have them
 * 
 * Usage: node scripts/geocode-existing-shifts.js
 */

require('dotenv').config();
const pool = require('../config/database');
const { geocodeAddress } = require('../lib/geocoding');

async function geocodeExistingShifts() {
  try {
    console.log('Starting geocoding of existing shifts...');

    // Get all shifts without coordinates
    const result = await pool.query(`
      SELECT id, location, city, province 
      FROM shifts 
      WHERE latitude IS NULL OR longitude IS NULL
      ORDER BY created_at DESC
    `);

    const shifts = result.rows;
    console.log(`Found ${shifts.length} shifts without coordinates`);

    if (shifts.length === 0) {
      console.log('All shifts already have coordinates!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    for (const shift of shifts) {
      try {
        // Build full address
        const addressParts = [shift.location];
        if (shift.city) addressParts.push(shift.city);
        if (shift.province) addressParts.push(shift.province);
        const fullAddress = addressParts.join(', ');

        console.log(`\nGeocoding shift ${shift.id}: ${fullAddress}`);

        // Geocode address
        const coordinates = await geocodeAddress(fullAddress);

        if (coordinates) {
          // Update shift with coordinates
          await pool.query(
            'UPDATE shifts SET latitude = $1, longitude = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            [coordinates.latitude, coordinates.longitude, shift.id]
          );
          console.log(`✓ Success: ${coordinates.latitude}, ${coordinates.longitude}`);
          successCount++;
        } else {
          console.log(`✗ Failed: Could not geocode address`);
          failCount++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing shift ${shift.id}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n=== Geocoding Complete ===`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total: ${shifts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
geocodeExistingShifts();

