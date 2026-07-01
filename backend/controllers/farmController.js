import Farm from '../models/Farm.js';
import Plot from '../models/Plot.js';
import DiseaseHistory from '../models/DiseaseHistory.js';
import mongoose from 'mongoose';

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
export const createFarm = async (req, res) => {
    try {
        const { name, location, size, crops } = req.body;
        if (!name || !location || !size) {
            return res.status(400).json({ message: 'Name, location, and size are required.' });
        }
        
        const farm = await Farm.create({
            name,
            location,
            size,
            crops: crops || [],
            ownerId: req.user.id || req.user._id
        });

        res.status(201).json(farm);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create farm', error: error.message });
    }
};

// @desc    Get all farms for the logged-in user
// @route   GET /api/farms
// @access  Private
export const getFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ ownerId: req.user.id || req.user._id });
        res.status(200).json(farms);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch farms', error: error.message });
    }
};

// @desc    Get specific farm details
// @route   GET /api/farms/:farmId
// @access  Private
export const getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findOne({ _id: req.params.farmId, ownerId: req.user.id || req.user._id });
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch farm details', error: error.message });
    }
};

// @desc    Update farm info
// @route   PUT /api/farms/:farmId
// @access  Private
export const updateFarm = async (req, res) => {
    try {
        const { name, location, size, crops } = req.body;
        const farm = await Farm.findOne({ _id: req.params.farmId, ownerId: req.user.id || req.user._id });
        
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found.' });
        }

        if (name !== undefined) farm.name = name;
        if (location !== undefined) farm.location = location;
        if (size !== undefined) farm.size = size;
        if (crops !== undefined) farm.crops = crops;

        await farm.save();
        res.status(200).json(farm);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update farm', error: error.message });
    }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:farmId
// @access  Private
export const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findOneAndDelete({ _id: req.params.farmId, ownerId: req.user.id || req.user._id });
        if (!farm) {
            return res.status(404).json({ message: 'Farm not found.' });
        }
        // Also un-link plots belonging to this farm
        await Plot.updateMany({ farm: req.params.farmId }, { $unset: { farm: "" } });
        res.status(200).json({ message: 'Farm deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete farm', error: error.message });
    }
};

// @desc    Compare health/metrics across multiple farms
// @route   GET /api/farms/compare
// @access  Private
export const compareFarms = async (req, res) => {
    try {
        const farmIdsQuery = req.query.farmIds;
        if (!farmIdsQuery) {
            return res.status(400).json({ message: 'farmIds query parameter is required.' });
        }
        const farmIds = farmIdsQuery.split(',');

        const farms = await Farm.find({ _id: { $in: farmIds }, ownerId: req.user.id || req.user._id });
        
        const comparisons = [];
        for (const farm of farms) {
            // Count plots/fields in farm
            const plotCount = await Plot.countDocuments({ farm: farm._id });
            
            // Get average health score from disease history
            const history = await DiseaseHistory.find({ farmId: farm._id });
            const avgHealth = history.length > 0
                ? Math.round(history.reduce((acc, curr) => acc + curr.healthStatus, 0) / history.length)
                : 100;

            // Count total diseases in this farm
            const diseaseCount = await DiseaseHistory.countDocuments({ farmId: farm._id });

            comparisons.push({
                farmId: farm._id,
                name: farm.name,
                location: farm.location,
                size: farm.size,
                crops: farm.crops,
                plotCount,
                avgHealth,
                diseaseCount
            });
        }

        res.status(200).json(comparisons);
    } catch (error) {
        res.status(500).json({ message: 'Failed to compare farms', error: error.message });
    }
};

// @desc    Summary report across all farms
// @route   GET /api/farms/aggregate-report
// @access  Private
export const aggregateReport = async (req, res) => {
    try {
        const ownerId = req.user.id || req.user._id;

        const farms = await Farm.find({ ownerId });
        const totalFarms = farms.length;
        const totalArea = farms.reduce((acc, curr) => acc + curr.size, 0);

        // Aggregate average health across all farms
        const history = await DiseaseHistory.find({ userId: ownerId });
        const avgHealth = history.length > 0
            ? Math.round(history.reduce((acc, curr) => acc + curr.healthStatus, 0) / history.length)
            : 100;

        const totalDiseases = history.length;

        // Yield estimate projection (mock yield logic based on crops and health status)
        let estimatedYieldTons = 0;
        farms.forEach(f => {
            f.crops.forEach(c => {
                const normCrop = c.toLowerCase().trim();
                let baseYieldPerAcre = 5; // tons
                if (normCrop.includes('rice')) baseYieldPerAcre = 2.5;
                if (normCrop.includes('wheat')) baseYieldPerAcre = 3.2;
                if (normCrop.includes('sugarcane')) baseYieldPerAcre = 35;
                
                // Adjust by average health
                const multiplier = avgHealth / 100;
                estimatedYieldTons += (f.size / (f.crops.length || 1)) * baseYieldPerAcre * multiplier;
            });
        });

        res.status(200).json({
            totalFarms,
            totalArea,
            avgHealth,
            totalDiseases,
            estimatedYieldTons: Math.round(estimatedYieldTons)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate aggregate report', error: error.message });
    }
};
