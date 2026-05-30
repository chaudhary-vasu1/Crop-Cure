import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            await api.post('/auth/request-otp', { identifier });
            setStep(2);
        } catch (err) {
            alert('Failed to send OTP. Please check your network.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/verify-otp', { identifier, otp });
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
                            name="identifier"
                            value={identifier} // Forces the box to show the exact state
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
                            name="otp"
                            value={otp} // Forces the box to be empty when step 2 starts
                            maxLength="6" // Restricts input to exactly 6 characters
                            autoComplete="one-time-code" // Tells the browser this is an OTP box
                            placeholder="Enter 6-digit OTP" 
                            onChange={(e) => setOtp(e.target.value)} 
                            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', textAlign: 'center', letterSpacing: '0.25rem', fontSize: '1.25rem' }} 
                            required 
                        />
                        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Verify & Login
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#059669', textDecoration: 'none', fontWeight: 'bold' }}>
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;