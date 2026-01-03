import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  try {
    // GET about info (public)
    if (event.httpMethod === 'GET') {
      const result = await query('SELECT * FROM about_info LIMIT 1');
      
      if (result.rows.length === 0) {
        return success({});
      }

      return success(result.rows[0]);
    }

    // PUT - Update about info (protected)
    if (event.httpMethod === 'PUT') {
      const token = getTokenFromHeaders(event.headers);
      authenticateToken(token);

      const { title, bio } = JSON.parse(event.body);

      // Check if record exists
      const checkResult = await query('SELECT id FROM about_info LIMIT 1');

      let result;
      if (checkResult.rows.length === 0) {
        // Create new record
        result = await query(
          `INSERT INTO about_info (title, bio)
           VALUES ($1, $2)
           RETURNING *`,
          [title, bio]
        );
      } else {
        // Update existing record
        const id = checkResult.rows[0].id;
        result = await query(
          `UPDATE about_info 
           SET title = $1,
               bio = $2,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $3
           RETURNING *`,
          [title || '', bio || '', id]
        );
      }

      return success(result.rows[0]);
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('About info error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
