import pool from '../config/database.js';

async function createCertificationsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating certifications table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        year VARCHAR(4) NOT NULL,
        icon_type VARCHAR(20) DEFAULT 'award',
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Certifications table created successfully');
    
    // Check if data already exists
    const checkResult = await client.query('SELECT COUNT(*) FROM certifications');
    const count = parseInt(checkResult.rows[0].count);
    
    if (count === 0) {
      // Insert default data
      console.log('Inserting default certifications...');
      
      await client.query(`
        INSERT INTO certifications (title, issuer, year, icon_type, display_order) VALUES
        ('AWS Certified Developer', 'Amazon Web Services', '2023', 'award', 1),
        ('Google UX Design Certificate', 'Google', '2022', 'trophy', 2),
        ('Meta Frontend Developer', 'Meta', '2021', 'award', 3)
      `);
      
      console.log('✅ Default certifications inserted');
    } else {
      console.log('ℹ️  Data already exists, skipping insert');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

createCertificationsTable()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
