import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all experiences (public)
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await query(
        'SELECT * FROM experiences ORDER BY start_date DESC'
      );
      return success(result.rows);
    }

    // GET single experience (public)
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM experiences WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return error('Experience not found', 404);
      }
      return success(result.rows[0]);
    }

    // Protected routes
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // POST - Create experience
    if (httpMethod === 'POST') {
      const {
        company,
        position,
        description,
        start_date,
        end_date,
        is_current,
        location,
        order_index
      } = JSON.parse(event.body);

      if (!company || !position || !start_date) {
        return error('Company, position, and start_date are required', 400);
      }

      const result = await query(
        `INSERT INTO experiences 
         (company, position, description, start_date, end_date, is_current, location, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [company, position, description, start_date, end_date, is_current || false, location, order_index || 0]
      );

      return success(result.rows[0], 201);
    }

    // PUT - Update experience
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const {
        company,
        position,
        description,
        start_date,
        end_date,
        is_current,
        location,
        order_index
      } = JSON.parse(event.body);

      const result = await query(
        `UPDATE experiences 
         SET company = COALESCE($1, company),
             position = COALESCE($2, position),
             description = COALESCE($3, description),
             start_date = COALESCE($4, start_date),
             end_date = $5,
             is_current = COALESCE($6, is_current),
             location = COALESCE($7, location),
             order_index = COALESCE($8, order_index),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [company, position, description, start_date, end_date, is_current, location, order_index, id]
      );

      if (result.rows.length === 0) {
        return error('Experience not found', 404);
      }

      return success(result.rows[0]);
    }

    // DELETE - Delete experience
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return error('Experience not found', 404);
      }

      return success({ message: 'Experience deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Experiences error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
