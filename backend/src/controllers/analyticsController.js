import pool from '../config/database.js';

// Track event
export const trackEvent = async (req, res) => {
  try {
    const { event_type, page, project_id, blog_id } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('user-agent');

    await pool.query(
      `INSERT INTO analytics (event_type, page, project_id, blog_id, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [event_type, page || null, project_id || null, blog_id || null, ip_address, user_agent]
    );

    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    // Total views (page views)
    const totalViewsResult = await pool.query(
      `SELECT COUNT(*) as count FROM analytics WHERE event_type = 'PAGE_VIEW'`
    );

    // CV downloads
    const cvDownloadsResult = await pool.query(
      `SELECT COUNT(*) as count FROM analytics WHERE event_type = 'CV_DOWNLOAD'`
    );

    // Project views
    const projectViewsResult = await pool.query(
      `SELECT COUNT(DISTINCT project_id) as count FROM analytics 
       WHERE event_type = 'PROJECT_VIEW' AND project_id IS NOT NULL`
    );

    // Contact messages
    const contactMessagesResult = await pool.query(
      `SELECT COUNT(*) as count FROM messages`
    );

    res.json({
      success: true,
      data: {
        totalViews: parseInt(totalViewsResult.rows[0].count),
        cvDownloads: parseInt(cvDownloadsResult.rows[0].count),
        projectViews: parseInt(projectViewsResult.rows[0].count),
        contactMessages: parseInt(contactMessagesResult.rows[0].count),
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    
    const result = await pool.query(
      `SELECT id, event_type, page, project_id, blog_id, created_at
       FROM analytics
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get chart data (views per day for last 7 days)
export const getChartData = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM analytics
       WHERE event_type = 'PAGE_VIEW'
         AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
