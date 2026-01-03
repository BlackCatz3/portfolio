import express from 'express';
import { getAboutInfo, updateAboutInfo } from '../controllers/aboutInfoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getAboutInfo);

// Protected route
router.put('/', authenticateToken, updateAboutInfo);

export default router;
