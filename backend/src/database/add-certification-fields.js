import pool from '../config/database.js';

async function addCertificationFields() {
  const client = await pool.connect();
  
  try {
    console.log('Adding certificate_url and image_url fields to certifications table...');
    
    // Add certificate_url field
    await client.query(`
      ALTER TABLE certifications 
      ADD COLUMN IF NOT EXISTS certificate_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `);
    
    console.log('✅ Fields added successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

addCertificationFields()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
