import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAbout);

// Protected routes (admin only)
router.put('/', authenticateToken, updateAbout);

export default router;
