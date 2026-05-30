import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState(''); // Handles both Email or Phone
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    // UI Flow State: false = entering details, true = entering OTP
    const [isOtpSent, setIsOtpSent] = useState(false); 
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Helper to format 10-digit phone numbers automatically
    const getFormattedIdentifier = () => {
        let finalIdentifier = identifier.trim();
        if (!finalIdentifier.includes('@') && !finalIdentifier.startsWith('+') && finalIdentifier.length === 10) {
            return `+91${finalIdentifier}`;
        }
        return finalIdentifier;
    };

    // STEP 1: Request the OTP from the backend
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!username || !identifier || !password) {
            alert('Please fill out all fields before requesting an OTP.');
            return;
        }

        setLoading(true);
        const formattedId = getFormattedIdentifier();

        try {
            // Call the OTP request endpoint
            await api.post('/auth/request-otp', { identifier: formattedId });
            setIsOtpSent(true);
            alert(`OTP sent successfully to ${formattedId}!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Submit Registration data along with OTP verification
    const handleRegisterAndVerify = async (e) => {
        e.preventDefault();
        if (!otp) {
            alert('Please enter the OTP code sent to you.');
            return;
        }

        setLoading(true);
        const formattedId = getFormattedIdentifier();

        try {
            // First: Verify the OTP code
            await api.post('/auth/verify-otp', { 
                identifier: formattedId, 
                otp 
            });

            // Second: If OTP is valid, proceed with creating the permanent user account
            const res = await api.post('/auth/register', { 
                username, 
                identifier: formattedId, 
                password 
            });
            
            // Automatically log them in after successful registration
            login(res.data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Verification or Registration failed. Please check your OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {isOtpSent ? 'Verify Your Identity' : 'Create an Account'}
                </h2>

                <form onSubmit={isOtpSent ? handleRegisterAndVerify : handleSendOtp}>
                    
                    {/* Username Input */}
                    <input 
                        type="text" 
                        placeholder="Choose a Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        disabled={isOtpSent} // Lock field when OTP is sent
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', backgroundColor: isOtpSent ? '#f3f4f6' : 'white' }} 
                        required 
                    />
                    
                    {/* Email/Phone Input */}
                    <input 
                        type="text" 
                        placeholder="Email or Phone Number" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)} 
                        disabled={isOtpSent} // Lock field when OTP is sent
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', backgroundColor: isOtpSent ? '#f3f4f6' : 'white' }} 
                        required 
                    />
                    
                    {/* Password Input */}
                    <input 
                        type="password" 
                        placeholder="Create a Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={isOtpSent} // Lock field when OTP is sent
                        style={{ width: '100%', padding: '0.75rem', marginBottom: isOtpSent ? '1rem' : '1.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', backgroundColor: isOtpSent ? '#f3f4f6' : 'white' }} 
                        required 
                    />

                    {/* Conditional OTP Field (Only shows up during Step 2) */}
                    {isOtpSent && (
                        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                Enter the 6-Digit OTP code:
                            </label>
                            <input 
                                type="text" 
                                placeholder="Verification Code (6 Digits)" 
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', border: '2px solid #059669', borderRadius: '0.25rem', letterSpacing: '2px', textAlign: 'center', fontSize: '1.125rem', fontWeight: 'bold' }} 
                                required 
                            />
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', backgroundColor: isOtpSent ? '#047857' : '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Processing...' : isOtpSent ? 'Verify & Register' : 'Send OTP'}
                    </button>
                </form>

                {/* Back tracking option to clear OTP screen if typo made */}
                {isOtpSent && (
                    <button 
                        onClick={() => setIsOtpSent(false)} 
                        style={{ width: '100%', marginTop: '0.75rem', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                    >
                        Change registration details
                    </button>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#059669', textDecoration: 'none', fontWeight: 'bold' }}>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;