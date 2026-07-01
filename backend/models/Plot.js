import mongoose from 'mongoose';

const plotSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        farm: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm',
            required: false
        },
        name: {
            type: String,
            required: [true, 'Please add a plot name'],
        },
        cropType: {
            type: String,
            required: [true, 'Please add a crop type'],
        },
        area: {
            type: Number,
            required: [true, 'Please add the area in acres'],
        },
        // We set these to false so they are optional for now! 
        // You can add them to the frontend form later if you want.
        location: {
            type: String,
            required: false, 
        },
        soilType: {
            type: String,
            required: false,
        },
        irrigationMethod: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Plot = mongoose.model('Plot', plotSchema);
export default Plot;