import pool from '../config/database.js';

// Get all blog posts (with optional filters)
export const getAllPosts = async (req, res) => {
  try {
    const { status, category, limit } = req.query;
    
    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ' ORDER BY order_index ASC, created_at DESC';

    if (limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single blog post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single blog post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment views
    await pool.query('UPDATE blog_posts SET views = views + 1 WHERE slug = $1', [slug]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new blog post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      tags,
      status,
      order_index
    } = req.body;

    // Check if slug already exists
    const existingPost = await pool.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
    if (existingPost.rows.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const published_at = status === 'published' ? new Date() : null;

    const result = await pool.query(
      `INSERT INTO blog_posts 
       (title, slug, excerpt, content, featured_image, category, tags, status, published_at, author_id, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [title, slug, excerpt, content, featured_image, category, tags, status, published_at, req.user?.id || 1, order_index || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update blog post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      tags,
      status,
      order_index
    } = req.body;

    // Check if post exists
    const existingPost = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (existingPost.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Check if slug is taken by another post
    if (slug && slug !== existingPost.rows[0].slug) {
      const slugCheck = await pool.query('SELECT id FROM blog_posts WHERE slug = $1 AND id != $2', [slug, id]);
      if (slugCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Update published_at if status changes to published
    let published_at = existingPost.rows[0].published_at;
    if (status === 'published' && existingPost.rows[0].status !== 'published') {
      published_at = new Date();
    }

    const result = await pool.query(
      `UPDATE blog_posts 
       SET title = $1,
           slug = $2,
           excerpt = $3,
           content = $4,
           featured_image = $5,
           category = $6,
           tags = $7,
           status = $8,
           published_at = $9,
           order_index = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        title || '',
        slug || '',
        excerpt || '',
        content || '',
        featured_image || '',
        category || '',
        tags || [],
        status || 'draft',
        published_at,
        order_index || 0,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete blog post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
