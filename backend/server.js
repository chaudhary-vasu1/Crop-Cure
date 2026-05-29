import weatherRoutes from './routes/weatherRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

// =============================
// Route Imports
// =============================
import authRoutes from './routes/authRoutes.js';
import plotRoutes from './routes/plotRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';

// Load environment variables FIRST
dotenv.config();

// Initialize Express app
const app = express();

// Connect Database
connectDB();

// =============================
// Global Middleware
// =============================

// Enable CORS for frontend requests
app.use(cors());

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