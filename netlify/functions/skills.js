import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all skills (public)
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM skills ORDER BY order_index ASC, created_at DESC');
      return success(result.rows);
    }

    // GET single skill (public)
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM skills WHERE id = $1', [id]);
      if (result.rows.length === 0) return error('Skill not found', 404);
      return success(result.rows[0]);
    }

    // Protected routes
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // POST - Create skill
    if (httpMethod === 'POST') {
      const { name, category, proficiency, icon, order_index } = JSON.parse(event.body);
      if (!name) return error('Name is required', 400);

      const result = await query(
        `INSERT INTO skills (name, category, proficiency, icon, order_index)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, category, proficiency || 0, icon, order_index || 0]
      );
      return success(result.rows[0], 201);
    }

    // PUT - Update skill
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { name, category, proficiency, icon, order_index } = JSON.parse(event.body);

      const result = await query(
        `UPDATE skills 
         SET name = COALESCE($1, name),
             category = COALESCE($2, category),
             proficiency = COALESCE($3, proficiency),
             icon = COALESCE($4, icon),
             order_index = COALESCE($5, order_index),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [name, category, proficiency, icon, order_index, id]
      );

      if (result.rows.length === 0) return error('Skill not found', 404);
      return success(result.rows[0]);
    }

    // DELETE - Delete skill
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return error('Skill not found', 404);
      return success({ message: 'Skill deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Skills error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
