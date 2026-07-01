import mongoose from 'mongoose';

const diseaseHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        farmId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm',
            required: false // Optional for plots not explicitly linked to a farm
        },
        cropId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plot',
            required: true
        },
        diseaseDetected: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true // Percentage 0-100
        },
        treatmentApplied: {
            type: String,
            default: 'None'
        },
        notes: {
            type: String,
            default: ''
        },
        photoUrl: {
            type: String,
            default: ''
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        healthStatus: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

const DiseaseHistory = mongoose.model('DiseaseHistory', diseaseHistorySchema);
export default DiseaseHistory;
