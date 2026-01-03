import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  const { httpMethod, path } = event;
  const pathParts = path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  try {
    // GET all certifications (public)
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM certifications ORDER BY issue_date DESC');
      return success(result.rows);
    }

    // GET single certification (public)
    if (httpMethod === 'GET' && id.match(/^\d+$/)) {
      const result = await query('SELECT * FROM certifications WHERE id = $1', [id]);
      if (result.rows.length === 0) return error('Certification not found', 404);
      return success(result.rows[0]);
    }

    // Protected routes
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // POST - Create certification
    if (httpMethod === 'POST') {
      const { name, issuer, issue_date, expiry_date, credential_id, credential_url, logo_url } = JSON.parse(event.body);
      if (!name || !issuer) return error('Name and issuer are required', 400);

      const result = await query(
        `INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, credential_url, logo_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, issuer, issue_date, expiry_date, credential_id, credential_url, logo_url]
      );
      return success(result.rows[0], 201);
    }

    // PUT - Update certification
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { name, issuer, issue_date, expiry_date, credential_id, credential_url, logo_url } = JSON.parse(event.body);

      const result = await query(
        `UPDATE certifications 
         SET name = COALESCE($1, name),
             issuer = COALESCE($2, issuer),
             issue_date = COALESCE($3, issue_date),
             expiry_date = $4,
             credential_id = COALESCE($5, credential_id),
             credential_url = COALESCE($6, credential_url),
             logo_url = COALESCE($7, logo_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8 RETURNING *`,
        [name, issuer, issue_date, expiry_date, credential_id, credential_url, logo_url, id]
      );

      if (result.rows.length === 0) return error('Certification not found', 404);
      return success(result.rows[0]);
    }

    // DELETE - Delete certification
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return error('Certification not found', 404);
      return success({ message: 'Certification deleted successfully' });
    }

    return error('Method not allowed', 405);
  } catch (err) {
    console.error('Certifications error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
