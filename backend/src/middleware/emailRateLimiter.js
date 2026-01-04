import pool from '../config/database.js';

export const checkEmailRateLimit = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(); // Skip if no email provided (will be caught by validation)
    }
    
    // Get rate limit settings
    const settingsResult = await pool.query(
      'SELECT * FROM rate_limit_settings ORDER BY id DESC LIMIT 1'
    );
    
    // Use default settings if none exist
    const settings = settingsResult.rows[0] || {
      max_messages_per_email: 3,
      time_window_minutes: 60,
      enabled: true
    };
    
    // Skip if rate limiting is disabled
    if (!settings.enabled) {
      return next();
    }
    
    const { max_messages_per_email, time_window_minutes } = settings;
    
    // Check current rate limit for this email
    const rateLimitResult = await pool.query(
      `SELECT * FROM email_rate_limits 
       WHERE email = $1 
       AND last_message_at > CURRENT_TIMESTAMP - INTERVAL '${time_window_minutes} minutes'`,
      [email.toLowerCase()]
    );
    
    if (rateLimitResult.rows.length === 0) {
      // First message from this email in the time window
      await pool.query(
        `INSERT INTO email_rate_limits (email, message_count, first_message_at, last_message_at)
         VALUES ($1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (email) DO UPDATE
         SET message_count = 1,
             first_message_at = CURRENT_TIMESTAMP,
             last_message_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
        [email.toLowerCase()]
      );
      
      console.log(`✅ Email rate limit: ${email} - 1/${max_messages_per_email} messages`);
      return next();
    }
    
    const rateLimit = rateLimitResult.rows[0];
    
    // Check if limit exceeded
    if (rateLimit.message_count >= max_messages_per_email) {
      const minutesSinceFirst = Math.floor(
        (Date.now() - new Date(rateLimit.first_message_at).getTime()) / 1000 / 60
      );
      const minutesRemaining = Math.max(0, time_window_minutes - minutesSinceFirst);
      
      console.warn(`⚠️ Email rate limit exceeded: ${email} - ${rateLimit.message_count}/${max_messages_per_email} messages`);
      
      return res.status(429).json({
        error: `Too many messages from this email. Please try again in ${minutesRemaining} minutes.`,
        details: [`You can send up to ${max_messages_per_email} messages per ${time_window_minutes} minutes`]
      });
    }
    
    // Increment message count
    await pool.query(
      `UPDATE email_rate_limits 
       SET message_count = message_count + 1,
           last_message_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $1`,
      [email.toLowerCase()]
    );
    
    console.log(`✅ Email rate limit: ${email} - ${rateLimit.message_count + 1}/${max_messages_per_email} messages`);
    next();
  } catch (error) {
    console.error('Email rate limit check error:', error);
    // Don't block the request if rate limit check fails
    next();
  }
};

export default checkEmailRateLimit;
