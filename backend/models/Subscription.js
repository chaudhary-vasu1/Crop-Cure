import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        tier: {
            type: String,
            enum: ['free', 'premium', 'professional'],
            default: 'free'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        autoRenew: {
            type: Boolean,
            default: true
        },
        paymentMethod: {
            type: String,
            default: 'Mock Stripe/Razorpay'
        }
    },
    {
        timestamps: true
    }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
