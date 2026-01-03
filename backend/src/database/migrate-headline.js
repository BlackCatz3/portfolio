import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateHeadline() {
  try {
    console.log('🔄 Adding headline field to about table...');

    const sql = fs.readFileSync(
      path.join(__dirname, 'add-headline.sql'),
      'utf8'
    );

    await pool.query(sql);

    console.log('✅ Headline field added successfully!');
    console.log('📝 You can now manage the Hero headline from /admin/profile');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateHeadline();
