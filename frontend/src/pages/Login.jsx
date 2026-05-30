import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 = Request, 2 = Verify
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        try {
            // Using your existing api utility
            await api.post('/auth/request-otp', { identifier });
            setStep(2);
        } catch (err) {
            alert('Failed to send OTP. Please check your network.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            // This verifies the OTP and returns the same token structure as your old login
            const res = await api.post('/auth/verify-otp', { identifier, otp });
            
            // Reusing your existing login function from AuthContext keeps everything else working
            login(res.data);
            navigate('/');
        } catch (err) {
            alert('Invalid or expired OTP. Please try again.');
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Login with Email/Phone</h2>
                        <input 
                            type="text" 
                            placeholder="Enter Email or Phone" 
                            onChange={(e) => setIdentifier(e.target.value)} 
                            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                            required 
                        />
                        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Send OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Verify OTP</h2>
                        <input 
                            type="text" 
                            placeholder="Enter 6-digit OTP" 
                            onChange={(e) => setOtp(e.target.value)} 
                            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                            required 
                        />
                        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Verify & Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;