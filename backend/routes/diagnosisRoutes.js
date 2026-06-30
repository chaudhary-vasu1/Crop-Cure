import express from 'express';
import { analyzeCrop, getDiagnosesByPlot, getAllDiagnoses } from '../controllers/diagnosisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth protection to all diagnostic routes
router.use(protect);

// Get all diagnoses across all plots for the user
router.route('/').get(getAllDiagnoses);

// Note: 'image' must match the form-data key sent by the React frontend
router.route('/:plotId')
    .post(upload.single('image'), analyzeCrop)
    .get(getDiagnosesByPlot);

export default router;