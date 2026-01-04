import express from 'express';
import {
  getRateLimitSettings,
  updateRateLimitSettings,
  getEmailRateLimitStats,
  clearEmailRateLimit,
  cleanupOldRateLimits
} from '../controllers/rateLimitSettingsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get rate limit settings
router.get('/', getRateLimitSettings);

// Update rate limit settings
router.put('/', updateRateLimitSettings);

// Get email rate limit stats
router.get('/stats', getEmailRateLimitStats);

// Clear rate limit for specific email
router.delete('/email/:email', clearEmailRateLimit);

// Cleanup old rate limit records
router.post('/cleanup', cleanupOldRateLimits);

export default router;
