import { query } from './utils/database.js';
import { success, error } from './utils/response.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const { email, name } = JSON.parse(event.body);

    if (!email) {
      return error('Email is required', 400);
    }

    const existing = await query(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'active') {
        return error('Email already subscribed', 400);
      }
      // Reactivate subscription
      const result = await query(
        `UPDATE newsletter_subscribers 
         SET status = 'active', unsubscribed_at = NULL
         WHERE email = $1
         RETURNING *`,
        [email]
      );
      return success(result.rows[0]);
    }

    const result = await query(
      `INSERT INTO newsletter_subscribers (email, name)
       VALUES ($1, $2)
       RETURNING *`,
      [email, name]
    );

    return success(result.rows[0], 201);
  } catch (err) {
    console.error('Subscribe error:', err);
    return error('Internal server error', 500);
  }
};
