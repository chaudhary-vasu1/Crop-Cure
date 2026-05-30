import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer'; // Added import

// Temporary storage (Use Redis or DB for production)
const otpStore = new Map();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password });
        if (user) {
            res.status(201).json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user & get token
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Request OTP (Updated with Nodemailer)
// @route   POST /api/auth/request-otp
export const requestOtp = async (req, res) => {
    try {
        const { identifier } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save to store with 5-minute expiration
        otpStore.set(identifier, { otp, expires: Date.now() + 300000 });
        
        // Send actual email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: identifier,
            subject: "Your CropCure Login OTP",
            text: `Your OTP for login is ${otp}. It expires in 5 minutes.`
        });
        
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: 'Failed to send OTP email', error: error.message });
    }
};

// @desc    Verify OTP & Login
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        const data = otpStore.get(identifier);

        if (!data || data.otp !== otp || Date.now() > data.expires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        let user = await User.findOne({ email: identifier });
        if (!user) {
            // Create user with a strong default password
            user = await User.create({ 
                username: identifier.split('@')[0], 
                email: identifier, 
                password: Math.random().toString(36).slice(-8) + 'A1!' 
            });
        }

        otpStore.delete(identifier);
        res.status(200).json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            token: generateToken(user._id) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};