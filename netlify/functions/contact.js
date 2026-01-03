import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  try {
    // GET contact (public)
    if (event.httpMethod === 'GET') {
      const result = await query('SELECT * FROM contact LIMIT 1');
      if (result.rows.length === 0) {
        return success({});
      }
      return success(result.rows[0]);
    }

    // PUT - Update contact (protected)
    if (event.httpMethod === 'PUT') {
      const token = getTokenFromHeaders(event.headers);
      authenticateToken(token);

      const {
        email,
        phone,
        location,
        linkedin_url,
        github_url,
        twitter_url,
        instagram_url,
        facebook_url,
        whatsapp_url
      } = JSON.parse(event.body);

      // Check if record exists
      const checkResult = await query('SELECT id FROM contact LIMIT 1');

      let result;
      if (checkResult.rows.length === 0) {
        // Insert new record
        result = await query(
          `INSERT INTO contact 
           (email, phone, location, linkedin_url, github_url, twitter_url, instagram_url, facebook_url, whatsapp_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
          [email, phone, location, linkedin_url, github_url, twitter_url, instagram_url, facebook_url, whatsapp_url]
        );
      } else {
        // Update existing record
        result = await query(
          `UPDATE contact 
           SET email = COALESCE($1, email),
               phone = COALESCE($2, phone),
               location = COALESCE($3, location),
               linkedin_url = COALESCE($4, linkedin_url),
               github_url = COALESCE($5, github_url),
               twitter_url = COALESCE($6, twitter_url),
               instagram_url = COALESCE($7, instagram_url),
               facebook_url = COALESCE($8, facebook_url),
               whatsapp_url = COALESCE($9, whatsapp_url),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $10
           RETURNING *`,
          [email, phone, location, linkedin_url, github_url, twitter_url, instagram_url, facebook_url, whatsapp_url, checkResult.rows[0].id]
        );
      }

      return success(result.rows[0]);
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Contact error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
