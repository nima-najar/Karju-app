/**
 * Script to delete old shifts and create 20 new shifts with future dates
 */

require('dotenv').config();
const pool = require('../config/database');
const { geocodeAddress } = require('../lib/geocoding');

// Sample shifts data with Tehran locations
const sampleShifts = [
  {
    title: 'گارسون رستوران',
    description: 'نیاز به گارسون با تجربه برای رستوران شیک در فرشته',
    industry: 'رستوران و پذیرایی',
    location: 'فرشته، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 500000, // 50,000 tomans per hour
    number_of_positions: 2,
  },
  {
    title: 'باریستا کافی‌شاپ',
    description: 'نیاز به باریستا حرفه‌ای برای کافی‌شاپ مدرن',
    industry: 'رستوران و پذیرایی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 600000,
    number_of_positions: 1,
  },
  {
    title: 'کارمند فروشگاه',
    description: 'نیاز به کارمند فروشگاه در شهرک غرب',
    industry: 'خرده‌فروشی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 450000,
    number_of_positions: 3,
  },
  {
    title: 'گارسون کافه',
    description: 'نیاز به گارسون برای کافه در ولنجک',
    industry: 'رستوران و پذیرایی',
    location: 'ولنجک، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 480000,
    number_of_positions: 2,
  },
  {
    title: 'کارمند رستوران',
    description: 'نیاز به کارمند برای رستوران در زعفرانیه',
    industry: 'رستوران و پذیرایی',
    location: 'زعفرانیه، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 520000,
    number_of_positions: 2,
  },
  {
    title: 'صندوقدار فروشگاه',
    description: 'نیاز به صندوقدار برای فروشگاه در فرشته',
    industry: 'خرده‌فروشی',
    location: 'فرشته، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 470000,
    number_of_positions: 1,
  },
  {
    title: 'گارسون رستوران',
    description: 'نیاز به گارسون برای رستوران در شهرک غرب',
    industry: 'رستوران و پذیرایی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 490000,
    number_of_positions: 2,
  },
  {
    title: 'کارمند کافی‌شاپ',
    description: 'نیاز به کارمند برای کافی‌شاپ در ولنجک',
    industry: 'رستوران و پذیرایی',
    location: 'ولنجک، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 510000,
    number_of_positions: 1,
  },
  {
    title: 'باریستا رستوران',
    description: 'نیاز به باریستا برای رستوران در زعفرانیه',
    industry: 'رستوران و پذیرایی',
    location: 'زعفرانیه، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 580000,
    number_of_positions: 1,
  },
  {
    title: 'کارمند فروشگاه',
    description: 'نیاز به کارمند برای فروشگاه در فرشته',
    industry: 'خرده‌فروشی',
    location: 'فرشته، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 460000,
    number_of_positions: 2,
  },
  {
    title: 'گارسون کافه',
    description: 'نیاز به گارسون برای کافه در شهرک غرب',
    industry: 'رستوران و پذیرایی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 500000,
    number_of_positions: 2,
  },
  {
    title: 'کارمند رستوران',
    description: 'نیاز به کارمند برای رستوران در ولنجک',
    industry: 'رستوران و پذیرایی',
    location: 'ولنجک، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 530000,
    number_of_positions: 1,
  },
  {
    title: 'صندوقدار فروشگاه',
    description: 'نیاز به صندوقدار برای فروشگاه در زعفرانیه',
    industry: 'خرده‌فروشی',
    location: 'زعفرانیه، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 480000,
    number_of_positions: 1,
  },
  {
    title: 'گارسون رستوران',
    description: 'نیاز به گارسون برای رستوران در فرشته',
    industry: 'رستوران و پذیرایی',
    location: 'فرشته، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 550000,
    number_of_positions: 2,
  },
  {
    title: 'کارمند کافی‌شاپ',
    description: 'نیاز به کارمند برای کافی‌شاپ در شهرک غرب',
    industry: 'رستوران و پذیرایی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 490000,
    number_of_positions: 1,
  },
  {
    title: 'باریستا کافه',
    description: 'نیاز به باریستا برای کافه در ولنجک',
    industry: 'رستوران و پذیرایی',
    location: 'ولنجک، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 600000,
    number_of_positions: 1,
  },
  {
    title: 'کارمند فروشگاه',
    description: 'نیاز به کارمند برای فروشگاه در زعفرانیه',
    industry: 'خرده‌فروشی',
    location: 'زعفرانیه، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 470000,
    number_of_positions: 2,
  },
  {
    title: 'گارسون رستوران',
    description: 'نیاز به گارسون برای رستوران در شهرک غرب',
    industry: 'رستوران و پذیرایی',
    location: 'شهرک غرب، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 520000,
    number_of_positions: 2,
  },
  {
    title: 'کارمند رستوران',
    description: 'نیاز به کارمند برای رستوران در فرشته',
    industry: 'رستوران و پذیرایی',
    location: 'فرشته، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 510000,
    number_of_positions: 1,
  },
  {
    title: 'صندوقدار فروشگاه',
    description: 'نیاز به صندوقدار برای فروشگاه در ولنجک',
    industry: 'خرده‌فروشی',
    location: 'ولنجک، تهران',
    city: 'Tehran',
    province: 'Tehran',
    hourly_wage: 490000,
    number_of_positions: 1,
  },
];

// Time slots for shifts
const timeSlots = [
  { start: '09:00', end: '13:00' },
  { start: '13:00', end: '17:00' },
  { start: '17:00', end: '21:00' },
  { start: '18:00', end: '22:00' },
  { start: '10:00', end: '14:00' },
  { start: '14:00', end: '18:00' },
  { start: '19:00', end: '23:00' },
];

async function seedShifts() {
  try {
    console.log('Starting shift seeding...');

    // Get a business to assign shifts to
    const businessResult = await pool.query(
      'SELECT id FROM businesses LIMIT 1'
    );

    if (businessResult.rows.length === 0) {
      console.error('No business found. Please create a business first.');
      process.exit(1);
    }

    const businessId = businessResult.rows[0].id;
    console.log(`Using business ID: ${businessId}`);

    // Delete all existing shifts
    console.log('\nDeleting all existing shifts...');
    const deleteResult = await pool.query('DELETE FROM shifts');
    console.log(`Deleted ${deleteResult.rowCount} shifts`);

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create 20 new shifts
    console.log('\nCreating 20 new shifts...');
    let created = 0;
    let failed = 0;

    for (let i = 0; i < 20; i++) {
      try {
        const shiftData = sampleShifts[i % sampleShifts.length];
        const timeSlot = timeSlots[i % timeSlots.length];

        // Calculate shift date (spread over next 30 days)
        const shiftDate = new Date(today);
        shiftDate.setDate(today.getDate() + Math.floor(i / 3) + 1); // Distribute over days

        const shiftDateStr = shiftDate.toISOString().split('T')[0];

        // Geocode address
        const fullAddress = `${shiftData.location}, ${shiftData.city}`;
        console.log(`\n[${i + 1}/20] Geocoding: ${fullAddress}`);
        const coordinates = await geocodeAddress(fullAddress);

        if (!coordinates) {
          console.warn(`⚠ Could not geocode ${fullAddress}, creating without coordinates`);
        }

        // Insert shift
        const result = await pool.query(
          `INSERT INTO shifts (
            business_id, title, description, industry, location, city, province,
            shift_date, start_time, end_time, hourly_wage, number_of_positions,
            latitude, longitude, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING id, shift_date`,
          [
            businessId,
            shiftData.title,
            shiftData.description,
            shiftData.industry,
            shiftData.location,
            shiftData.city,
            shiftData.province,
            shiftDateStr,
            timeSlot.start,
            timeSlot.end,
            shiftData.hourly_wage,
            shiftData.number_of_positions,
            coordinates?.latitude || null,
            coordinates?.longitude || null,
            'open',
          ]
        );

        console.log(`✓ Created shift: ${shiftData.title} on ${shiftDateStr} ${timeSlot.start}-${timeSlot.end}`);
        if (coordinates) {
          console.log(`  Coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
        }
        created++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`✗ Failed to create shift ${i + 1}:`, error.message);
        failed++;
      }
    }

    console.log(`\n=== Seeding Complete ===`);
    console.log(`Created: ${created}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${created + failed}`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

seedShifts();

