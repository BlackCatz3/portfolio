import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createAnalyticsTable() {
  try {
    console.log('🔄 Creating analytics table...');
    
    // Create analytics table
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
    
    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
    `);
    
    console.log('✅ Successfully created analytics table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating analytics table:', error);
    process.exit(1);
  }
}

createAnalyticsTable();
