import pool from '../config/database.js';

// Get about info (for About Section)
export const getAboutInfo = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_info LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About information not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get about info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update about info (for About Section)
export const updateAboutInfo = async (req, res) => {
  try {
    const { content, image_url } = req.body;

    // Check if about_info record exists
    const checkResult = await pool.query('SELECT id FROM about_info LIMIT 1');

    let result;
    if (checkResult.rows.length === 0) {
      // Create new record
      result = await pool.query(
        `INSERT INTO about_info (content, image_url)
         VALUES ($1, $2)
         RETURNING *`,
        [content, image_url]
      );
    } else {
      // Update existing record
      const id = checkResult.rows[0].id;
      result = await pool.query(
        `UPDATE about_info 
         SET content = $1,
             image_url = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [content || '', image_url || '', id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update about info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
