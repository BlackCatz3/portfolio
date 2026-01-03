import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateAboutInfo() {
  try {
    console.log('🔄 Creating about_info table for About Section...');

    const sql = fs.readFileSync(
      path.join(__dirname, 'create-about-info.sql'),
      'utf8'
    );

    await pool.query(sql);

    console.log('✅ about_info table created successfully!');
    console.log('📝 Now you can manage About Section separately from Home Section');
    console.log('');
    console.log('📍 Admin locations:');
    console.log('   - Home Section data: /admin/profile');
    console.log('   - About Section data: /admin/about-info (will be created)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateAboutInfo();
