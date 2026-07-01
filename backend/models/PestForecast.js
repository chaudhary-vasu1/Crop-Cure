import mongoose from 'mongoose';

const pestForecastSchema = new mongoose.Schema(
    {
        cropType: {
            type: String,
            required: true
        },
        region: {
            type: String,
            default: 'All'
        },
        season: {
            type: String,
            default: 'All'
        },
        likelyPests: {
            type: [String],
            default: []
        },
        likelyDiseases: {
            type: [String],
            default: []
        },
        riskLevel: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        preventiveMeasures: {
            type: [String],
            default: []
        },
        spraySchedule: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const PestForecast = mongoose.model('PestForecast', pestForecastSchema);
export default PestForecast;
