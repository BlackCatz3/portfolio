import pool from '../config/database.js';

// Get contact info
export const getContact = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact information not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update contact info
export const updateContact = async (req, res) => {
  try {
    const { email, phone, location, linkedin_url, github_url, twitter_url, whatsapp_url } = req.body;

    // Check if contact record exists
    const checkResult = await pool.query('SELECT id FROM contact LIMIT 1');

    let result;
    if (checkResult.rows.length === 0) {
      // Create new record
      result = await pool.query(
        `INSERT INTO contact (email, phone, location, linkedin_url, github_url, twitter_url, whatsapp_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [email, phone, location, linkedin_url, github_url, twitter_url, whatsapp_url]
      );
    } else {
      // Update existing record
      const id = checkResult.rows[0].id;
      result = await pool.query(
        `UPDATE contact 
         SET email = $1,
             phone = $2,
             location = $3,
             linkedin_url = $4,
             github_url = $5,
             twitter_url = $6,
             whatsapp_url = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [email || '', phone || '', location || '', linkedin_url || '', github_url || '', twitter_url || '', whatsapp_url || '', id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
