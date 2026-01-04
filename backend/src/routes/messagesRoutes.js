import express from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage,
  validateMessage
} from '../controllers/messagesController.js';
import { authenticateToken } from '../middleware/auth.js';
import { contactFormLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route with rate limiting and validation
router.post('/', contactFormLimiter, validateMessage, createMessage);

// Protected routes
router.get('/', authenticateToken, getAllMessages);
router.get('/:id', authenticateToken, getMessageById);
router.patch('/:id/status', authenticateToken, updateMessageStatus);
router.delete('/:id', authenticateToken, deleteMessage);

export default router;
