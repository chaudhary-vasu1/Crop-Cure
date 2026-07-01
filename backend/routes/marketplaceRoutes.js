import express from 'express';
import { 
    getSuppliers, 
    getProducts, 
    getPriceComparison, 
    submitReview, 
    getReviews,
    getSupplierById
} from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth check
router.use(protect);

router.route('/suppliers').get(getSuppliers);
router.route('/suppliers/:supplierId').get(getSupplierById);
router.route('/products').get(getProducts);
router.route('/price-comparison').get(getPriceComparison);

router.route('/suppliers/:supplierId/review')
    .post(submitReview)
    .get(getReviews);

export default router;
