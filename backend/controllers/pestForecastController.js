import PestForecast from '../models/PestForecast.js';
import Farm from '../models/Farm.js';
import User from '../models/User.js';
import DiseaseHistory from '../models/DiseaseHistory.js';
import { getLocalWeather } from '../utils/weatherService.js';

// Auto-seed function to pre-populate common pest/disease data if DB is empty
const seedPestForecasts = async () => {
    try {
        const count = await PestForecast.countDocuments();
        if (count === 0) {
            console.log('[Pest Forecast] Seeding default templates...');
            const defaultTemplates = [
                {
                    cropType: 'wheat',
                    likelyPests: ['Aphids', 'Armyworms', 'Hessian Fly'],
                    likelyDiseases: ['Leaf Rust', 'Powdery Mildew', 'Loose Smut'],
                    riskLevel: 'medium',
                    preventiveMeasures: [
                        'Use certified disease-resistant seed varieties.',
                        'Avoid excessive nitrogen fertilization to reduce thick canopy growth.',
                        'Ensure proper spacing between crops to allow airflow.'
                    ],
                    spraySchedule: ['Early tillering (pesticide/fungicide)', 'Flowering/Heading stage']
                },
                {
                    cropType: 'rice',
                    likelyPests: ['Brown Plant Hopper', 'Stem Borer', 'Leaf Folder'],
                    likelyDiseases: ['Rice Blast', 'Sheath Blight', 'Bacterial Leaf Blight'],
                    riskLevel: 'high',
                    preventiveMeasures: [
                        'Practice alternate wetting and drying (AWD) water management.',
                        'Apply recommended levels of potassium fertilizer.',
                        'Remove weed hosts and plow fields thoroughly after harvest.'
                    ],
                    spraySchedule: ['Max tillering stage', 'Panicle initiation stage (pesticide/fungicide)']
                },
                {
                    cropType: 'sugarcane',
                    likelyPests: ['Early Shoot Borer', 'Pyrilla', 'Internode Borer'],
                    likelyDiseases: ['Red Rot', 'Smut', 'Grassy Shoot Disease'],
                    riskLevel: 'low',
                    preventiveMeasures: [
                        'Select heat-treated healthy setts for planting.',
                        'Routinely de-trash lower leaves to improve soil aeration.',
                        'Implement crop rotation with leguminous green manures.'
                    ],
                    spraySchedule: ['45 days post-planting', '90 days post-planting']
                },
                {
                    cropType: 'corn',
                    likelyPests: ['Fall Armyworm', 'Maize Stem Borer', 'Corn Leaf Aphid'],
                    likelyDiseases: ['Turcicum Leaf Blight', 'Common Rust', 'Downy Mildew'],
                    riskLevel: 'medium',
                    preventiveMeasures: [
                        'Intercrop with legumes to suppress pest populations.',
                        'Apply neem seed kernel extract early in crop cycle.',
                        'Remove and destroy infected plant residues.'
                    ],
                    spraySchedule: ['Knee-high vegetative stage', 'Tasseling stage']
                },
                {
                    cropType: 'cotton',
                    likelyPests: ['Whitefly', 'Pink Bollworm', 'Jassids'],
                    likelyDiseases: ['Boll Rot', 'Bacterial Blight', 'Root Rot'],
                    riskLevel: 'high',
                    preventiveMeasures: [
                        'Grow refuge crops (non-Bt border rows) to slow resistance.',
                        'Use yellow sticky traps to capture whiteflies.',
                        'Ensure efficient field drainage to discourage damp pathogen propagation.'
                    ],
                    spraySchedule: ['Square formation stage', 'Flowering/Boll development']
                }
            ];
            await PestForecast.insertMany(defaultTemplates);
            console.log('[Pest Forecast] Seeding completed.');
        }
    } catch (err) {
        console.error('[Pest Forecast] Seeding failed:', err.message);
    }
};

// @desc    Get seasonal predictions for a specific farm
// @route   GET /api/pest-forecast/:farmId
// @access  Private
export const getPestForecast = async (req, res) => {
    try {
        await seedPestForecasts(); // Self-healing seed

        const { farmId } = req.params;
        let farm = null;
        let location = 'Meerut'; // default location

        // Determine currently grown crops based on Indian agricultural season
        const getSeasonalCrops = () => {
            const month = new Date().getMonth(); // 0-indexed (0=Jan, 6=Jul, 11=Dec)
            // Kharif (Monsoon): June–October → rice, corn, cotton, sugarcane, soybean
            if (month >= 5 && month <= 9) {
                return ['rice', 'corn', 'cotton', 'sugarcane'];
            }
            // Rabi (Winter): November–March → wheat, mustard, barley, chickpea
            if (month >= 10 || month <= 2) {
                return ['wheat', 'corn'];
            }
            // Zaid (Summer): April–May → moong, watermelon, cucumber, sunflower
            return ['sugarcane', 'corn', 'cotton'];
        };

        let crops = getSeasonalCrops();

        if (farmId && farmId !== 'all') {
            farm = await Farm.findById(farmId);
            if (farm) {
                location = farm.location;
                if (farm.crops && farm.crops.length > 0) {
                    crops = farm.crops;
                }
            }
        }

        // Get local weather metrics
        let weather = { temp: 28, humidity: 65, condition: 'Clear', rainfallAmount: 0 };
        try {
            weather = await getLocalWeather(location);
        } catch (weatherErr) {
            console.warn('Weather fetch failed in PestForecast. Using default metrics:', weatherErr.message);
        }

        // --- RULE ENGINE FOR RISK COMPUTATION ---
        const temp = weather.temp;
        const humidity = weather.humidity;
        const condition = weather.condition;
        const rainfall = weather.rainfallAmount;

        const isDiseaseRiskHigh = temp > 25 && humidity > 70;
        const isPestBreedingHigh = (condition === 'Rain' || rainfall > 0) && temp > 20;

        let riskLevel = 'low';
        let explanation = 'Weather conditions are stable. Standard crop management is advised.';

        if (isDiseaseRiskHigh && isPestBreedingHigh) {
            riskLevel = 'high';
            explanation = `High temperatures (${temp}°C) combined with high humidity (${humidity}%) and rainfall are breeding grounds for rapid pest proliferation and fungal spreads.`;
        } else if (isDiseaseRiskHigh) {
            riskLevel = 'medium';
            explanation = `Warm, highly humid conditions (${humidity}%) increase risk for fungal diseases like Powdery Mildew and Blight.`;
        } else if (isPestBreedingHigh) {
            riskLevel = 'medium';
            explanation = `Natural rainfall and warm temperatures create optimal breeding seasons for chewing pests and larvae.`;
        }

        // Cross-reference with farm's disease history to see if they had recent contagions
        const historyQuery = { userId: req.user.id || req.user._id };
        if (farmId && farmId !== 'all') {
            historyQuery.farmId = farmId;
        }
        const recentDiagnoses = await DiseaseHistory.find(historyQuery).limit(5);
        const hasRecentContagion = recentDiagnoses.some(d => d.healthStatus < 70);
        if (hasRecentContagion && riskLevel === 'medium') {
            riskLevel = 'high';
            explanation += ' Historical trends indicate active local infections, escalating risks.';
        }

        // Retrieve forecasting templates for the farm's crops
        const templates = await PestForecast.find({
            cropType: { $in: crops.map(c => c.toLowerCase().trim()) }
        });

        // If no templates are matching, create on-the-fly default predictions
        const forecasts = crops.map(crop => {
            const tempMatch = templates.find(t => t.cropType === crop.toLowerCase().trim());
            return tempMatch ? {
                cropType: crop,
                likelyPests: tempMatch.likelyPests,
                likelyDiseases: tempMatch.likelyDiseases,
                riskLevel: riskLevel, // custom calculated
                preventiveMeasures: tempMatch.preventiveMeasures,
                spraySchedule: tempMatch.spraySchedule,
                explanation
            } : {
                cropType: crop,
                likelyPests: ['Aphids', 'Thrips'],
                likelyDiseases: ['Leaf Blight'],
                riskLevel: riskLevel,
                preventiveMeasures: ['Implement crop rotation', 'Ensure moderate watering to avoid humidity build-up.'],
                spraySchedule: ['Apply neem sprays at first sight of infestation'],
                explanation
            };
        });

        res.status(200).json({
            location,
            riskLevel,
            weatherMetrics: {
                temp,
                humidity,
                condition
            },
            explanation,
            forecasts
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate pest forecast', error: error.message });
    }
};

// @desc    Subscribe to alerts
// @route   POST /api/pest-forecast/:farmId/subscribe
// @access  Private
export const subscribeAlerts = async (req, res) => {
    try {
        const { frequency, email, sms, push, inApp } = req.body;
        const user = await User.findById(req.user.id || req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.pestAlertPreferences = {
            subscribed: true,
            frequency: frequency || 'weekly',
            email: email !== undefined ? email : true,
            sms: sms !== undefined ? sms : false,
            push: push !== undefined ? push : true,
            inApp: inApp !== undefined ? inApp : true
        };

        await user.save();
        res.status(200).json({ message: 'Notification preferences updated.', preferences: user.pestAlertPreferences });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update alert subscriptions', error: error.message });
    }
};

// @desc    Get historical pest statistics
// @route   GET /api/pest-forecast/history/:farmId
// @access  Private
export const getForecastHistory = async (req, res) => {
    try {
        // Return structured history logs for mock analytics
        const historicalLogs = [
            { date: '2026-06-15', riskLevel: 'medium', details: 'High moisture led to minor Aphid outbreaks.' },
            { date: '2026-06-01', riskLevel: 'low', details: 'Dry climate, low pest movement.' },
            { date: '2026-05-15', riskLevel: 'high', details: 'Fungal leaf rust reported due to unseasonal showers.' }
        ];
        res.status(200).json(historicalLogs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve historical statistics', error: error.message });
    }
};
