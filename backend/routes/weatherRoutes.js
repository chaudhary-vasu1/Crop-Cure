import express from 'express';
import { getWeather, reverseGeocode, getWeatherDetails } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect it so only logged-in farmers can use your API bandwidth
router.get('/', protect, getWeather);
router.get('/reverse-geocode', protect, reverseGeocode);
router.get('/details', protect, getWeatherDetails);

export default router;