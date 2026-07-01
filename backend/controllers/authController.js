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

// Helper function to automatically format 10-digit Indian numbers (strips leading 0 and +91 prefixes)
const formatIdentifier = (identifier) => {
    if (!identifier) return '';
    const clean = identifier.trim();
    if (isEmail(clean)) {
        return clean.toLowerCase();
    }
    
    // Normalize phone number to exactly 10 digits
    // 1. Remove all spaces, dashes, hyphens, parentheses, and leading plus sign
    let cleanPhone = clean.replace(/[\s-()+]/g, '');
    
    // 2. If it starts with '91' and is 12 digits (like '919876543210'), strip '91'
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
        cleanPhone = cleanPhone.slice(2);
    }
    
    // 3. If it starts with '0' (like '09876543210'), strip leading '0'
    if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
    }
    
    return cleanPhone;
};

export const registerUser = async (req, res) => {
    try {
        const { username, identifier, password } = req.body;
        const formattedIdentifier = formatIdentifier(identifier);
        
        // 1. Search by email OR phone depending on what they typed
        const searchQuery = isEmail(formattedIdentifier) ? { email: formattedIdentifier } : { phone: formattedIdentifier };
        let user = await User.findOne(searchQuery);
        
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists with this email or phone number' });
        }

        if (!user) {
            // Create user directly
            user = await User.create({ 
                username, 
                email: isEmail(formattedIdentifier) ? formattedIdentifier : undefined, 
                phone: isEmail(formattedIdentifier) ? undefined : formattedIdentifier,
                password,
                isVerified: true
            });
        } else {
            // Update details and mark verified directly
            user.username = username;
            user.password = password;
            user.isVerified = true;
            await user.save();
        }

        res.status(201).json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            phone: user.phone,
            token: generateToken(user._id) 
        });
    } catch (error) {
        console.error("Registration endpoint error details:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- LOGIN USER (Manual Login) ---
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' field handles both identifiers here
        const formattedIdentifier = formatIdentifier(email);

        const searchQuery = {
            $or: [
                { email: formattedIdentifier },
                { phone: formattedIdentifier },
                { username: { $regex: new RegExp(`^${email.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } }
            ]
        };

        // Log the exact searched query string in the database
        console.log(`[Auth Login] Searching database with identifier: "${formattedIdentifier}" (original input: "${email}")`);

        const user = await User.findOne(searchQuery).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Auto-verify if they managed to log in successfully
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
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
        if (process.env.NODE_ENV === 'development') {
            console.log(`Generated OTP: ${otp}`); 
        } else {
            console.log(`Generated OTP: [REDACTED]`);
        }
        console.log(`---------------------\n`);

        otpStore.set(formattedIdentifier, { otp, expires: Date.now() + 300000 });
        
        if (isEmail(formattedIdentifier)) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: formattedIdentifier,
                    subject: "Your CropCure Login OTP",
                    text: `Your OTP for login is ${otp}. It expires in 5 minutes.`
                });
                console.log(`✅ Email sent successfully to ${formattedIdentifier}`);
            } catch (mailError) {
                console.error(`⚠️ Email sending failed: ${mailError.message}`);
                console.log(`💡 OTP is printed in the logs above. Proceeding in development mode.`);
                if (process.env.NODE_ENV === 'production') {
                    throw mailError; // Throw error to fail request in production
                }
            }
            return res.status(200).json({ message: 'OTP sent successfully to your email!' });

        } else {
            try {
                await twilioClient.messages.create({
                    body: `Your CropCure OTP is ${otp}. It expires in 5 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: formattedIdentifier
                });
                console.log(`✅ SMS sent successfully to ${formattedIdentifier}`);
            } catch (smsError) {
                console.error(`⚠️ SMS sending failed: ${smsError.message}`);
                console.log(`💡 OTP is printed in the logs above. Proceeding in development mode.`);
                if (process.env.NODE_ENV === 'production') {
                    throw smsError; // Throw error to fail request in production
                }
            }
            return res.status(200).json({ message: 'OTP sent successfully to your phone!' });
        }
        
    } catch (error) {
        console.error("Fatal OTP Error:", error);
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

        res.status(200).json({ 
            message: 'OTP verified successfully!' 
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

// --- UPDATE USER PROFILE ---
export const updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        await user.save();
        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: { id: user._id, username: user.username, email: user.email, phone: user.phone } 
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// --- UPDATE PASSWORD ---
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ message: 'Server error updating password' });
    }
};