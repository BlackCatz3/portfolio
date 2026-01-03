import express from 'express';
import {
  getAllSubscribers,
  subscribe,
  unsubscribe,
  deleteSubscriber
} from '../controllers/newsletterController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe/:email', unsubscribe);

// Protected routes
router.get('/subscribers', authenticateToken, getAllSubscribers);
router.delete('/subscribers/:id', authenticateToken, deleteSubscriber);

export default router;
