import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { User, Shield, Moon, Sun, Globe, LogOut, Save } from 'lucide-react';
import api from '../utils/api';

const Settings = () => {
    const { theme, toggleTheme, language, setLanguage } = useContext(AppContext);
    const { user, logout, updateUser } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('profile'); // profile, preferences, security

    // Profile form state
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(null);
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Initial representing user avatar
    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
    const userContact = user?.email || user?.phone || 'No email or phone';

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveStatus(null);
        try {
            const response = await api.put('/auth/profile', { username });
            updateUser({ username: response.data.user.username });
            setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (err) {
            console.error(err);
            setSaveStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordSaving(true);
        setPasswordStatus(null);
        try {
            await api.put('/auth/change-password', { currentPassword, newPassword });
            setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            console.error(err);
            setPasswordStatus({ type: 'error', message: err.response?.data?.message || 'Failed to change password.' });
        } finally {
            setPasswordSaving(false);
        }
    };

    // Tab-based translation details
    const t = {
        en: {
            title: "Profile & Settings",
            editProfile: "Edit Profile",
            fullName: "Full Name / Username",
            contactInfo: "Contact Info (Read Only)",
            saveBtn: "Save Profile",
            security: "Security & Password",
            currentPass: "Current Password",
            newPass: "New Password",
            updatePassBtn: "Update Password",
            pref: "Preferences",
            appearance: "Appearance",
            appearanceDesc: "Toggle dark theme across the entire application.",
            langPref: "Language Preferences",
            langDesc: "Select your preferred language for the interface.",
            logoutBtn: "Logout"
        },
        es: {
            title: "Perfil y Ajustes",
            editProfile: "Editar Perfil",
            fullName: "Nombre Completo / Usuario",
            contactInfo: "Información de Contacto (Solo Lectura)",
            saveBtn: "Guardar Perfil",
            security: "Seguridad y Contraseña",
            currentPass: "Contraseña Actual",
            newPass: "Nueva Contraseña",
            updatePassBtn: "Actualizar Contraseña",
            pref: "Preferencias",
            appearance: "Apariencia",
            appearanceDesc: "Alternar tema oscuro en toda la aplicación.",
            langPref: "Preferencias de Idioma",
            langDesc: "Seleccione su idioma preferido para la interfaz.",
            logoutBtn: "Cerrar Sesión"
        },
        hi: {
            title: "प्रोफ़ाइल और सेटिंग्स",
            editProfile: "प्रोफ़ाइल संपादित करें",
            fullName: "पूरा नाम / उपयोगकर्ता नाम",
            contactInfo: "संपर्क जानकारी (केवल पढ़ने के लिए)",
            saveBtn: "प्रोफ़ाइल सहेजें",
            security: "सुरक्षा और पासवर्ड",
            currentPass: "वर्तमान पासवर्ड",
            newPass: "नया पासवर्ड",
            updatePassBtn: "पासवर्ड अपडेट करें",
            pref: "प्राथमिकताएं",
            appearance: "रूप-रंग",
            appearanceDesc: "संपूर्ण एप्लिकेशन में डार्क थीम सक्षम करें।",
            langPref: "भाषा प्राथमिकताएं",
            langDesc: "इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।",
            logoutBtn: "लॉगआउट"
        }
    };
    const lang = t[language] || t.en;

    return (
        <div className="max-w-4xl mx-auto mt-6 text-left">
            {/* SymptoGenie-style Purple Header Profile Banner */}
            <div className="relative p-6 sm:p-8 mb-8 text-white rounded-3xl shadow-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full sm:w-auto">
                    {/* Circle Avatar with User Initial */}
                    <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-4xl font-extrabold select-none shadow-md">
                        {userInitial}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-black mb-1 tracking-tight">
                            {user?.username || 'Farmer'}
                        </h2>
                        <p className="text-sm font-semibold opacity-85 uppercase tracking-wider">
                            {userContact}
                        </p>
                    </div>
                </div>
                <div className="z-10">
                    <button 
                        onClick={logout}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl shadow-md border-none cursor-pointer flex items-center gap-2 transition transform hover:scale-[1.03]"
                    >
                        <LogOut size={16} />
                        <span>{lang.logoutBtn}</span>
                    </button>
                </div>
                <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* SymptoGenie-style Settings Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 font-semibold overflow-x-auto text-sm">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3.5 px-5 border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap ${
                        activeTab === 'profile' 
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`pb-3.5 px-5 border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap ${
                        activeTab === 'preferences' 
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    Preferences
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3.5 px-5 border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap ${
                        activeTab === 'security' 
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    Security
                </button>
            </div>

            {/* Tab Panels */}
            <div className="p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 transition duration-300">
                {activeTab === 'profile' && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-850 dark:text-white mb-6">
                            {lang.editProfile}
                        </h3>

                        {saveStatus && (
                            <div className={`p-4 mb-6 rounded-xl text-sm font-semibold ${
                                saveStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                                {saveStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 max-w-xl">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                                    {lang.fullName}
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                                    {lang.contactInfo}
                                </label>
                                <input 
                                    type="text" 
                                    disabled 
                                    value={userContact}
                                    className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 outline-none cursor-not-allowed select-none"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl border-none cursor-pointer shadow-md flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    <span>{saving ? 'Saving...' : lang.saveBtn}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* 🌙 Theme Section */}
                        <div>
                            <div className="flex items-center gap-2 pb-2 mb-4 border-b dark:border-gray-700">
                                <Moon className="text-gray-500 dark:text-gray-450" size={20}/>
                                <h3 className="text-lg font-bold text-gray-750 dark:text-gray-200">{lang.appearance}</h3>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl dark:bg-gray-700/50">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Dark Mode</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lang.appearanceDesc}</p>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors rounded-lg border-none cursor-pointer ${
                                        theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'
                                    }`}
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>
                        </div>

                        {/* 🌍 Language Section */}
                        <div>
                            <div className="flex items-center gap-2 pb-2 mb-4 border-b dark:border-gray-700">
                                <Globe className="text-gray-500 dark:text-gray-450" size={20}/>
                                <h3 className="text-lg font-bold text-gray-750 dark:text-gray-200">{lang.langPref}</h3>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl dark:bg-gray-700/50">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Display Language</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lang.langDesc}</p>
                                </div>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg outline-none cursor-pointer hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                >
                                    <option value="en">English (US)</option>
                                    <option value="es">Español</option>
                                    <option value="hi">हिंदी (Hindi)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-850 dark:text-white mb-6">
                            {lang.security}
                        </h3>

                        {passwordStatus && (
                            <div className={`p-4 mb-6 rounded-xl text-sm font-semibold ${
                                passwordStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                                {passwordStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="flex flex-col gap-6 max-w-xl">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                                    {lang.currentPass}
                                </label>
                                <input 
                                    type="password" 
                                    required 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                                    {lang.newPass}
                                </label>
                                <input 
                                    type="password" 
                                    required 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl border-none cursor-pointer shadow-md flex items-center gap-2"
                                >
                                    <Shield size={16} />
                                    <span>{passwordSaving ? 'Updating...' : lang.updatePassBtn}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;