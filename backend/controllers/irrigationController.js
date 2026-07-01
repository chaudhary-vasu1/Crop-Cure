import Plot from '../models/Plot.js';
import { getLocalWeather } from '../utils/weatherService.js';
import { calculateIrrigationNeeds } from '../utils/irrigationAdvisor.js';

// @desc    Get smart irrigation advice for a specific plot
// @route   GET /api/irrigation/:plotId
// @access  Private
export const getIrrigationAdvice = async (req, res) => {
    try {
        const { plotId } = req.params;

        // 1. Fetch the plot and verify ownership
        const plot = await Plot.findById(plotId);
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }
        if (plot.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to access this plot data' });
        }

        // 2. Fetch real-time weather using the plot's location
        const city = (plot.location && typeof plot.location === 'string' && plot.location.trim().length > 0)
            ? plot.location.split(',')[0].trim()
            : 'Meerut';
        const weatherData = await getLocalWeather(city);

        // 3. Calculate the irrigation recommendation
        const advice = calculateIrrigationNeeds(weatherData, plot.soilType || 'Loamy');

        // 4. Send the combined dashboard data back to the frontend
        res.status(200).json({
            plotDetails: {
                name: plot.name,
                cropType: plot.cropType,
                soilType: plot.soilType,
                method: plot.irrigationMethod
            },
            currentWeather: weatherData,
            recommendation: advice
        });

    } catch (error) {
        console.error("Irrigation Logic Error:", error);
        res.status(500).json({ 
            message: 'Failed to generate irrigation advice.', 
            error: error.message 
        });
    }
};

// @desc    Get irrigation recommendation by manual inputs
// @route   POST /api/irrigation/recommend
// @access  Private
export const getRecommendationWithoutPlot = async (req, res) => {
    try {
        const { location, cropType, soilType, area } = req.body;
        
        if (!location || !cropType || !soilType || !area) {
            return res.status(400).json({ message: 'All inputs (location, cropType, soilType, area) are required.' });
        }

        // Fetch real-time weather
        const weatherData = await getLocalWeather(location);

        // Calculate irrigation advice
        const advice = calculateIrrigationNeeds(weatherData, soilType);

        res.status(200).json({
            currentWeather: weatherData,
            recommendation: advice
        });
    } catch (error) {
        console.error("Irrigation Recommend Error:", error);
        res.status(500).json({ 
            message: 'Failed to compute irrigation recommendations.', 
            error: error.message 
        });
    }
};