import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405);
  }

  try {
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    const { limit = '50' } = event.queryStringParameters || {};
    
    const result = await query(
      `SELECT id, event_type, page, project_id, blog_id, created_at
       FROM analytics
       ORDER BY created_at DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    return success({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Get recent activities error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
