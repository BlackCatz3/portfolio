import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405);
  }

  try {
    const token = getTokenFromHeaders(event.headers);
    const user = authenticateToken(token);

    const result = await query(
      'SELECT id, email, name, created_at FROM admins WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return error('Admin not found', 404);
    }

    return success(result.rows[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
