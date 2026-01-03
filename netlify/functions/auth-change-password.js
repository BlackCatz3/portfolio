import bcrypt from 'bcryptjs';
import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const token = getTokenFromHeaders(event.headers);
    const user = authenticateToken(token);

    const { currentPassword, newPassword } = JSON.parse(event.body);

    if (!currentPassword || !newPassword) {
      return error('Current and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return error('New password must be at least 6 characters', 400);
    }

    // Get current admin
    const result = await query(
      'SELECT * FROM admins WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return error('Admin not found', 404);
    }

    const admin = result.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);

    if (!isValidPassword) {
      return error('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE admins SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, user.id]
    );

    return success({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
