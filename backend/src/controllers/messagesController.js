import pool from '../config/database.js';
import { body, validationResult } from 'express-validator';
import xss from 'xss';

// Validation rules for creating a message
export const validateMessage = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email is too long'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subject must not exceed 200 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
];

// Sanitize input to prevent XSS attacks
const sanitizeInput = (input) => {
  if (!input) return input;
  return xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
  });
};

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single message
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contact_messages WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create message (public endpoint for contact form)
export const createMessage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }

    let { name, email, subject, message } = req.body;

    // Sanitize all inputs to prevent XSS
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject || '');
    message = sanitizeInput(message);

    // Additional security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onerror, etc.
      /<iframe/i,
      /eval\(/i,
      /expression\(/i
    ];

    const allContent = `${name} ${email} ${subject} ${message}`;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(allContent)) {
        console.warn('Suspicious content detected:', { ip: req.ip, name, email });
        return res.status(400).json({ 
          error: 'Invalid content detected. Please remove any HTML or script tags.' 
        });
      }
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );

    // Log successful submission (for monitoring)
    console.log('Message received:', { 
      id: result.rows[0].id, 
      from: email, 
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update message status
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE contact_messages 
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
