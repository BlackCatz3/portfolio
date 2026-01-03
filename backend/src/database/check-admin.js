const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Checking admin accounts...\n');

    // Check existing admins
    const result = await pool.query('SELECT id, email, name FROM admins');
    
    if (result.rows.length > 0) {
      console.log('✅ Found admin accounts:');
      result.rows.forEach(admin => {
        console.log(`   - ID: ${admin.id}`);
        console.log(`   - Email: ${admin.email}`);
        console.log(`   - Name: ${admin.name}\n`);
      });
    } else {
      console.log('⚠️  No admin accounts found!');
      console.log('Creating admin account from environment variables...\n');

      const email = process.env.ADMIN_EMAIL || 'admin@4leafclover.id';
      const password = process.env.ADMIN_PASSWORD || 'YourAdminPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3)',
        [email, hashedPassword, 'Admin']
      );

      console.log('✅ Admin account created:');
      console.log(`   - Email: ${email}`);
      console.log(`   - Password: ${password}\n`);
    }

    console.log('🎉 Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateAdmin();
