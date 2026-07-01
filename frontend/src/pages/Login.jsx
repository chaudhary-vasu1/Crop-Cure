import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Sparkles, Navigation, ChevronRight, CornerDownLeft } from 'lucide-react';

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
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
            {/* Left Decorative Split Panel */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex-col justify-between p-12 text-white relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                
                {/* Header Logo */}
                <div className="flex items-center gap-2.5 z-10">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl select-none">🌾</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">CropCure</span>
                </div>

                {/* Promotional content block */}
                <div className="my-auto z-10 max-w-md text-left flex flex-col gap-6">
                    <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                        Optimize Field Yields and Prevent Fungal Infections.
                    </h1>
                    <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                        CropCure leverages advanced machine learning to detect plant leaf anomalies, coordinates-based reverse geocoding to predict localized downpours, and weather-adjusted soil hydration advice.
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">🩺</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">State-of-the-Art AI Diagnosis</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">Upload diseased leaves to receive chemical & organic plans</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">💧</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">Soil Water Adjustments</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">Schedule watering tailored to weather, acreage, and methods</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="z-10 text-xs text-emerald-200/70">
                    © 2026 CropCure Agricultural Technologies Inc.
                </div>
            </div>

            {/* Right Form split panel */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 z-10 relative">
                
                {/* Decorative mesh circle on right background */}
                <div className="absolute right-[-100px] top-[-100px] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/45 animate-scale-in text-left">
                    
                    {/* Brand banner visible only on mobile */}
                    <div className="flex items-center gap-2 mb-8 md:hidden justify-center">
                        <span className="text-2xl">🌾</span>
                        <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
                            Crop<span className="text-emerald-500">Cure</span>
                        </span>
                    </div>

                    {/* --- STANDARD LOGIN VIEW --- */}
                    {view === 'login' && (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Welcome Back
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    Please enter your farmer credentials to access your registry
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Email or Phone
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="farmer@example.com or 10-digit phone" 
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                        required 
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('forgot-request')} 
                                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-transparent border-none cursor-pointer hover:underline p-0"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Logging in...' : 'Sign In'}
                                    <ChevronRight size={16} />
                                </button>
                            </form>
                        </>
                    )}

                    {/* --- FORGOT PASSWORD: ASK FOR EMAIL/PHONE --- */}
                    {view === 'forgot-request' && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Recover Password
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    Enter your credentials to receive a 6-digit verification code
                                </p>
                            </div>
                            
                            <form onSubmit={handleSendResetOtp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        Email or Phone
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="farmer@example.com or 10-digit phone" 
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center gap-1.5"
                                >
                                    {loading ? 'Sending...' : 'Send Recovery OTP'}
                                </button>
                            </form>

                            <button 
                                onClick={() => setView('login')} 
                                className="w-full mt-4 bg-transparent border-none text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                            >
                                <CornerDownLeft size={14} />
                                <span>Back to Login</span>
                            </button>
                        </div>
                    )}

                    {/* --- FORGOT PASSWORD: ENTER OTP & NEW PASSWORD --- */}
                    {view === 'forgot-reset' && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Choose New Password
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    Enter the OTP sent to your recovery channel to reset credentials
                                </p>
                            </div>
                            
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        6-Digit Verification Code
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="123456" 
                                        value={otp}
                                        maxLength={6}
                                        onChange={(e) => setOtp(e.target.value)} 
                                        className="w-full px-4 py-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-center text-lg font-black tracking-widest text-emerald-700 dark:text-emerald-400"
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        New Password
                                    </label>
                                    <input 
                                        type="password" 
                                        placeholder="Create a strong password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center gap-1.5"
                                >
                                    {loading ? 'Updating...' : 'Reset Password'}
                                </button>
                            </form>
                            
                            <button 
                                onClick={() => setView('forgot-request')} 
                                className="w-full mt-4 bg-transparent border-none text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                            >
                                <CornerDownLeft size={14} />
                                <span>Change Phone/Email</span>
                            </button>
                        </div>
                    )}

                    {/* Register Link (Only shows on main login view) */}
                    {view === 'login' && (
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 text-center text-xs text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline no-underline transition">
                                Register here
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;