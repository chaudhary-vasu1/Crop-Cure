import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// =============================
// Route Imports
// =============================
import authRoutes from './routes/authRoutes.js';
import plotRoutes from './routes/plotRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import diseaseHistoryRoutes from './routes/diseaseHistoryRoutes.js';
import pestForecastRoutes from './routes/pestForecastRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

import path from 'path';

// Initialize Express app
const app = express();

// Connect Database
connectDB();

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Enable CORS for frontend requests
app.use(cors());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Parse JSON request bodies
app.use(express.json());

// Parse URL encoded bodies
app.use(express.urlencoded({ extended: true }));

// =============================
// API Routes
// =============================
app.use('/api/auth', authRoutes);
app.use('/api/plots', plotRoutes);
app.use('/api/diagnostics', diagnosisRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/farm', diseaseHistoryRoutes);
app.use('/api/pest-forecast', pestForecastRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/chat', chatRoutes);

// =============================
// Health Check Route
// =============================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'AI Crop Doctor API is running successfully.'
    });
});

// =============================
// 404 Route Handler
// =============================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'The requested API endpoint does not exist.'
    });
});

// =============================
// Global Error Handler
// =============================
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'An internal server error occurred.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
});