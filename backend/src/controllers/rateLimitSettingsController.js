import pool from '../config/database.js';

// Get rate limit settings
export const getRateLimitSettings = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rate_limit_settings ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        max_messages_per_email: 3,
        time_window_minutes: 60,
        enabled: true
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get rate limit settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update rate limit settings
export const updateRateLimitSettings = async (req, res) => {
  try {
    const { max_messages_per_email, time_window_minutes, enabled } = req.body;
    
    // Validation
    if (max_messages_per_email !== undefined) {
      if (!Number.isInteger(max_messages_per_email) || max_messages_per_email < 1 || max_messages_per_email > 100) {
        return res.status(400).json({ 
          error: 'max_messages_per_email must be an integer between 1 and 100' 
        });
      }
    }
    
    if (time_window_minutes !== undefined) {
      if (!Number.isInteger(time_window_minutes) || time_window_minutes < 1 || time_window_minutes > 1440) {
        return res.status(400).json({ 
          error: 'time_window_minutes must be an integer between 1 and 1440 (24 hours)' 
        });
      }
    }
    
    if (enabled !== undefined && typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        error: 'enabled must be a boolean' 
      });
    }
    
    // Check if settings exist
    const checkResult = await pool.query('SELECT id FROM rate_limit_settings LIMIT 1');
    
    let result;
    if (checkResult.rows.length === 0) {
      // Insert new settings
      result = await pool.query(
        `INSERT INTO rate_limit_settings (max_messages_per_email, time_window_minutes, enabled)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          max_messages_per_email || 3,
          time_window_minutes || 60,
          enabled !== undefined ? enabled : true
        ]
      );
    } else {
      // Update existing settings
      const updates = [];
      const values = [];
      let paramCount = 1;
      
      if (max_messages_per_email !== undefined) {
        updates.push(`max_messages_per_email = $${paramCount++}`);
        values.push(max_messages_per_email);
      }
      
      if (time_window_minutes !== undefined) {
        updates.push(`time_window_minutes = $${paramCount++}`);
        values.push(time_window_minutes);
      }
      
      if (enabled !== undefined) {
        updates.push(`enabled = $${paramCount++}`);
        values.push(enabled);
      }
      
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      
      result = await pool.query(
        `UPDATE rate_limit_settings 
         SET ${updates.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        [...values, checkResult.rows[0].id]
      );
    }
    
    console.log('Rate limit settings updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update rate limit settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get email rate limit stats (for admin monitoring)
export const getEmailRateLimitStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        email,
        message_count,
        first_message_at,
        last_message_at,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - first_message_at)) / 60 as minutes_since_first
       FROM email_rate_limits
       WHERE last_message_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
       ORDER BY last_message_at DESC
       LIMIT 100`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get email rate limit stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear email rate limit for specific email (admin can reset)
export const clearEmailRateLimit = async (req, res) => {
  try {
    const { email } = req.params;
    
    await pool.query('DELETE FROM email_rate_limits WHERE email = $1', [email]);
    
    console.log(`Rate limit cleared for email: ${email}`);
    res.json({ message: 'Rate limit cleared successfully' });
  } catch (error) {
    console.error('Clear email rate limit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cleanup old rate limit records (can be run as cron job)
export const cleanupOldRateLimits = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM email_rate_limits 
       WHERE last_message_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
       RETURNING *`
    );
    
    console.log(`Cleaned up ${result.rowCount} old rate limit records`);
    res.json({ 
      message: 'Cleanup completed',
      deleted_count: result.rowCount 
    });
  } catch (error) {
    console.error('Cleanup old rate limits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
