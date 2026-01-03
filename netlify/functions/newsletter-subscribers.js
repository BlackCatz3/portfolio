import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all subscribers (protected)
    if (httpMethod === 'GET') {
      const token = getTokenFromHeaders(event.headers);
      authenticateToken(token);

      const result = await query(
        'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC'
      );
      return success(result.rows);
    }

    // DELETE subscriber (protected)
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const token = getTokenFromHeaders(event.headers);
      authenticateToken(token);

      const result = await query(
        'DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return error('Subscriber not found', 404);
      }

      return success({ message: 'Subscriber deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Newsletter subscribers error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
