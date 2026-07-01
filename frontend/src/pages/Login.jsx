import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ChevronRight, CornerDownLeft, Loader2 } from 'lucide-react';

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
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    // Translations mapping
    const t = {
        en: {
            title: "Welcome Back",
            subtitle: "Please enter your farmer credentials to access your registry",
            emailOrPhone: "Email or Phone",
            placeholderId: "farmer@example.com or 10-digit phone",
            password: "Password",
            forgotPassword: "Forgot Password?",
            signIn: "Sign In",
            loggingIn: "Logging in...",
            donthave: "Don't have an account?",
            registerHere: "Register here",
            recoverTitle: "Recover Password",
            recoverSub: "Enter your credentials to receive a 6-digit verification code",
            sendOtp: "Send Recovery OTP",
            sending: "Sending...",
            backLogin: "Back to Login",
            newPassTitle: "Choose New Password",
            newPassSub: "Enter the OTP sent to your recovery channel to reset credentials",
            otpLabel: "6-Digit Verification Code",
            newPassLabel: "New Password",
            newPassPlaceholder: "Create a strong password",
            updating: "Updating...",
            resetBtn: "Reset Password",
            changePhoneEmail: "Change Phone/Email",
            errorOtp: "Please enter your email or phone number first.",
            otpSent: "Recovery OTP sent to ",
            successReset: "Password reset success",
            fillFields: "Please fill out all fields.",
            promoTitle: "Optimize Field Yields and Prevent Fungal Infections.",
            promoDesc: "CropCure leverages advanced machine learning to detect plant leaf anomalies, coordinates-based reverse geocoding to predict localized downpours, and weather-adjusted soil hydration advice.",
            promoFeat1Title: "State-of-the-Art AI Diagnosis",
            promoFeat1Desc: "Upload diseased leaves to receive chemical & organic plans",
            promoFeat2Title: "Soil Water Adjustments",
            promoFeat2Desc: "Schedule watering tailored to weather, acreage, and methods"
        },
        es: {
            title: "Bienvenido de Nuevo",
            subtitle: "Ingrese sus credenciales de agricultor para acceder a su registro",
            emailOrPhone: "Correo o Teléfono",
            placeholderId: "agricultor@ejemplo.com o 10 dígitos",
            password: "Contraseña",
            forgotPassword: "¿Olvidó su contraseña?",
            signIn: "Iniciar Sesión",
            loggingIn: "Iniciando sesión...",
            donthave: "¿No tiene una cuenta?",
            registerHere: "Regístrese aquí",
            recoverTitle: "Recuperar Contraseña",
            recoverSub: "Ingrese sus credenciales para recibir un código de verificación de 6 dígitos",
            sendOtp: "Enviar OTP de Recuperación",
            sending: "Enviando...",
            backLogin: "Volver a Iniciar Sesión",
            newPassTitle: "Elegir Nueva Contraseña",
            newPassSub: "Ingrese la OTP enviada a su canal de recuperación para restablecer credenciales",
            otpLabel: "Código de Verificación de 6 Dígitos",
            newPassLabel: "Nueva Contraseña",
            newPassPlaceholder: "Cree una contraseña segura",
            updating: "Actualizando...",
            resetBtn: "Restablecer Contraseña",
            changePhoneEmail: "Cambiar Teléfono/Correo",
            errorOtp: "Ingrese su correo o número de teléfono primero.",
            otpSent: "¡OTP de recuperación enviado a ",
            successReset: "Contraseña restablecida con éxito",
            fillFields: "Complete todos los campos.",
            promoTitle: "Optimice el rendimiento de su campo y prevenga hongos.",
            promoDesc: "CropCure utiliza aprendizaje automático para detectar anomalías en hojas, geolocalización para predecir lluvias y pautas inteligentes de riego.",
            promoFeat1Title: "Diagnóstico de IA de Vanguardia",
            promoFeat1Desc: "Suba hojas enfermas para recibir planes de curación orgánicos y químicos",
            promoFeat2Title: "Ajustes de Agua del Suelo",
            promoFeat2Desc: "Programe el riego adaptado al clima, el área y los métodos"
        },
        hi: {
            title: "स्वागत है",
            subtitle: "अपने फार्म रजिस्ट्री तक पहुँचने के लिए अपनी क्रेडेंशियल दर्ज करें",
            emailOrPhone: "ईमेल या फोन नंबर",
            placeholderId: "farmer@example.com या 10 अंकों का फोन",
            password: "पासवर्ड",
            forgotPassword: "पासवर्ड भूल गए?",
            signIn: "साइन इन करें",
            loggingIn: "लॉग इन हो रहा है...",
            donthave: "खाता नहीं है?",
            registerHere: "यहाँ पंजीकरण करें",
            recoverTitle: "पासवर्ड पुनर्प्राप्त करें",
            recoverSub: "6-अंकीय सत्यापन कोड प्राप्त करने के लिए अपनी क्रेडेंशियल दर्ज करें",
            sendOtp: "रिकवरी ओटीपी भेजें",
            sending: "भेजा जा रहा है...",
            backLogin: "लॉगिन पर वापस जाएं",
            newPassTitle: "नया पासवर्ड चुनें",
            newPassSub: "क्रेडेंशियल रीसेट करने के लिए रिकवरी चैनल पर भेजा गया ओटीपी दर्ज करें",
            otpLabel: "6-अंकीय सत्यापन कोड",
            newPassLabel: "नया पासवर्ड",
            newPassPlaceholder: "एक मजबूत पासवर्ड बनाएं",
            updating: "अपडेट हो रहा है...",
            resetBtn: "पासवर्ड रीसेट करें",
            changePhoneEmail: "फोन/ईमेल बदलें",
            errorOtp: "कृपया पहले अपना ईमेल या फोन नंबर दर्ज करें।",
            otpSent: "रिकवरी ओटीपी भेजा गया है: ",
            successReset: "पासवर्ड सफलतापूर्वक रीसेट किया गया",
            fillFields: "कृपया सभी फ़ील्ड भरें।",
            promoTitle: "फसल की पैदावार बढ़ाएं और रोगों से बचाएं।",
            promoDesc: "क्रॉपक्योर फसल के पत्तों की विसंगतियों का पता लगाने के लिए उन्नत मशीन लर्निंग और मौसम-आधारित स्मार्ट सिंचाई का उपयोग करता है।",
            promoFeat1Title: "अत्याधुनिक एआई फसल निदान",
            promoFeat1Desc: "जैविक और रासायनिक उपचार प्राप्त करने के लिए बीमार पत्तियों की फोटो अपलोड करें",
            promoFeat2Title: "स्मार्ट सिंचाई समायोजन",
            promoFeat2Desc: "मौसम, क्षेत्र और सिंचाई विधियों के अनुरूप पानी देने का शेड्यूल बनाएं"
        }
    };
    const lang = t[language] || t.en;

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
        if (!identifier) return alert(lang.errorOtp);
        
        setLoading(true);
        const formattedId = getFormattedIdentifier();
        try {
            await api.post('/auth/request-otp', { identifier: formattedId });
            setView('forgot-reset'); // Move to the OTP entry screen
            alert(`${lang.otpSent}${formattedId}!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    // --- VERIFY OTP & CHANGE PASSWORD ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return alert(lang.fillFields);

        setLoading(true);
        const formattedId = getFormattedIdentifier();
        try {
            const res = await api.post('/auth/reset-password', { 
                identifier: formattedId, 
                otp, 
                newPassword 
            });
            alert(res.data.message || lang.successReset);
            
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
                        {lang.promoTitle}
                    </h1>
                    <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                        {lang.promoDesc}
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">🩺</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">{lang.promoFeat1Title}</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">{lang.promoFeat1Desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">💧</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">{lang.promoFeat2Title}</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">{lang.promoFeat2Desc}</p>
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
                                    {lang.title}
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    {lang.subtitle}
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        {lang.emailOrPhone}
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder={lang.placeholderId}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                        required 
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {lang.password}
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={() => setView('forgot-request')} 
                                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-transparent border-none cursor-pointer hover:underline p-0"
                                        >
                                            {lang.forgotPassword}
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
                                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                                >
                                    {loading ? lang.loggingIn : lang.signIn}
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
                                    {lang.recoverTitle}
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    {lang.recoverSub}
                                </p>
                            </div>
                            
                            <form onSubmit={handleSendResetOtp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        {lang.emailOrPhone}
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder={lang.placeholderId}
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
                                    {loading ? lang.sending : lang.sendOtp}
                                </button>
                            </form>

                            <button 
                                onClick={() => setView('login')} 
                                className="w-full mt-4 bg-transparent border-none text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                            >
                                <CornerDownLeft size={14} />
                                <span>{lang.backLogin}</span>
                            </button>
                        </div>
                    )}

                    {/* --- FORGOT PASSWORD: ENTER OTP & NEW PASSWORD --- */}
                    {view === 'forgot-reset' && (
                        <div className="animate-fade-in">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {lang.newPassTitle}
                                </h2>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                    {lang.newPassSub}
                                </p>
                            </div>
                            
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                        {lang.otpLabel}
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
                                        {lang.newPassLabel}
                                    </label>
                                    <input 
                                        type="password" 
                                        placeholder={lang.newPassPlaceholder}
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
                                    {loading ? lang.updating : lang.resetBtn}
                                </button>
                            </form>
                            
                            <button 
                                onClick={() => setView('forgot-request')} 
                                className="w-full mt-4 bg-transparent border-none text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:underline flex items-center justify-center gap-1.5"
                            >
                                <CornerDownLeft size={14} />
                                <span>{lang.changePhoneEmail}</span>
                            </button>
                        </div>
                    )}

                    {/* Register Link (Only shows on main login view) */}
                    {view === 'login' && (
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 text-center text-xs text-slate-500 dark:text-slate-400">
                            {lang.donthave}{' '}
                            <Link to="/register" className="text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline no-underline transition">
                                {lang.registerHere}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;