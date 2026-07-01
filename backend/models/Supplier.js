import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const supplierSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        contactPhone: { type: String, required: true },
        verified: { type: Boolean, default: false },
        rating: { type: Number, default: 5 },
        reviews: [reviewSchema]
    },
    {
        timestamps: true
    }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
