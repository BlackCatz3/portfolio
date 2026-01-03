import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  try {
    // GET about (public)
    if (event.httpMethod === 'GET') {
      const result = await query('SELECT * FROM about LIMIT 1');
      if (result.rows.length === 0) {
        return success({});
      }
      return success(result.rows[0]);
    }

    // PUT - Update about (protected)
    if (event.httpMethod === 'PUT') {
      const token = getTokenFromHeaders(event.headers);
      authenticateToken(token);

      const { title, bio, profile_image, resume_url, skills, headline } = JSON.parse(event.body);

      // Check if record exists
      const checkResult = await query('SELECT id FROM about LIMIT 1');

      let result;
      if (checkResult.rows.length === 0) {
        // Insert new record
        result = await query(
          `INSERT INTO about (title, bio, profile_image, resume_url, skills, headline)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [title, bio, profile_image, resume_url, skills, headline]
        );
      } else {
        // Update existing record
        result = await query(
          `UPDATE about 
           SET title = COALESCE($1, title),
               bio = COALESCE($2, bio),
               profile_image = COALESCE($3, profile_image),
               resume_url = COALESCE($4, resume_url),
               skills = COALESCE($5, skills),
               headline = COALESCE($6, headline),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [title, bio, profile_image, resume_url, skills, headline, checkResult.rows[0].id]
        );
      }

      return success(result.rows[0]);
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('About error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
