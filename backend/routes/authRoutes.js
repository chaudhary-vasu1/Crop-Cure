import express from 'express';
import { 
    registerUser, 
    loginUser, 
    requestOtp, 
    verifyOtp 
} from '../controllers/authController.js';

const router = express.Router();

// Existing routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW OTP routes
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

export default router;