import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Protected route (admin only)
router.post('/', authenticateToken, upload.single('image'), uploadImage);

export default router;
