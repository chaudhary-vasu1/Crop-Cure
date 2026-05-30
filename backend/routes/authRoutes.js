import express from 'express';
import { 
    registerUser, 
    loginUser, 
    requestOtp, 
    verifyOtp, 
    resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

// Standard Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// OTP Verification Flow (Used for both Registration & Login)
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Password Recovery Flow
router.post('/reset-password', resetPassword);

export default router;