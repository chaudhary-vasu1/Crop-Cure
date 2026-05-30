import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

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
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper function to detect Email vs Phone Number
const isEmail = (identifier) => identifier.includes('@');

// Helper function to automatically format 10-digit Indian numbers to E.164 standard
const formatIdentifier = (identifier) => {
    if (!isEmail(identifier)) {
        let clean = identifier.trim();
        // If it's a 10-digit number, prepend +91
        if (!clean.startsWith('+') && clean.length === 10) {
            return `+91${clean}`;
        }
        return clean;
    }
    return identifier.trim().toLowerCase();
};

// --- REGISTER USER (Manual Registration) ---
export const registerUser = async (req, res) => {
    try {
        const { username, identifier, password } = req.body;
        const formattedIdentifier = formatIdentifier(identifier);
        
        // Search by email OR phone depending on what they typed
        const searchQuery = isEmail(formattedIdentifier) ? { email: formattedIdentifier } : { phone: formattedIdentifier };
        const userExists = await User.findOne(searchQuery);
        
        if (userExists) return res.status(400).json({ message: 'User already exists with this email or phone number' });

        // Save to the correct column in MongoDB
        const user = await User.create({ 
            username, 
            email: isEmail(formattedIdentifier) ? formattedIdentifier : undefined, 
            phone: isEmail(formattedIdentifier) ? undefined : formattedIdentifier,
            password 
        });

        if (user) {
            res.status(201).json({ 
                _id: user._id, 
                username: user.username, 
                email: user.email, 
                phone: user.phone,
                token: generateToken(user._id) 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- LOGIN USER (Manual Login) ---
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' field handles both identifiers here
        const formattedIdentifier = formatIdentifier(email);

        const searchQuery = isEmail(formattedIdentifier) ? { email: formattedIdentifier } : { phone: formattedIdentifier };
        const user = await User.findOne(searchQuery).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({ 
                _id: user._id, 
                username: user.username, 
                email: user.email, 
                phone: user.phone,
                token: generateToken(user._id) 
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- REQUEST OTP ---
export const requestOtp = async (req, res) => {
    try {
        const { identifier } = req.body;
        const formattedIdentifier = formatIdentifier(identifier);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        console.log(`\n--- OTP REQUESTED ---`);
        console.log(`Target: ${formattedIdentifier}`);
        console.log(`Type: ${isEmail(formattedIdentifier) ? 'Email' : 'Phone Number'}`);
        console.log(`Generated OTP: ${otp}`); 
        console.log(`---------------------\n`);

        otpStore.set(formattedIdentifier, { otp, expires: Date.now() + 300000 });
        
        if (isEmail(formattedIdentifier)) {
            // Added 'await' so the server waits for Google to confirm the email was sent
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: formattedIdentifier,
                subject: "Your CropCure Login OTP",
                text: `Your OTP for login is ${otp}. It expires in 5 minutes.`
            });
            console.log(`✅ Email sent successfully to ${formattedIdentifier}`);
            return res.status(200).json({ message: 'OTP sent successfully to your email!' });

        } else {
            // Added 'await' so the server waits for Twilio to confirm the text was sent
            await twilioClient.messages.create({
                body: `Your CropCure OTP is ${otp}. It expires in 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: formattedIdentifier
            });
            console.log(`✅ SMS sent successfully to ${formattedIdentifier}`);
            return res.status(200).json({ message: 'OTP sent successfully to your phone!' });
        }
        
    } catch (error) {
        console.error("Fatal OTP Error:", error);
        // If Twilio blocks the unverified number, it jumps straight here and alerts the frontend
        res.status(500).json({ message: 'Failed to send OTP. If using a phone number, it may not be verified in Twilio.', error: error.message });
    }
};

// --- VERIFY OTP ---
export const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        const formattedIdentifier = formatIdentifier(identifier);
        const data = otpStore.get(formattedIdentifier);
        
        if (!data || data.otp !== otp || Date.now() > data.expires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const searchQuery = isEmail(formattedIdentifier) ? { email: formattedIdentifier } : { phone: formattedIdentifier };
        let user = await User.findOne(searchQuery);

        if (!user) {
            user = await User.create({ 
                username: isEmail(formattedIdentifier) ? formattedIdentifier.split('@')[0] : `User_${formattedIdentifier.slice(-4)}`, 
                email: isEmail(formattedIdentifier) ? formattedIdentifier : undefined, 
                phone: isEmail(formattedIdentifier) ? undefined : formattedIdentifier,
                password: Math.random().toString(36).slice(-8) + 'A1!' 
            });
        }

        otpStore.delete(formattedIdentifier);
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

// --- RESET PASSWORD ---
export const resetPassword = async (req, res) => {
    try {
        const { identifier, otp, newPassword } = req.body;
        const formattedIdentifier = formatIdentifier(identifier);
        
        // 1. Check if the OTP is valid
        const data = otpStore.get(formattedIdentifier);
        if (!data || data.otp !== otp || Date.now() > data.expires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 2. Find the user in the database
        const searchQuery = isEmail(formattedIdentifier) ? { email: formattedIdentifier } : { phone: formattedIdentifier };
        const user = await User.findOne(searchQuery);

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email or phone number.' });
        }

        // 3. Update the password and save
        user.password = newPassword; 
        await user.save(); // Your User model will automatically hash the new password!

        // 4. Delete the OTP so it can't be reused
        otpStore.delete(formattedIdentifier);
        
        res.status(200).json({ message: 'Password reset successfully. You can now log in!' });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};