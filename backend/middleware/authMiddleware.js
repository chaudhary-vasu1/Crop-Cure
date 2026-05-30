import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ✅ THE FIX: Changed decoded._id to decoded.id
            // Get user from the token payload (excluding the password)
            // and attach it to the request object for the next route to use
            req.user = await User.findById(decoded.id).select('-password');

            // 🛡️ Extra Safety Check: If user was deleted but token still exists
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            next(); // Move to the next middleware or controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};