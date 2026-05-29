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
        // Note: For production, you'd want to handle location parsing robustly (e.g., splitting "City, State")
        const city = plot.location.split(',')[0].trim();
        const weatherData = await getLocalWeather(city);

        // 3. Calculate the irrigation recommendation
        const advice = calculateIrrigationNeeds(weatherData, plot.soilType);

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