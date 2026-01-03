import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const secondLastPart = pathParts[pathParts.length - 2];

  try {
    // GET all posts (public)
    if (httpMethod === 'GET' && !lastPart.match(/^\d+$/) && secondLastPart !== 'slug') {
      const { status, category } = event.queryStringParameters || {};
      
      let queryText = 'SELECT * FROM blog_posts';
      let params = [];
      let conditions = [];
      
      if (status) {
        conditions.push(`status = $${params.length + 1}`);
        params.push(status);
      }
      
      if (category) {
        conditions.push(`category = $${params.length + 1}`);
        params.push(category);
      }
      
      if (conditions.length > 0) {
        queryText += ' WHERE ' + conditions.join(' AND ');
      }
      
      queryText += ' ORDER BY published_at DESC, created_at DESC';
      
      const result = await query(queryText, params);
      return success(result.rows);
    }

    // GET post by slug (public)
    if (httpMethod === 'GET' && secondLastPart === 'slug') {
      const slug = lastPart;
      const result = await query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      if (result.rows.length === 0) return error('Post not found', 404);
      return success(result.rows[0]);
    }

    // GET single post by ID (public)
    if (httpMethod === 'GET' && lastPart.match(/^\d+$/)) {
      const result = await query('SELECT * FROM blog_posts WHERE id = $1', [lastPart]);
      if (result.rows.length === 0) return error('Post not found', 404);
      return success(result.rows[0]);
    }

    // Protected routes
    const token = getTokenFromHeaders(event.headers);
    const user = authenticateToken(token);

    // POST - Create post
    if (httpMethod === 'POST') {
      const { title, slug, excerpt, content, featured_image, category, tags, status, published_at } = JSON.parse(event.body);
      
      if (!title || !slug || !content) {
        return error('Title, slug, and content are required', 400);
      }

      const result = await query(
        `INSERT INTO blog_posts 
         (title, slug, excerpt, content, featured_image, category, tags, status, published_at, author_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [title, slug, excerpt, content, featured_image, category, tags, status || 'draft', published_at, user.id]
      );

      return success(result.rows[0], 201);
    }

    // PUT - Update post
    if (httpMethod === 'PUT' && lastPart.match(/^\d+$/)) {
      const { title, slug, excerpt, content, featured_image, category, tags, status, published_at } = JSON.parse(event.body);

      const result = await query(
        `UPDATE blog_posts 
         SET title = COALESCE($1, title),
             slug = COALESCE($2, slug),
             excerpt = COALESCE($3, excerpt),
             content = COALESCE($4, content),
             featured_image = COALESCE($5, featured_image),
             category = COALESCE($6, category),
             tags = COALESCE($7, tags),
             status = COALESCE($8, status),
             published_at = COALESCE($9, published_at),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $10
         RETURNING *`,
        [title, slug, excerpt, content, featured_image, category, tags, status, published_at, lastPart]
      );

      if (result.rows.length === 0) return error('Post not found', 404);
      return success(result.rows[0]);
    }

    // DELETE - Delete post
    if (httpMethod === 'DELETE' && lastPart.match(/^\d+$/)) {
      const result = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [lastPart]);
      if (result.rows.length === 0) return error('Post not found', 404);
      return success({ message: 'Post deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Blog posts error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
