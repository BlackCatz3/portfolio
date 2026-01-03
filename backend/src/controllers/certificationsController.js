import pool from '../config/database.js';

// Get all certifications
export const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM certifications ORDER BY display_order ASC, year DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch certifications' });
  }
};

// Get single certification
export const getById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM certifications WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching certification:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch certification' });
  }
};

// Create certification
export const create = async (req, res) => {
  try {
    const { title, issuer, year, icon_type, display_order, certificate_url, image_url } = req.body;
    
    if (!title || !issuer || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, issuer, and year are required' 
      });
    }
    
    const result = await pool.query(
      'INSERT INTO certifications (title, issuer, year, icon_type, display_order, certificate_url, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [title, issuer, year, icon_type || 'award', display_order || 0, certificate_url || null, image_url || null]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Certification created successfully',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error creating certification:', error);
    res.status(500).json({ success: false, message: 'Failed to create certification' });
  }
};

// Update certification
export const update = async (req, res) => {
  try {
    const { title, issuer, year, icon_type, display_order, certificate_url, image_url } = req.body;
    
    if (!title || !issuer || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, issuer, and year are required' 
      });
    }
    
    const result = await pool.query(
      'UPDATE certifications SET title = $1, issuer = $2, year = $3, icon_type = $4, display_order = $5, certificate_url = $6, image_url = $7 WHERE id = $8',
      [title, issuer, year, icon_type || 'award', display_order || 0, certificate_url || null, image_url || null, req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    
    res.json({ success: true, message: 'Certification updated successfully' });
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(500).json({ success: false, message: 'Failed to update certification' });
  }
};

// Delete certification
export const deleteById = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM certifications WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }
    
    res.json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete certification' });
  }
};

