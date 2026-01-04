import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createRateLimitTables() {
  try {
    console.log('Creating rate limit tables...');
    
    const sql = fs.readFileSync(
      path.join(__dirname, 'create-rate-limit-settings.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Rate limit tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating rate limit tables:', error);
    process.exit(1);
  }
}

createRateLimitTables();
