import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true },
        deliveryLocation: { type: String, required: true },
        status: { type: String, enum: ['pending', 'delivered', 'cancelled'], default: 'pending' }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
