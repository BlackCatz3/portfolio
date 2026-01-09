import pool from '../config/database.js';

const migrateTestimonials = async () => {
  try {
    console.log('Creating testimonials table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        avatar_url VARCHAR(500),
        rating INTEGER DEFAULT 5,
        featured BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
    `);

    console.log('✅ Testimonials table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateTestimonials();
