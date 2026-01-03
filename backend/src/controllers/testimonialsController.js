import pool from '../config/database.js';

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const { project_id } = req.query;
    
    let query = 'SELECT * FROM testimonials';
    let params = [];
    
    if (project_id) {
      query += ' WHERE project_id = $1';
      params.push(project_id);
    }
    
    query += ' ORDER BY order_index ASC, created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single testimonial
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, position, company, content, avatar_url, rating, featured, order_index, project_id } = req.body;

    const result = await pool.query(
      `INSERT INTO testimonials (name, position, company, content, avatar_url, rating, featured, order_index, project_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, position, company, content, avatar_url, rating || 5, featured || false, order_index || 0, project_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, company, content, avatar_url, rating, featured, order_index, project_id } = req.body;

    const result = await pool.query(
      `UPDATE testimonials 
       SET name = $1,
           position = $2,
           company = $3,
           content = $4,
           avatar_url = $5,
           rating = $6,
           featured = $7,
           order_index = $8,
           project_id = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, position, company, content, avatar_url, rating, featured, order_index, project_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
