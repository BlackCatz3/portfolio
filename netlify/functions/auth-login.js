import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './utils/database.js';
import { success, error } from './utils/response.js';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return error('Email and password are required', 400);
    }

    // Find admin by email
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return error('Invalid credentials', 401);
    }

    const admin = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return error('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return success({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return error('Internal server error', 500);
  }
};
