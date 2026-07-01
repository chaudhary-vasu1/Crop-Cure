import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Diagnosis from '../models/Diagnosis.js';
import Farm from '../models/Farm.js';

// @desc    Get user's current subscription
// @route   GET /api/subscription/status
// @access  Private
export const getSubscription = async (req, res) => {
    try {
        let sub = await Subscription.findOne({ userId: req.user.id || req.user._id });
        if (!sub) {
            sub = await Subscription.create({
                userId: req.user.id || req.user._id,
                tier: 'free',
                endDate: null
            });
        }
        res.status(200).json(sub);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription status', error: error.message });
    }
};

// @desc    Upgrade or initialize payment for subscription tier
// @route   POST /api/subscription/upgrade
// @access  Private
export const upgradeSubscription = async (req, res) => {
    try {
        const { tier } = req.body;
        if (!['free', 'premium', 'professional'].includes(tier)) {
            return res.status(400).json({ message: 'Invalid subscription tier specified.' });
        }

        const userId = req.user.id || req.user._id;

        // Mock payment verification (simulate payment gateway checkout success)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        let sub = await Subscription.findOne({ userId });
        if (!sub) {
            sub = await Subscription.create({
                userId,
                tier,
                endDate,
                paymentMethod: 'Mock Checkout Success'
            });
        } else {
            sub.tier = tier;
            sub.endDate = endDate;
            sub.autoRenew = true;
            await sub.save();
        }

        // Keep User model in sync for performance
        const user = await User.findById(userId);
        if (user) {
            user.tier = tier;
            await user.save();
        }

        res.status(200).json({ message: `Successfully upgraded to ${tier} plan!`, sub });
    } catch (error) {
        res.status(500).json({ message: 'Subscription upgrade failed', error: error.message });
    }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const sub = await Subscription.findOne({ userId });
        if (!sub) {
            return res.status(404).json({ message: 'No active subscription found.' });
        }

        sub.autoRenew = false;
        await sub.save();

        res.status(200).json({ message: 'Auto-renewal cancelled. Plan remains active until end date.', sub });
    } catch (error) {
        res.status(500).json({ message: 'Cancellation failed', error: error.message });
    }
};

// @desc    Get usage statistics
// @route   GET /api/subscription/usage
// @access  Private
export const getUsageStats = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await User.findById(userId);
        const tier = user.tier || 'free';

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const diagnosisCountToday = await Diagnosis.countDocuments({
            user: userId,
            createdAt: { $gte: startOfToday }
        });

        const farmCount = await Farm.countDocuments({ ownerId: userId });

        const limits = {
            free: { diagnoses: 1, farms: 1 },
            premium: { diagnoses: 9999, farms: 1 },
            professional: { diagnoses: 9999, farms: 5 }
        };

        const currentLimits = limits[tier];

        res.status(200).json({
            tier,
            diagnosesUsedToday: diagnosisCountToday,
            diagnosesLimit: currentLimits.diagnoses,
            farmsCount: farmCount,
            farmsLimit: currentLimits.farms
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch usage stats', error: error.message });
    }
};
