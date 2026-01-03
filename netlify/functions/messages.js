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
    // POST - Create message (public - contact form)
    if (httpMethod === 'POST' && !path.includes('/status')) {
      const { name, email, subject, message } = JSON.parse(event.body);

      if (!name || !email || !message) {
        return error('Name, email, and message are required', 400);
      }

      const result = await query(
        `INSERT INTO messages (name, email, subject, message, status)
         VALUES ($1, $2, $3, $4, 'unread')
         RETURNING *`,
        [name, email, subject, message]
      );

      // Track analytics
      try {
        await query(
          `INSERT INTO analytics (event_type, event_data)
           VALUES ('message_sent', $1)`,
          [JSON.stringify({ name, email, subject })]
        );
      } catch (analyticsError) {
        console.error('Analytics tracking error:', analyticsError);
      }

      return success(result.rows[0], 201);
    }

    // Protected routes - require authentication
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // GET all messages
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await query(
        'SELECT * FROM messages ORDER BY created_at DESC'
      );
      return success(result.rows);
    }

    // GET single message
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM messages WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return error('Message not found', 404);
      }
      return success(result.rows[0]);
    }

    // PATCH - Update message status
    if (httpMethod === 'PATCH' && path.includes('/status')) {
      const messageId = pathParts[pathParts.length - 2];
      const { status } = JSON.parse(event.body);

      if (!status) {
        return error('Status is required', 400);
      }

      const result = await query(
        `UPDATE messages 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, messageId]
      );

      if (result.rows.length === 0) {
        return error('Message not found', 404);
      }

      return success(result.rows[0]);
    }

    // DELETE - Delete message
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM messages WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return error('Message not found', 404);
      }

      return success({ message: 'Message deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Messages error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
