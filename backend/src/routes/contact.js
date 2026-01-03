import express from 'express';
import { getContact, updateContact } from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getContact);

// Protected routes (admin only)
router.put('/', authenticateToken, updateContact);

export default router;
