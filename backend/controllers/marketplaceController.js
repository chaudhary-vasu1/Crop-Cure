import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Auto-seed function for Suppliers and Products
const seedMarketplace = async () => {
    try {
        const supplierCount = await Supplier.countDocuments();
        if (supplierCount === 0) {
            console.log('[Marketplace Seed] Seeding suppliers...');
            const suppliers = await Supplier.insertMany([
                { name: 'Kisan Seeds & Fertilizer', location: 'Meerut, Uttar Pradesh', contactPhone: '+919876543210', verified: true, rating: 4.8 },
                { name: 'Harit Kranti Agro Solutions', location: 'Karnal, Haryana', contactPhone: '+919123456789', verified: true, rating: 4.5 },
                { name: 'Jai Kisan Agri-Store', location: 'Hapur, Uttar Pradesh', contactPhone: '+918887776665', verified: false, rating: 3.9 },
                { name: 'Royal Organic Farms & Supplies', location: 'Amritsar, Punjab', contactPhone: '+917776665554', verified: true, rating: 4.7 },
                { name: 'Modern Farming Depot', location: 'Rohtak, Haryana', contactPhone: '+919998887776', verified: true, rating: 4.2 }
            ]);

            console.log('[Marketplace Seed] Seeding products...');
            await Product.insertMany([
                {
                    name: 'Premium Quality Wheat Seeds (HD-2967)',
                    category: 'seed',
                    price: 650,
                    supplierId: suppliers[0]._id,
                    stockCount: 150,
                    description: 'High-yielding certified wheat seeds. Rust resistant.',
                    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['wheat']
                },
                {
                    name: 'Organic Neem Oil Pest Spray',
                    category: 'pesticide',
                    price: 320,
                    supplierId: suppliers[3]._id,
                    stockCount: 80,
                    description: '100% natural insecticide and fungicide. Effective against aphids, thrips, and mites.',
                    image: 'https://images.unsplash.com/photo-1600180758890-6b945f9a8ba6?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['wheat', 'rice', 'sugarcane', 'cotton', 'corn']
                },
                {
                    name: 'NPK 19-19-19 Soluble Fertilizer',
                    category: 'fertilizer',
                    price: 450,
                    supplierId: suppliers[1]._id,
                    stockCount: 200,
                    description: 'Balanced water-soluble fertilizer offering rich macronutrients.',
                    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['sugarcane', 'wheat', 'rice', 'corn']
                },
                {
                    name: 'Super Hybrid Basmati Rice Seeds',
                    category: 'seed',
                    price: 950,
                    supplierId: suppliers[1]._id,
                    stockCount: 100,
                    description: 'Premium aromatic basmati seeds with 90%+ germination rate.',
                    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['rice']
                },
                {
                    name: 'Broad-Spectrum Bio-Fungicide',
                    category: 'pesticide',
                    price: 580,
                    supplierId: suppliers[2]._id,
                    stockCount: 65,
                    description: 'Proactive protection against rice blast, stem rot, and blights.',
                    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['sugarcane', 'rice', 'cotton']
                },
                {
                    name: 'Urea Booster (46% Nitrogen)',
                    category: 'fertilizer',
                    price: 300,
                    supplierId: suppliers[0]._id,
                    stockCount: 500,
                    description: 'Promotes rapid leafy vegetative growth and plant greening.',
                    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['wheat', 'rice', 'sugarcane', 'corn']
                },
                {
                    name: 'NPK 19-19-19 Fertilizer (Alternative)',
                    category: 'fertilizer',
                    price: 430,
                    supplierId: suppliers[4]._id,
                    stockCount: 150,
                    description: 'Competitive NPK formula for general cultivation and foliage growth.',
                    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=80',
                    recommendedCrops: ['sugarcane', 'wheat', 'rice', 'corn']
                }
            ]);
            console.log('[Marketplace Seed] Completed seeding.');
        }
    } catch (err) {
        console.error('[Marketplace Seed] Error:', err.message);
    }
};

// @desc    Find suppliers based on crop/region
// @route   GET /api/marketplace/suppliers
// @access  Private
export const getSuppliers = async (req, res) => {
    try {
        await seedMarketplace();
        const { crop, region } = req.query;

        const query = {};
        if (region) {
            query.location = { $regex: region, $options: 'i' };
        }

        const suppliers = await Supplier.find(query);
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
    }
};

// @desc    Search marketplace products
// @route   GET /api/marketplace/products
// @access  Private
export const getProducts = async (req, res) => {
    try {
        await seedMarketplace();
        const { category, crop, search } = req.query;

        const query = {};
        if (category) {
            query.category = category;
        }
        if (crop) {
            query.recommendedCrops = { $in: [crop.toLowerCase().trim()] };
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).populate('supplierId', 'name location verified rating');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// @desc    Place order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
    try {
        const { productId, quantity, deliveryLocation } = req.body;
        
        if (!productId || !quantity || !deliveryLocation) {
            return res.status(400).json({ message: 'Product ID, quantity, and delivery location are required.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (product.stockCount < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.stockCount} left.` });
        }

        const totalPrice = product.price * quantity;

        // Create order
        const order = await Order.create({
            userId: req.user.id || req.user._id,
            productId,
            quantity,
            totalPrice,
            deliveryLocation,
            status: 'pending'
        });

        // Deduct stock
        product.stockCount -= quantity;
        await product.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
};

// @desc    Get user order history
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id || req.user._id })
            .populate({
                path: 'productId',
                populate: { path: 'supplierId', select: 'name contactPhone' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

// @desc    Compare prices for a specific product category/type
// @route   GET /api/marketplace/price-comparison
// @access  Private
export const getPriceComparison = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ message: 'search query parameter is required for comparison.' });
        }

        const products = await Product.find({ name: { $regex: search, $options: 'i' } })
            .populate('supplierId', 'name rating verified')
            .sort({ price: 1 }); // Sort cheapest first

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to compare product prices', error: error.message });
    }
};

// @desc    Submit review for supplier
// @route   POST /api/suppliers/:supplierId/review
// @access  Private
export const submitReview = async (req, res) => {
    try {
        const { supplierId } = req.params;
        const { rating, comment } = req.body;
        const user = await User.findById(req.user.id || req.user._id);

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required.' });
        }

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Add review
        const newReview = {
            userId: user._id,
            username: user.username,
            rating: Number(rating),
            comment: comment || ''
        };

        supplier.reviews.push(newReview);

        // Recalculate average rating
        const totalRating = supplier.reviews.reduce((acc, curr) => acc + curr.rating, 0);
        supplier.rating = Math.round((totalRating / supplier.reviews.length) * 10) / 10;

        await supplier.save();
        res.status(201).json({ message: 'Review submitted successfully', supplier });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit review', error: error.message });
    }
};

// @desc    Get reviews for supplier
// @route   GET /api/suppliers/:supplierId/reviews
// @access  Private
export const getReviews = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier.reviews);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};

// @desc    Get specific supplier by ID
// @route   GET /api/marketplace/suppliers/:supplierId
// @access  Private
export const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch supplier details', error: error.message });
    }
};
