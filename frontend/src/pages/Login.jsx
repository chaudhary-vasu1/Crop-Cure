import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    // Shared State
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Forgot Password State
    const [view, setView] = useState('login'); // 'login' | 'forgot-request' | 'forgot-reset'
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    // --- NORMAL LOGIN ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email: identifier, password });
            login(res.data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    // --- REQUEST OTP FOR PASSWORD RESET ---
    const handleSendResetOtp = async (e) => {
        e.preventDefault();
        if (!identifier) return alert("Please enter your email or phone number first.");
        
        setLoading(true);
        const formattedId = getFormattedIdentifier();
        try {
            await api.post('/auth/request-otp', { identifier: formattedId });
            setView('forgot-reset'); // Move to the OTP entry screen
            alert(`Recovery OTP sent to ${formattedId}!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    // --- VERIFY OTP & CHANGE PASSWORD ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return alert("Please fill out all fields.");

        setLoading(true);
        const formattedId = getFormattedIdentifier();
        try {
            const res = await api.post('/auth/reset-password', { 
                identifier: formattedId, 
                otp, 
                newPassword 
            });
            alert(res.data.message);
            
            // Reset form and go back to normal login screen
            setPassword('');
            setOtp('');
            setNewPassword('');
            setView('login');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reset password. Check your OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                
                {/* --- STANDARD LOGIN VIEW --- */}
                {view === 'login' && (
                    <>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Welcome Back</h2>
                        <form onSubmit={handleLogin}>
                            <input 
                                type="text" 
                                placeholder="Email or Phone Number" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                                required 
                            />
                            
                            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                                <button type="button" onClick={() => setView('forgot-request')} style={{ background: 'none', border: 'none', color: '#059669', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}>
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </>
                )}

                {/* --- FORGOT PASSWORD: ASK FOR EMAIL/PHONE --- */}
                {view === 'forgot-request' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Reset Password</h2>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1.5rem' }}>Enter your email or phone number to receive a recovery code.</p>
                        
                        <form onSubmit={handleSendResetOtp}>
                            <input 
                                type="text" 
                                placeholder="Email or Phone Number" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                                required 
                            />
                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Sending...' : 'Send Recovery OTP'}
                            </button>
                        </form>
                        <button onClick={() => setView('login')} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', textDecoration: 'underline' }}>Back to Login</button>
                    </div>
                )}

                {/* --- FORGOT PASSWORD: ENTER OTP & NEW PASSWORD --- */}
                {view === 'forgot-reset' && (
                    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Create New Password</h2>
                        
                        <form onSubmit={handleResetPassword}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Enter the 6-Digit Code:</label>
                            <input 
                                type="text" 
                                placeholder="123456" 
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '2px solid #059669', borderRadius: '0.25rem', letterSpacing: '2px', textAlign: 'center', fontSize: '1.125rem', fontWeight: 'bold' }} 
                                required 
                            />
                            
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>New Password:</label>
                            <input 
                                type="password" 
                                placeholder="Create a new password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                                required 
                            />

                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>
                        <button onClick={() => setView('forgot-request')} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', textDecoration: 'underline' }}>Change Phone/Email</button>
                    </div>
                )}

                {/* Register Link (Only shows on main login view) */}
                {view === 'login' && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#059669', textDecoration: 'none', fontWeight: 'bold' }}>
                            Register here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;