import express from 'express';
import { getDiseaseHistory, getHealthTrend, updateTreatment } from '../controllers/diseaseHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/:farmId/disease-history').get(getDiseaseHistory);
router.route('/:farmId/health-trend').get(getHealthTrend);
router.route('/:farmId/disease-history/:diagnosisId/update-treatment').post(updateTreatment);

export default router;
