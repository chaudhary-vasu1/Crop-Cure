import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Shield, Sparkles, Navigation, ChevronRight, CornerDownLeft } from 'lucide-react';

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
            // Call register directly with OTP. The backend will verify OTP and create the user atomically.
            const res = await api.post('/auth/register', { 
                username, 
                identifier: formattedId, 
                password, 
                otp
            });
            
            // Automatically log them in after successful registration
            login(res.data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed. Please check your OTP.');
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
                        Join Thousands of Smart Farmers Today.
                    </h1>
                    <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                        Create an account to track diagnostics timelines, coordinate weather forecast updates, and retrieve irrigation advisory insights to double field output efficiency.
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">🌱</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">Comprehensive Crop Registry</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">Define soil type, acres area, and irrigation details</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">📊</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">Analytics Timelines</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">Track contagion history trends and organic cures progress</p>
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
                <div className="absolute left-[-100px] bottom-[-100px] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 dark:shadow-black/45 animate-scale-in text-left">
                    
                    {/* Brand banner visible only on mobile */}
                    <div className="flex items-center gap-2 mb-8 md:hidden justify-center">
                        <span className="text-2xl">🌾</span>
                        <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
                            Crop<span className="text-emerald-500">Cure</span>
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isOtpSent ? 'Verify Identity' : 'Get Started'}
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                            {isOtpSent 
                                ? 'We sent a 6-digit confirmation code to your device' 
                                : 'Sign up to create your farm plots and monitor health'}
                        </p>
                    </div>

                    <form onSubmit={isOtpSent ? handleRegisterAndVerify : handleSendOtp} className="space-y-4">
                        
                        {/* Username Input */}
                        <div>
                            <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <input 
                                type="text" 
                                placeholder="Choose a Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
                                disabled={isOtpSent}
                                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 disabled:bg-slate-100 dark:disabled:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                required 
                            />
                        </div>
                        
                        {/* Email/Phone Input */}
                        <div>
                            <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Email or Phone Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="farmer@example.com or 10-digit phone" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} 
                                disabled={isOtpSent}
                                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 disabled:bg-slate-100 dark:disabled:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                required 
                            />
                        </div>
                        
                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={isOtpSent}
                                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 disabled:bg-slate-100 dark:disabled:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                required 
                            />
                        </div>

                        {/* Conditional OTP Field (Only shows up during Step 2) */}
                        {isOtpSent && (
                            <div className="animate-fade-in">
                                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Enter 6-Digit OTP Code
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
                        )}
                        
                        {/* Action Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : isOtpSent ? 'Verify & Register' : 'Request OTP'}
                            <ChevronRight size={16} />
                        </button>
                    </form>

                    {/* Back tracking option to clear OTP screen if typo made */}
                    {isOtpSent && (
                        <button 
                            onClick={() => setIsOtpSent(false)} 
                            className="w-full mt-4 bg-transparent border-none text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                        >
                            <CornerDownLeft size={14} />
                            <span>Change registration details</span>
                        </button>
                    )}

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 text-center text-xs text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline no-underline transition">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;