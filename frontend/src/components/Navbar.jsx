import { Link, useLocation } from 'react-router-dom';
import { Home, Sprout, Settings, LogOut, Moon, Sun, User, Layers } from 'lucide-react';
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
            profile: 'Profile'
        },
        es: {
            dashboard: 'Panel',
            farms: 'Mis Parcelas',
            crops: 'Mis Cultivos',
            weather: 'Clima',
            settings: 'Ajustes',
            logout: 'Cerrar Sesión',
            profile: 'Perfil'
        },
        hi: {
            dashboard: 'डैशबोर्ड',
            farms: 'मेरे खेत',
            crops: 'मेरी फसलें',
            weather: 'मौसम केंद्र',
            settings: 'सेटिंग्स',
            logout: 'लॉगआउट',
            profile: 'प्रोफाइल'
        }
    };
    const lang = t[language] || t.en;

    const navItems = [
        { name: lang.dashboard, path: '/', icon: Home },
        { name: lang.farms, path: '/farms', icon: Layers },
        { name: lang.crops, path: '/crops', icon: Sprout },
        { name: lang.weather, path: '/weather', icon: Sun },
        { name: lang.settings, path: '/settings', icon: Settings },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition border-none bg-transparent">
                    <span className="text-2xl select-none">🌾</span>
                    <span className="text-xl font-extrabold tracking-wider text-green-700 dark:text-green-500">
                        CropCure
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border-none ${
                                    isActive
                                    ? 'bg-green-50 text-green-700 shadow-sm dark:bg-green-950/45 dark:text-green-400'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/60 dark:hover:text-gray-200'
                                }`}
                            >
                                <Icon size={16} />
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
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 border-none cursor-pointer transition"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* User Profile display - Clickable Link to Settings */}
                    <Link 
                        to="/profile" 
                        className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-all border-none cursor-pointer text-current no-underline"
                    >
                        <User size={16} className="text-gray-400 dark:text-gray-500" />
                        <div className="text-left leading-none">
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{lang.profile}</span>
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{user?.username || 'Farmer'}</p>
                        </div>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                    >
                        <LogOut size={16} />
                        <span>{lang.logout}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
