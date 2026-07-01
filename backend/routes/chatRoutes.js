import express from 'express';
import { getChatResponse } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth check
router.use(protect);

router.route('/').post(getChatResponse);

export default router;
