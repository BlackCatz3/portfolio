import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return success({}, 200);
  }

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all projects (public)
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await query(
        'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC'
      );
      return success(result.rows);
    }

    // GET single project (public)
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return error('Project not found', 404);
      }
      return success(result.rows[0]);
    }

    // Protected routes - require authentication
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // POST - Create project
    if (httpMethod === 'POST') {
      const {
        title,
        description,
        image_url,
        project_url,
        github_url,
        technologies,
        category,
        featured,
        order_index
      } = JSON.parse(event.body);

      if (!title) {
        return error('Title is required', 400);
      }

      const result = await query(
        `INSERT INTO projects 
         (title, description, image_url, project_url, github_url, technologies, category, featured, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [title, description, image_url, project_url, github_url, technologies, category, featured || false, order_index || 0]
      );

      return success(result.rows[0], 201);
    }

    // PUT - Update project
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const {
        title,
        description,
        image_url,
        project_url,
        github_url,
        technologies,
        category,
        featured,
        order_index
      } = JSON.parse(event.body);

      const result = await query(
        `UPDATE projects 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             image_url = COALESCE($3, image_url),
             project_url = COALESCE($4, project_url),
             github_url = COALESCE($5, github_url),
             technologies = COALESCE($6, technologies),
             category = COALESCE($7, category),
             featured = COALESCE($8, featured),
             order_index = COALESCE($9, order_index),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [title, description, image_url, project_url, github_url, technologies, category, featured, order_index, id]
      );

      if (result.rows.length === 0) {
        return error('Project not found', 404);
      }

      return success(result.rows[0]);
    }

    // DELETE - Delete project
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return error('Project not found', 404);
      }

      return success({ message: 'Project deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Projects error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
