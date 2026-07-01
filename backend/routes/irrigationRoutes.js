import express from 'express';
import { getIrrigationAdvice, getRecommendationWithoutPlot } from '../controllers/irrigationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All irrigation routes require authentication
router.use(protect);

router.route('/recommend').post(getRecommendationWithoutPlot);
router.route('/:plotId').get(getIrrigationAdvice);

export default router;