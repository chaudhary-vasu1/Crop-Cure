import { Link, useLocation } from 'react-router-dom';
import { Home, Sprout, Settings, LogOut, Moon, Sun, User, Layers, Activity, ShoppingBag, MessageSquare, Award } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme, language } = useContext(AppContext); 

    const t = {
        en: {
            dashboard: 'Dashboard',
            farms: 'My Farms',
            crops: 'My Crops',
            weather: 'Weather Center',
            settings: 'Settings',
            logout: 'Logout',
            profile: 'Profile',
            health: 'Crop Health',
            marketplace: 'Marketplace',
            forum: 'Forum',
            pricing: 'Pricing'
        },
        es: {
            dashboard: 'Panel',
            farms: 'Mis Parcelas',
            crops: 'Mis Cultivos',
            weather: 'Clima',
            settings: 'Ajustes',
            logout: 'Cerrar Sesión',
            profile: 'Perfil',
            health: 'Salud',
            marketplace: 'Mercado',
            forum: 'Foro',
            pricing: 'Planes'
        },
        hi: {
            dashboard: 'डैशबोर्ड',
            farms: 'मेरे खेत',
            crops: 'मेरी फसलें',
            weather: 'मौसम केंद्र',
            settings: 'सेटिंग्स',
            logout: 'लॉगआउट',
            profile: 'प्रोफाइल',
            health: 'फसल स्वास्थ्य',
            marketplace: 'कृषि बाजार',
            forum: 'सामुदायिक मंच',
            pricing: 'योजनाएं'
        }
    };
    const lang = t[language] || t.en;

    const navItems = [
        { name: lang.dashboard, path: '/', icon: Home },
        { name: lang.farms, path: '/farms', icon: Layers },
        { name: lang.crops, path: '/crops', icon: Sprout },
        { name: lang.weather, path: '/weather', icon: Sun },
        { name: lang.health, path: '/health-tracking', icon: Activity },
        { name: lang.marketplace, path: '/marketplace', icon: ShoppingBag },
        { name: lang.forum, path: '/forum', icon: MessageSquare },
        { name: lang.pricing, path: '/pricing', icon: Award },
    ];

    // Helper to get user initial
    const getUserInitial = () => {
        if (user && user.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'F';
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition border-none bg-transparent group">
                    <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                        <span className="text-xl select-none text-white font-bold">🌾</span>
                    </div>
                    <span className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">
                        Crop<span className="text-emerald-500">Cure</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-gray-900/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-gray-800/40">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border-none ${
                                    isActive
                                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white/45 dark:hover:bg-gray-800/45'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Area (Theme, User Profile, Logout) */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-900 border-none cursor-pointer transition-all active:scale-95 duration-200"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <Sun size={18} className="animate-spin-slow" />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>

                    {/* User Profile display - Clickable Link to Settings */}
                    <Link 
                        to="/profile" 
                        className="flex items-center gap-2.5 p-1 pr-3 bg-slate-100/70 hover:bg-slate-150/70 dark:bg-gray-900/75 dark:hover:bg-gray-800/80 border border-slate-200/40 dark:border-gray-800/40 rounded-full transition-all border-none cursor-pointer text-current no-underline group shadow-sm"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition-transform duration-200">
                            {getUserInitial()}
                        </div>
                        <div className="hidden sm:block text-left leading-none">
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider">{lang.profile}</span>
                            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">{user?.username || 'Farmer'}</p>
                        </div>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:text-white border border-red-200 hover:bg-red-500 dark:border-red-950/40 dark:hover:bg-red-650 rounded-xl transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5 active:scale-95 bg-transparent"
                    >
                        <LogOut size={13} />
                        <span className="hidden sm:inline">{lang.logout}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-gray-800/60 py-2.5 px-4 flex items-center justify-around z-50 shadow-xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${
                                isActive 
                                    ? 'text-emerald-500'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-650'
                            }`}
                        >
                            <Icon size={16} />
                            <span className="text-[8px] font-black tracking-tight uppercase truncate max-w-[50px]">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
};

export default Navbar;
