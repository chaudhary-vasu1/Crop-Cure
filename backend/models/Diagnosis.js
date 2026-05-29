import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        plot: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Plot',
        },
        diseaseName: {
            type: String,
            required: true,
        },
        confidenceScore: {
            type: Number,
            required: true,
        },
        treatmentPlan: {
            organic: { type: String, required: true },
            chemical: { type: String, required: true },
        },
        isContagious: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);
export default Diagnosis;