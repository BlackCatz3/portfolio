import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function addWhatsAppField() {
  try {
    console.log('🔄 Adding whatsapp_url field to contact table...');
    
    // Add whatsapp_url column to contact table
    await pool.query(`
      ALTER TABLE contact 
      ADD COLUMN IF NOT EXISTS whatsapp_url VARCHAR(255)
    `);
    
    console.log('✅ Successfully added whatsapp_url field to contact table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding whatsapp_url field:', error);
    process.exit(1);
  }
}

addWhatsAppField();
