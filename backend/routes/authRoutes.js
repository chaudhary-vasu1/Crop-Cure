import express from 'express';
import { 
    registerUser, 
    loginUser, 
    requestOtp, 
    verifyOtp, 
    resetPassword,
    updateProfile,
    updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Standard Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// OTP Verification Flow (Used for both Registration & Login)
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Password Recovery Flow
router.post('/reset-password', resetPassword);

// Profile and Settings Management (Protected)
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, updatePassword);

export default router;