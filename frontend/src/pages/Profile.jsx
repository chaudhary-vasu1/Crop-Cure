import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import { Shield, Save, LogOut } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { language } = useContext(AppContext);
    const { user, logout, updateUser } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('profile'); // profile, security

    // Profile form state
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Security state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(null);
    const [passwordSaving, setPasswordSaving] = useState(false);

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

    const t = {
        en: {
            editProfile: "Edit Profile Info",
            fullName: "Full Name / Username",
            contactInfo: "Contact Info (Read Only)",
            saveBtn: "Save Profile",
            security: "Security & Password",
            currentPass: "Current Password",
            newPass: "New Password",
            updatePassBtn: "Update Password",
            logoutBtn: "Logout"
        },
        es: {
            editProfile: "Editar Perfil",
            fullName: "Nombre Completo / Usuario",
            contactInfo: "Información de Contacto (Solo Lectura)",
            saveBtn: "Guardar Perfil",
            security: "Seguridad y Contraseña",
            currentPass: "Contraseña Actual",
            newPass: "Nueva Contraseña",
            updatePassBtn: "Actualizar Contraseña",
            logoutBtn: "Cerrar Sesión"
        },
        hi: {
            editProfile: "प्रोफ़ाइल संपादित करें",
            fullName: "पूरा नाम / उपयोगकर्ता नाम",
            contactInfo: "संपर्क जानकारी (केवल पढ़ने के लिए)",
            saveBtn: "प्रोफ़ाइल सहेजें",
            security: "सुरक्षा और पासवर्ड",
            currentPass: "वर्तमान पासवर्ड",
            newPass: "नया पासवर्ड",
            updatePassBtn: "पासवर्ड अपडेट करें",
            logoutBtn: "लॉगआउट"
        }
    };
    const lang = t[language] || t.en;

    return (
        <div className="max-w-4xl mx-auto mt-6 text-left animate-slide-up">
            {/* Header Profile Banner */}
            <div className="relative p-8 mb-8 text-white rounded-3xl shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/60 flex items-center justify-center text-3xl font-extrabold select-none shadow-md">
                        {userInitial}
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-black mb-1 tracking-tight text-white">
                            {user?.username || 'Farmer'}
                        </h2>
                        <p className="text-xs font-bold text-emerald-100/90 uppercase tracking-widest">
                            {userContact}
                        </p>
                    </div>
                </div>
                <div className="z-10 shrink-0">
                    <button 
                        onClick={logout}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl shadow-md border-none cursor-pointer flex items-center gap-2 transition active:scale-95 text-xs"
                    >
                        <LogOut size={14} />
                        <span>{lang.logoutBtn}</span>
                    </button>
                </div>
                <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-gray-800 mb-6 font-semibold overflow-x-auto text-xs">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-5 border-b-2 transition-all cursor-pointer bg-transparent border-none font-bold whitespace-nowrap ${
                        activeTab === 'profile' 
                            ? 'border-b-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    Profile Settings
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-3 px-5 border-b-2 transition-all cursor-pointer bg-transparent border-none font-bold whitespace-nowrap ${
                        activeTab === 'security' 
                            ? 'border-b-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    Security & Password
                </button>
            </div>

            {/* Form Panels */}
            <div className="p-6 sm:p-8 bg-white border border-slate-200/50 dark:border-gray-800/50 rounded-3xl shadow-sm dark:bg-gray-900 transition duration-300">
                {activeTab === 'profile' && (
                    <div className="animate-fade-in">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">
                            {lang.editProfile}
                        </h3>

                        {saveStatus && (
                            <div className={`p-4 mb-6 rounded-xl text-xs font-semibold ${
                                saveStatus.type === 'success' 
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/20' 
                                    : 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20'
                            }`}>
                                {saveStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 max-w-xl">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                                    {lang.fullName}
                                </label>
                                <input 
                                    type="text" 
                                    required 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                                    {lang.contactInfo}
                                </label>
                                <input 
                                    type="text" 
                                    disabled 
                                    value={userContact}
                                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-gray-950/50 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-gray-805 outline-none cursor-not-allowed select-none text-sm font-medium rounded-xl"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 transition rounded-xl border-none cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 text-xs"
                                >
                                    <Save size={14} />
                                    <span>{saving ? 'Saving...' : lang.saveBtn}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-fade-in">
                        <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-6">
                            {lang.security}
                        </h3>

                        {passwordStatus && (
                            <div className={`p-4 mb-6 rounded-xl text-xs font-semibold ${
                                passwordStatus.type === 'success' 
                                    ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/20' 
                                    : 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400 border border-red-200/20'
                            }`}>
                                {passwordStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="flex flex-col gap-5 max-w-xl">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                                    {lang.currentPass}
                                </label>
                                <input 
                                    type="password" 
                                    required 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">
                                    {lang.newPass}
                                </label>
                                <input 
                                    type="password" 
                                    required 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800 dark:text-white transition"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="px-5 py-2.5 font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 transition rounded-xl border-none cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 text-xs"
                                >
                                    <Shield size={14} />
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

export default Profile;
