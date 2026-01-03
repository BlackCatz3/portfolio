import pool from '../config/database.js';

// Get about info
export const getAbout = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'About information not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update about info
export const updateAbout = async (req, res) => {
  try {
    const { title, bio, headline, profile_image, resume_url, skills } = req.body;

    // Check if about record exists
    const checkResult = await pool.query('SELECT id FROM about LIMIT 1');

    let result;
    if (checkResult.rows.length === 0) {
      // Create new record
      result = await pool.query(
        `INSERT INTO about (title, bio, headline, profile_image, resume_url, skills)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, bio, headline, profile_image, resume_url, skills]
      );
    } else {
      // Update existing record
      const id = checkResult.rows[0].id;
      result = await pool.query(
        `UPDATE about 
         SET title = $1,
             bio = $2,
             headline = $3,
             profile_image = $4,
             resume_url = $5,
             skills = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [title || '', bio || '', headline || '', profile_image || '', resume_url || '', skills || [], id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
