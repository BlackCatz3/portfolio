import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  const { httpMethod, path, queryStringParameters } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all testimonials (public)
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const { project_id } = queryStringParameters || {};
      
      let queryText = 'SELECT * FROM testimonials';
      let params = [];
      
      if (project_id) {
        queryText += ' WHERE project_id = $1';
        params.push(project_id);
      }
      
      queryText += ' ORDER BY order_index ASC, created_at DESC';
      
      const result = await query(queryText, params);
      return success(result.rows);
    }

    // GET single testimonial (public)
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM testimonials WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return error('Testimonial not found', 404);
      }
      return success(result.rows[0]);
    }

    // Protected routes
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // POST - Create testimonial
    if (httpMethod === 'POST') {
      const { name, position, company, content, avatar_url, rating, featured, order_index, project_id } = JSON.parse(event.body);

      const result = await query(
        `INSERT INTO testimonials (name, position, company, content, avatar_url, rating, featured, order_index, project_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [name, position, company, content, avatar_url, rating || 5, featured || false, order_index || 0, project_id || null]
      );

      return success(result.rows[0], 201);
    }

    // PUT - Update testimonial
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { name, position, company, content, avatar_url, rating, featured, order_index, project_id } = JSON.parse(event.body);

      const result = await query(
        `UPDATE testimonials 
         SET name = $1,
             position = $2,
             company = $3,
             content = $4,
             avatar_url = $5,
             rating = $6,
             featured = $7,
             order_index = $8,
             project_id = $9,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [name, position, company, content, avatar_url, rating, featured, order_index, project_id, id]
      );

      if (result.rows.length === 0) {
        return error('Testimonial not found', 404);
      }

      return success(result.rows[0]);
    }

    // DELETE - Delete testimonial
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return error('Testimonial not found', 404);
      }

      return success({ message: 'Testimonial deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Testimonials error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
