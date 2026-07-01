import express from 'express';
import { getSubscription, upgradeSubscription, cancelSubscription, getUsageStats } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware
router.use(protect);

router.route('/status').get(getSubscription);
router.route('/upgrade').post(upgradeSubscription);
router.route('/cancel').post(cancelSubscription);
router.route('/usage').get(getUsageStats);

export default router;
