import express from 'express';
import { getPestForecast, subscribeAlerts, getForecastHistory } from '../controllers/pestForecastController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protector
router.use(protect);

router.route('/history/:farmId').get(getForecastHistory);
router.route('/:farmId').get(getPestForecast);
router.route('/:farmId/subscribe').post(subscribeAlerts);

export default router;
