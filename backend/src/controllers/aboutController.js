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
    const { name, title, bio, headline, profile_image, resume_url, skills, availability_status } = req.body;

    // Check if about record exists
    const checkResult = await pool.query('SELECT id FROM about LIMIT 1');

    let result;
    if (checkResult.rows.length === 0) {
      // Create new record
      result = await pool.query(
        `INSERT INTO about (name, title, bio, headline, profile_image, resume_url, skills, availability_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, title, bio, headline, profile_image, resume_url, skills, availability_status || 'Available for work']
      );
    } else {
      // Update existing record
      const id = checkResult.rows[0].id;
      result = await pool.query(
        `UPDATE about 
         SET name = $1,
             title = $2,
             bio = $3,
             headline = $4,
             profile_image = $5,
             resume_url = $6,
             skills = $7,
             availability_status = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [name || '', title || '', bio || '', headline || '', profile_image || '', resume_url || '', skills || [], availability_status || 'Available for work', id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
