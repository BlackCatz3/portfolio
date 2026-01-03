import pool from '../config/database.js';

// Get all experiences
export const getAllExperiences = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experiences ORDER BY order_index ASC, start_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single experience
export const getExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM experiences WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create experience
export const createExperience = async (req, res) => {
  try {
    const {
      company,
      position,
      description,
      start_date,
      end_date,
      is_current,
      location,
      order_index
    } = req.body;

    if (!company || !position || !start_date) {
      return res.status(400).json({ error: 'Company, position, and start date are required' });
    }

    const result = await pool.query(
      `INSERT INTO experiences 
       (company, position, description, start_date, end_date, is_current, location, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [company, position, description, start_date, end_date, is_current || false, location, order_index || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      description,
      start_date,
      end_date,
      is_current,
      location,
      order_index
    } = req.body;

    const result = await pool.query(
      `UPDATE experiences 
       SET company = COALESCE($1, company),
           position = COALESCE($2, position),
           description = COALESCE($3, description),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           is_current = COALESCE($6, is_current),
           location = COALESCE($7, location),
           order_index = COALESCE($8, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [company, position, description, start_date, end_date, is_current, location, order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM experiences WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
