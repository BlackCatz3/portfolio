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

    const result = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM analytics
       WHERE event_type = 'PAGE_VIEW'
         AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    return success({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Get chart data error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
