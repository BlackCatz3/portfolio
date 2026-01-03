import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - track events
router.post('/track', analyticsController.trackEvent);

// Protected routes - admin only
router.get('/statistics', authenticateToken, analyticsController.getStatistics);
router.get('/activities', authenticateToken, analyticsController.getRecentActivities);
router.get('/chart', authenticateToken, analyticsController.getChartData);

export default router;
