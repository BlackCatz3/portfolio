import pool from '../config/database.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single project
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      project_url,
      github_url,
      technologies,
      category,
      featured,
      order_index
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO projects 
       (title, description, image_url, project_url, github_url, technologies, category, featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, image_url, project_url, github_url, technologies, category, featured || false, order_index || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      image_url,
      project_url,
      github_url,
      technologies,
      category,
      featured,
      order_index
    } = req.body;

    const result = await pool.query(
      `UPDATE projects 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           project_url = COALESCE($4, project_url),
           github_url = COALESCE($5, github_url),
           technologies = COALESCE($6, technologies),
           category = COALESCE($7, category),
           featured = COALESCE($8, featured),
           order_index = COALESCE($9, order_index),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [title, description, image_url, project_url, github_url, technologies, category, featured, order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
