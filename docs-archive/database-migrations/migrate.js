import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    let schema = fs.readFileSync(schemaPath, 'utf8');

    // Hash the admin password from env
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    
    // Replace the placeholder password hash with actual hash
    schema = schema.replace(
      '$2a$10$rQZ9vXqZ9vXqZ9vXqZ9vXuK8YqZ9vXqZ9vXqZ9vXqZ9vXqZ9vXqZ9u',
      hashedPassword
    );

    // Replace email if provided
    if (process.env.ADMIN_EMAIL) {
      schema = schema.replace('admin@portfolio.com', process.env.ADMIN_EMAIL);
    }

    // Execute schema
    await pool.query(schema);

    console.log('✅ Database migration completed successfully!');
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('⚠️  Please change the admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
