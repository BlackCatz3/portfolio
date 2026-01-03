import express from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  deleteMessage
} from '../controllers/messagesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createMessage);

// Protected routes
router.get('/', authenticateToken, getAllMessages);
router.get('/:id', authenticateToken, getMessageById);
router.patch('/:id/status', authenticateToken, updateMessageStatus);
router.delete('/:id', authenticateToken, deleteMessage);

export default router;
