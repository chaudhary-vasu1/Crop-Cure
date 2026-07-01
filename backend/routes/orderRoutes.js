import express from 'express';
import { placeOrder, getOrders } from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection middleware
router.use(protect);

router.route('/')
    .post(placeOrder)
    .get(getOrders);

export default router;
