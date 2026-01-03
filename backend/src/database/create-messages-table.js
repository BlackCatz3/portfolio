import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createMessagesTable() {
  try {
    console.log('🔄 Creating messages table...');
    
    // Create messages table
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
    
    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    `);
    
    console.log('✅ Successfully created messages table');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating messages table:', error);
    process.exit(1);
  }
}

createMessagesTable();
