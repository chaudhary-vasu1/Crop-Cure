import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { 
            type: String, 
            enum: ['seed', 'pesticide', 'fertilizer', 'tool'],
            required: true 
        },
        price: { type: Number, required: true },
        supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
        stockCount: { type: Number, default: 0 },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        recommendedCrops: { type: [String], default: [] }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
