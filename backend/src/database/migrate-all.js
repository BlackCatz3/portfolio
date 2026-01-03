import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateAll() {
  try {
    console.log('🔄 Starting database migration...\n');

    // 1. Messages table
    console.log('Creating messages table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`);
    console.log('✅ Messages table created\n');

    // 2. Analytics table
    console.log('Creating analytics table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        page VARCHAR(255),
        project_id INTEGER,
        blog_id INTEGER,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`);
    console.log('✅ Analytics table created\n');

    // 3. Certifications table
    console.log('Creating certifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        description TEXT,
        certificate_url VARCHAR(500),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Certifications table created\n');

    // 4. Add whatsapp_url to contact table
    console.log('Adding whatsapp_url to contact table...');
    try {
      await pool.query(`
        ALTER TABLE contact 
        ADD COLUMN IF NOT EXISTS whatsapp_url VARCHAR(255)
      `);
      console.log('✅ Contact table updated\n');
    } catch (error) {
      if (error.code === '42701') {
        console.log('⚠️  whatsapp_url column already exists\n');
      } else {
        throw error;
      }
    }

    // 5. Add project_id to testimonials table
    console.log('Adding project_id to testimonials table...');
    try {
      await pool.query(`
        ALTER TABLE testimonials 
        ADD COLUMN IF NOT EXISTS project_id INTEGER
      `);
      console.log('✅ Testimonials table updated\n');
    } catch (error) {
      if (error.code === '42701') {
        console.log('⚠️  project_id column already exists\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateAll();
