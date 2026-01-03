import pool from '../config/database.js';

// Get all subscribers
export const getAllSubscribers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Subscribe
export const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    const existing = await pool.query(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].status === 'active') {
        return res.status(400).json({ error: 'Email already subscribed' });
      }
      // Reactivate subscription
      const result = await pool.query(
        `UPDATE newsletter_subscribers 
         SET status = 'active', unsubscribed_at = NULL
         WHERE email = $1
         RETURNING *`,
        [email]
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (email, name)
       VALUES ($1, $2)
       RETURNING *`,
      [email, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unsubscribe
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      `UPDATE newsletter_subscribers 
       SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP
       WHERE email = $1
       RETURNING *`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete subscriber
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
