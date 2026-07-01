import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { ChevronRight, CornerDownLeft } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState(''); // Handles both Email or Phone
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    // UI Flow State: false = entering details, true = entering OTP
    const [isOtpSent, setIsOtpSent] = useState(false); 
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const { language } = useContext(AppContext);
    const navigate = useNavigate();

    // Translations mapping
    const t = {
        en: {
            title: "Create an Account",
            subtitle: "Sign up to create your farm plots and monitor health",
            usernameLabel: "Username",
            usernamePlaceholder: "Choose a Username",
            emailOrPhone: "Email or Phone Number",
            placeholderId: "farmer@example.com or 10-digit phone",
            passwordLabel: "Password",
            passwordPlaceholder: "Create a Password",
            verifyTitle: "Verify Your Identity",
            verifySub: "We sent a 6-digit confirmation code to your device",
            otpLabel: "Enter 6-Digit OTP Code",
            otpPlaceholder: "123456",
            btnRequestOtp: "Request OTP",
            btnVerifyRegister: "Verify & Register",
            processing: "Processing...",
            changeDetails: "Change registration details",
            alreadyHave: "Already have an account?",
            loginHere: "Login here",
            fillFields: "Please fill out all fields before requesting an OTP.",
            otpSent: "OTP sent successfully to ",
            enterOtpError: "Please enter the OTP code sent to you.",
            promoTitle: "Join Thousands of Smart Farmers Today.",
            promoDesc: "Create an account to track diagnostics timelines, coordinate weather forecast updates, and retrieve irrigation advisory insights to double field output efficiency.",
            promoFeat1Title: "Comprehensive Crop Registry",
            promoFeat1Desc: "Define soil type, acres area, and irrigation details",
            promoFeat2Title: "Analytics Timelines",
            promoFeat2Desc: "Track contagion history trends and organic cures progress"
        },
        es: {
            title: "Crear una Cuenta",
            subtitle: "Regístrese para crear sus parcelas y monitorear la salud",
            usernameLabel: "Nombre de Usuario",
            usernamePlaceholder: "Elija un Nombre de Usuario",
            emailOrPhone: "Correo o Número de Teléfono",
            placeholderId: "agricultor@ejemplo.com o 10 dígitos",
            passwordLabel: "Contraseña",
            passwordPlaceholder: "Cree una Contraseña",
            verifyTitle: "Verifique su Identidad",
            verifySub: "Enviamos un código de confirmación de 6 dígitos a su dispositivo",
            otpLabel: "Ingrese el Código OTP de 6 Dígitos",
            otpPlaceholder: "123456",
            btnRequestOtp: "Solicitar OTP",
            btnVerifyRegister: "Verificar y Registrarse",
            processing: "Procesando...",
            changeDetails: "Cambiar detalles de registro",
            alreadyHave: "¿Ya tiene una cuenta?",
            loginHere: "Inicie sesión aquí",
            fillFields: "Complete todos los campos antes de solicitar el OTP.",
            otpSent: "¡OTP enviado con éxito a ",
            enterOtpError: "Ingrese el código OTP que le fue enviado.",
            promoTitle: "Únase a miles de agricultores inteligentes hoy.",
            promoDesc: "Cree una cuenta para monitorear el progreso de tratamientos, ver el clima en vivo y optimizar el uso de agua en su campo.",
            promoFeat1Title: "Registro Completo de Cultivos",
            promoFeat1Desc: "Defina el suelo, el área en acres y el método de irrigación",
            promoFeat2Title: "Historial de Análisis",
            promoFeat2Desc: "Siga la evolución de las enfermedades y aplique remedios orgánicos"
        },
        hi: {
            title: "खाता बनाएं",
            subtitle: "अपने खेत के प्लॉट बनाने और स्वास्थ्य की निगरानी के लिए साइन अप करें",
            usernameLabel: "उपयोगकर्ता नाम",
            usernamePlaceholder: "एक उपयोगकर्ता नाम चुनें",
            emailOrPhone: "ईमेल या फोन नंबर",
            placeholderId: "farmer@example.com या 10 अंकों का फोन",
            passwordLabel: "पासवर्ड",
            passwordPlaceholder: "एक पासवर्ड बनाएं",
            verifyTitle: "अपनी पहचान सत्यापित करें",
            verifySub: "हमने आपके डिवाइस पर 6-अंकीय पुष्टिकरण कोड भेजा है",
            otpLabel: "6-अंकीय ओटीपी कोड दर्ज करें",
            otpPlaceholder: "123456",
            btnRequestOtp: "ओटीपी का अनुरोध करें",
            btnVerifyRegister: "सत्यापित करें और पंजीकरण करें",
            processing: "प्रसंस्करण हो रहा है...",
            changeDetails: "पंजीकरण विवरण बदलें",
            alreadyHave: "पहले से ही एक खाता है?",
            loginHere: "यहाँ लॉगिन करें",
            fillFields: "कृपया ओटीपी का अनुरोध करने से पहले सभी फ़ील्ड भरें।",
            otpSent: "ओटीपी सफलतापूर्वक भेजा गया है: ",
            enterOtpError: "कृपया आपको भेजा गया ओटीपी कोड दर्ज करें।",
            promoTitle: "आज ही हजारों स्मार्ट किसानों से जुड़ें।",
            promoDesc: "उपचार प्रगति की निगरानी करने, लाइव मौसम देखने और जल दक्षता को अनुकूलित करने के लिए एक खाता बनाएं।",
            promoFeat1Title: "व्यापक फसल रजिस्ट्री",
            promoFeat1Desc: "मिट्टी का प्रकार, क्षेत्र और सिंचाई विधि निर्दिष्ट करें",
            promoFeat2Title: "विश्लेषण टाइमलाइन",
            promoFeat2Desc: "फसल रोग के इतिहास और जैविक उपचार प्रगति को ट्रैक करें"
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

    // STEP 1: Request the OTP from the backend
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!username || !identifier || !password) {
            alert(lang.fillFields);
            return;
        }

        setLoading(true);
        const formattedId = getFormattedIdentifier();

        try {
            await api.post('/auth/request-otp', { identifier: formattedId });
            setIsOtpSent(true);
            alert(`${lang.otpSent}${formattedId}!`);
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
            alert(lang.enterOtpError);
            return;
        }

        setLoading(true);
        const formattedId = getFormattedIdentifier();

        try {
            const res = await api.post('/auth/register', { 
                username, 
                identifier: formattedId, 
                password, 
                otp
            });
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
                        {lang.promoTitle}
                    </h1>
                    <p className="text-sm text-emerald-100 leading-relaxed font-medium">
                        {lang.promoDesc}
                    </p>
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">🌱</span>
                            <div className="text-left">
                                <h4 className="text-sm font-bold">{lang.promoFeat1Title}</h4>
                                <p className="text-xs text-emerald-200 mt-0.5">{lang.promoFeat1Desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl">📊</span>
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
                            {isOtpSent ? lang.verifyTitle : lang.title}
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                            {isOtpSent ? lang.verifySub : lang.subtitle}
                        </p>
                    </div>

                    <form onSubmit={isOtpSent ? handleRegisterAndVerify : handleSendOtp} className="space-y-4">
                        
                        {/* Username Input */}
                        <div>
                            <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                {lang.usernameLabel}
                            </label>
                            <input 
                                type="text" 
                                placeholder={lang.usernamePlaceholder}
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
                                {lang.emailOrPhone}
                            </label>
                            <input 
                                type="text" 
                                placeholder={lang.placeholderId}
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
                                placeholder={lang.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={isOtpSent}
                                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-gray-950/50 disabled:bg-slate-100 dark:disabled:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all text-sm font-medium text-slate-800 dark:text-white"
                                required 
                            />
                        </div>

                        {/* Conditional OTP Field */}
                        {isOtpSent && (
                            <div className="animate-fade-in">
                                <label className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    {lang.otpLabel}
                                </label>
                                <input 
                                    type="text" 
                                    placeholder={lang.otpPlaceholder}
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
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition-all shadow-md active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                        >
                            {loading ? lang.processing : isOtpSent ? lang.btnVerifyRegister : lang.btnRequestOtp}
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
                            <span>{lang.changeDetails}</span>
                        </button>
                    )}

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 text-center text-xs text-slate-500 dark:text-slate-400">
                        {lang.alreadyHave}{' '}
                        <Link to="/login" className="text-emerald-650 hover:text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline no-underline transition">
                            {lang.loginHere}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;