/**
 * Script to check how many shifts have coordinates
 */

require('dotenv').config();
const pool = require('../config/database');

async function checkCoordinates() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(latitude) as with_coords,
        COUNT(*) - COUNT(latitude) as without_coords
      FROM shifts
    `);

    const stats = result.rows[0];
    console.log('\n=== Shift Coordinates Status ===');
    console.log(`Total shifts: ${stats.total}`);
    console.log(`With coordinates: ${stats.with_coords}`);
    console.log(`Without coordinates: ${stats.without_coords}`);
    
    if (parseInt(stats.without_coords) > 0) {
      console.log('\n⚠ Some shifts need geocoding. Run: npm run geocode-shifts');
    } else {
      console.log('\n✓ All shifts have coordinates!');
    }

    // Show sample shifts
    const sampleResult = await pool.query(`
      SELECT id, location, city, latitude, longitude 
      FROM shifts 
      LIMIT 5
    `);
    
    console.log('\n=== Sample Shifts ===');
    sampleResult.rows.forEach(shift => {
      console.log(`ID: ${shift.id}`);
      console.log(`  Location: ${shift.location}, ${shift.city}`);
      console.log(`  Coordinates: ${shift.latitude ? `${shift.latitude}, ${shift.longitude}` : 'NULL'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCoordinates();

