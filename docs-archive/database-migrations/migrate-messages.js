import pool from '../config/database.js';

const migrateMessages = async () => {
  try {
    console.log('Creating contact_messages table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);
      CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at DESC);
    `);

    console.log('✅ Contact messages table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateMessages();
