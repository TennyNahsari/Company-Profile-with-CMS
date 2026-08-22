const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function runMigration() {
  console.log('🔄 Executing PostgreSQL Database Migration...');
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  try {
    const client = await pool.connect();
    await client.query(sql);
    client.release();
    console.log('✅ PostgreSQL Schema Migration & Initial Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
    process.exit(1);
  }
}

runMigration();
