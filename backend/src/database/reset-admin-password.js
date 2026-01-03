const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@4leafclover.id';
    const newPassword = process.env.ADMIN_PASSWORD || 'YourAdminPassword123!';
    
    console.log(`🔄 Resetting password for: ${email}\n`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE admins SET password = $1 WHERE email = $2 RETURNING id, email, name',
      [hashedPassword, email]
    );

    if (result.rows.length > 0) {
      console.log('✅ Password reset successful!');
      console.log(`   - Email: ${result.rows[0].email}`);
      console.log(`   - New Password: ${newPassword}\n`);
    } else {
      console.log(`❌ Admin with email ${email} not found!`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
