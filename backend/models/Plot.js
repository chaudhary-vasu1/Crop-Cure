import mongoose from 'mongoose';

const plotSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // References the User model
        },
        name: {
            type: String,
            required: [true, 'Please provide a name for this plot (e.g., North Field)'],
            trim: true,
        },
        cropType: {
            type: String,
            required: [true, 'Please specify the crop type (e.g., Tomato, Wheat)'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Please provide the location (City, State)'],
            trim: true,
        },
        soilType: {
            type: String,
            required: [true, 'Please specify the soil type (e.g., Loamy, Clay, Sandy)'],
        },
        irrigationMethod: {
            type: String,
            required: [true, 'Please specify the irrigation method (e.g., Drip, Sprinkler)'],
        }
    },
    {
        timestamps: true,
    }
);

const Plot = mongoose.model('Plot', plotSchema);
export default Plot;