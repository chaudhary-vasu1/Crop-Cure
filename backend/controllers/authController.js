import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// Temporary storage
const otpStore = new Map();

// 1. Single, Production-Ready Transporter Configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

export const requestOtp = async (req, res) => {
    try {
        const { identifier } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 2. Critical Debug Logs (View these in the Render Dashboard)
        console.log(`\n--- OTP REQUESTED ---`);
        console.log(`Target Email: ${identifier}`);
        console.log(`Generated OTP: ${otp}`); // You can use this to bypass email failure
        console.log(`Has EMAIL_PASS? : ${!!process.env.EMAIL_PASS}`);
        console.log(`---------------------\n`);

        otpStore.set(identifier, { otp, expires: Date.now() + 300000 });
        
        // 3. Actually send the email (This was missing in your last version)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: identifier,
            subject: "Your CropCure Login OTP",
            text: `Your OTP for login is ${otp}. It expires in 5 minutes.`
        });
        
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Email Error Output:", error);
        res.status(500).json({ message: 'Failed to send OTP email', error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        const data = otpStore.get(identifier);

        if (!data || data.otp !== otp || Date.now() > data.expires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        let user = await User.findOne({ email: identifier });
        if (!user) {
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