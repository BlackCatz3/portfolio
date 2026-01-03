import { query } from './utils/database.js';
import { success, error } from './utils/response.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  if (event.httpMethod !== 'POST') {
    return error('Method not allowed', 405);
  }

  try {
    const { event_type, page, project_id, blog_id } = JSON.parse(event.body);
    const ip_address = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    const user_agent = event.headers['user-agent'] || 'unknown';

    await query(
      `INSERT INTO analytics (event_type, page, project_id, blog_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [event_type, page || null, project_id || null, blog_id || null, ip_address, user_agent]
    );

    return success({ success: true, message: 'Event tracked' });
  } catch (err) {
    console.error('Track event error:', err);
    return error('Internal server error', 500);
  }
};
