import express from 'express';
import { getPlots, createPlot, deletePlot } from '../controllers/plotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

// Map routes to controllers
router.route('/').get(getPlots).post(createPlot);
router.route('/:id').delete(deletePlot);

export default router;