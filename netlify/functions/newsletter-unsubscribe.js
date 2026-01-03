import { query } from './utils/database.js';
import { success, error } from './utils/response.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const pathParts = event.path.split('/').filter(Boolean);
    const email = pathParts[pathParts.length - 1];

    const result = await query(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP
       WHERE email = $1
       RETURNING *`,
      [email]
    );

    if (result.rows.length === 0) {
      return error('Subscriber not found', 404);
    }

    return success({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return error('Internal server error', 500);
  }
};
