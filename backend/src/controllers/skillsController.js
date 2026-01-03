import pool from '../config/database.js';

// Get all skills
export const getAllSkills = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM skills ORDER BY order_index ASC, level DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single skill
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create skill
export const createSkill = async (req, res) => {
  try {
    const { name, level, category, order_index } = req.body;

    const result = await pool.query(
      `INSERT INTO skills (name, level, category, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, level || 50, category, order_index || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, category, order_index } = req.body;

    const result = await pool.query(
      `UPDATE skills 
       SET name = $1,
           level = $2,
           category = $3,
           order_index = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, level, category, order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
