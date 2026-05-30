import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio'; // <-- Added Twilio

const otpStore = new Map();

// --- SETUP NODEMAILER (Email) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- SETUP TWILIO (SMS) ---
// It will look for your env variables automatically
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper function to detect Email vs Phone Number
const isEmail = (identifier) => identifier.includes('@');

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
        
        console.log(`\n--- OTP REQUESTED ---`);
        console.log(`Target: ${identifier}`);
        console.log(`Type: ${isEmail(identifier) ? 'Email' : 'Phone Number'}`);
        console.log(`Generated OTP: ${otp}`); 
        console.log(`---------------------\n`);

        otpStore.set(identifier, { otp, expires: Date.now() + 300000 });
        
        if (isEmail(identifier)) {
            // --- SEND EMAIL ---
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: identifier,
                subject: "Your CropCure Login OTP",
                text: `Your OTP for login is ${otp}. It expires in 5 minutes.`
            }).catch(emailError => console.log("Email blocked by Render Free Tier, but OTP is in logs."));
        } else {
            // --- SEND REAL SMS ---
            // Fire and forget, just like the email
            twilioClient.messages.create({
                body: `Your CropCure OTP is ${otp}. It expires in 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: identifier // WARNING: User must type their country code (e.g., +919876543210)
            }).then(() => {
                console.log("✅ SMS successfully sent to phone!");
            }).catch(smsError => {
                console.log("❌ Twilio Error: SMS failed. Did you include the +91 country code? Or are your API keys missing?");
            });
        }
        
        res.status(200).json({ message: 'OTP processed successfully' });

    } catch (error) {
        console.error("Fatal Server Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        const data = otpStore.get(identifier);
        
        if (!data || data.otp !== otp || Date.now() > data.expires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const searchQuery = isEmail(identifier) ? { email: identifier } : { phone: identifier };
        let user = await User.findOne(searchQuery);

        if (!user) {
            user = await User.create({ 
                username: isEmail(identifier) ? identifier.split('@')[0] : `User_${identifier.slice(-4)}`, 
                email: isEmail(identifier) ? identifier : undefined, 
                phone: isEmail(identifier) ? undefined : identifier,
                password: Math.random().toString(36).slice(-8) + 'A1!' 
            });
        }

        otpStore.delete(identifier);
        res.status(200).json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            phone: user.phone,
            token: generateToken(user._id) 
        });
    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};