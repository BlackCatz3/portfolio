import { query } from './utils/database.js';
import { success, error } from './utils/response.js';
import { authenticateToken, getTokenFromHeaders } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return success({}, 200);

  if (event.httpMethod !== 'GET') {
    return error('Method not allowed', 405);
  }

  try {
    const token = getTokenFromHeaders(event.headers);
    authenticateToken(token);

    // Total views (page views)
    const totalViewsResult = await query(
      `SELECT COUNT(*) as count FROM analytics WHERE event_type = 'PAGE_VIEW'`
    );

    // CV downloads
    const cvDownloadsResult = await query(
      `SELECT COUNT(*) as count FROM analytics WHERE event_type = 'CV_DOWNLOAD'`
    );

    // Project views
    const projectViewsResult = await query(
      `SELECT COUNT(DISTINCT project_id) as count FROM analytics 
       WHERE event_type = 'PROJECT_VIEW' AND project_id IS NOT NULL`
    );

    // Contact messages
    const contactMessagesResult = await query(
      `SELECT COUNT(*) as count FROM messages`
    );

    return success({
      success: true,
      data: {
        totalViews: parseInt(totalViewsResult.rows[0].count),
        cvDownloads: parseInt(cvDownloadsResult.rows[0].count),
        projectViews: parseInt(projectViewsResult.rows[0].count),
        contactMessages: parseInt(contactMessagesResult.rows[0].count),
      }
    });
  } catch (err) {
    console.error('Get statistics error:', err);
    if (err.message === 'Access token required' || err.message === 'Invalid or expired token') {
      return error(err.message, 401);
    }
    return error('Internal server error', 500);
  }
};
