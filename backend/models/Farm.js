import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a farm name'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        size: {
            type: Number,
            required: [true, 'Please add the size in acres'],
        },
        crops: {
            type: [String],
            default: []
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
