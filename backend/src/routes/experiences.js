import express from 'express';
import {
  getAllExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experiencesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllExperiences);
router.get('/:id', getExperience);

// Protected routes (admin only)
router.post('/', authenticateToken, createExperience);
router.put('/:id', authenticateToken, updateExperience);
router.delete('/:id', authenticateToken, deleteExperience);

export default router;
