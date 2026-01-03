import express from 'express';
import * as certificationsController from '../controllers/certificationsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', certificationsController.getAll);
router.get('/:id', certificationsController.getById);

// Protected routes (require authentication)
router.post('/', authenticateToken, certificationsController.create);
router.put('/:id', authenticateToken, certificationsController.update);
router.delete('/:id', authenticateToken, certificationsController.deleteById);

export default router;

