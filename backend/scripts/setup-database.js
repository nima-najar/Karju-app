const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default postgres db first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function setupDatabase() {
  try {
    console.log('Setting up Karju database...');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'karju_db';
    try {
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✓ Database '${dbName}' created`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`✓ Database '${dbName}' already exists`);
      } else {
        throw error;
      }
    }

    // Close connection to default database
    await pool.end();

    // Connect to the new database
    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await dbPool.query(schema);
    console.log('✓ Database schema created');

    // Read and execute seed data
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await dbPool.query(seed);
    console.log('✓ Seed data inserted');

    await dbPool.end();
    console.log('\n✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();



