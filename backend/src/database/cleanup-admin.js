import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function cleanupAdmin() {
  try {
    console.log('🔄 Cleaning up admin accounts...\n');

    // 1. Delete old admin
    console.log('Deleting old admin (admin@portfolio.com)...');
    const deleteResult = await pool.query(
      'DELETE FROM admins WHERE email = $1',
      ['admin@portfolio.com']
    );
    console.log(`✅ Deleted ${deleteResult.rowCount} old admin(s)\n`);

    // 2. Check if new admin exists
    console.log('Checking for new admin (admin@4leafclover.id)...');
    const checkResult = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      ['admin@4leafclover.id']
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ New admin already exists\n');
    } else {
      // 3. Create new admin from environment variables
      console.log('Creating new admin from environment variables...');
      
      const email = process.env.ADMIN_EMAIL || 'admin@4leafclover.id';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        'INSERT INTO admins (email, password, name, created_at) VALUES ($1, $2, $3, NOW())',
        [email, hashedPassword, 'Admin']
      );
      
      console.log(`✅ New admin created: ${email}\n`);
    }

    // 4. Show all admins
    console.log('Current admin accounts:');
    const allAdmins = await pool.query('SELECT id, email, name, created_at FROM admins');
    console.table(allAdmins.rows);

    console.log('\n🎉 Admin cleanup completed successfully!');
    console.log('\nLogin credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@4leafclover.id'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    process.exit(1);
  }
}

cleanupAdmin();
