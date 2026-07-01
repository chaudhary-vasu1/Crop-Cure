import DiseaseHistory from '../models/DiseaseHistory.js';
import mongoose from 'mongoose';

// @desc    Get disease history records for a farm (paginated)
// @route   GET /api/farm/:farmId/disease-history
// @access  Private
export const getDiseaseHistory = async (req, res) => {
    try {
        const { farmId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = { userId: req.user.id || req.user._id };
        if (farmId && farmId !== 'all') {
            query.farmId = farmId;
        }

        const history = await DiseaseHistory.find(query)
            .populate('cropId', 'name cropType')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await DiseaseHistory.countDocuments(query);

        res.status(200).json({
            history,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch disease history', error: error.message });
    }
};

// @desc    Get average health status trend over last N days for charts
// @route   GET /api/farm/:farmId/health-trend
// @access  Private
export const getHealthTrend = async (req, res) => {
    try {
        const { farmId } = req.params;
        const days = parseInt(req.query.days) || 30;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const query = {
            userId: new mongoose.Types.ObjectId(req.user.id || req.user._id),
            timestamp: { $gte: startDate }
        };

        if (farmId && farmId !== 'all') {
            query.farmId = new mongoose.Types.ObjectId(farmId);
        }

        const trendData = await DiseaseHistory.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    avgHealth: { $avg: "$healthStatus" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formatted = trendData.map(item => ({
            date: item._id,
            healthScore: Math.round(item.avgHealth)
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch health trend', error: error.message });
    }
};

// @desc    Update treatment application notes on diagnosis history
// @route   POST /api/farm/:farmId/disease-history/:diagnosisId/update-treatment
// @access  Private
export const updateTreatment = async (req, res) => {
    try {
        const { diagnosisId } = req.params;
        const { treatmentApplied, notes } = req.body;

        const record = await DiseaseHistory.findOne({
            _id: diagnosisId,
            userId: req.user.id || req.user._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Disease history record not found' });
        }

        if (treatmentApplied !== undefined) record.treatmentApplied = treatmentApplied;
        if (notes !== undefined) record.notes = notes;

        await record.save();

        res.status(200).json({ message: 'Treatment updated successfully', record });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update treatment', error: error.message });
    }
};
