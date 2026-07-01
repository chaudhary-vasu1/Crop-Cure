import express from 'express';
import { 
    createFarm, 
    getFarms, 
    getFarmById, 
    updateFarm, 
    deleteFarm, 
    compareFarms, 
    aggregateReport 
} from '../controllers/farmController.js';
import { protect } from '../middleware/authMiddleware.js';
import { gateFarmLimit } from '../middleware/subscriptionGate.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/compare').get(compareFarms);
router.route('/aggregate-report').get(aggregateReport);

router.route('/')
    .post(gateFarmLimit, createFarm)
    .get(getFarms);

router.route('/:farmId')
    .get(getFarmById)
    .put(updateFarm)
    .delete(deleteFarm);

export default router;
