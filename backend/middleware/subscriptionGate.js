import User from '../models/User.js';
import Diagnosis from '../models/Diagnosis.js';
import Farm from '../models/Farm.js';

// @desc    Middleware to restrict Free users to 1 diagnosis per 24 hours
export const gateDiagnosisLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id || req.user._id);
        const tier = user.tier || 'free';

        if (tier === 'free') {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const count = await Diagnosis.countDocuments({
                user: user._id,
                createdAt: { $gte: startOfToday }
            });

            if (count >= 1) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Daily diagnosis limit reached. Free tier allows 1 diagnosis per day. Please upgrade to Premium or Professional for unlimited access!'
                });
            }
        }
        next();
    } catch (err) {
        next(err);
    }
};

// @desc    Middleware to restrict farm creations based on plan tier
export const gateFarmLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id || req.user._id);
        const tier = user.tier || 'free';

        const farmCount = await Farm.countDocuments({ ownerId: user._id });
        
        let limit = 1;
        if (tier === 'professional') {
            limit = 5;
        } else if (tier === 'premium') {
            limit = 1;
        } else {
            limit = 1;
        }

        if (farmCount >= limit) {
            return res.status(403).json({
                status: 'error',
                message: `Farm creation limit reached. Your current plan (${tier}) allows a maximum of ${limit} farm(s). Please upgrade to Professional to manage up to 5 farms!`
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};
