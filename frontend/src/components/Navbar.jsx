import { Link, useLocation } from 'react-router-dom';
import { 
    Home, Sprout, Settings, LogOut, Moon, Sun, Layers, 
    Activity, ShoppingBag, MessageSquare, Award, BookOpen, 
    BarChart3, ChevronDown, Menu, X 
} from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme, language } = useContext(AppContext);

    // Dropdown open states for desktop hover/clicks
    const [activeDropdown, setActiveDropdown] = useState(null); // 'farming', 'services', 'account' or null
    
    // Mobile slide-up menu sheet toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close drawers when route transitions
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    const t = {
        en: {
            dashboard: 'Dashboard',
            farms: 'My Farms',
            crops: 'My Crops',
            weather: 'Weather Center',
            settings: 'Account Settings',
            logout: 'Logout',
            profile: 'Profile',
            health: 'Crop Health Logs',
            marketplace: 'Marketplace Store',
            forum: 'Community Forum',
            pricing: 'Upgrade Plan',
            kb: 'Knowledge Base',
            usage: 'Usage Stats',
            menuFarming: 'My Farm',
            menuServices: 'Services',
            menuAccount: 'Account',
            more: 'More Menu'
        },
        es: {
            dashboard: 'Inicio',
            farms: 'Mis Parcelas',
            crops: 'Mis Cultivos',
            weather: 'Centro Clima',
            settings: 'Ajustes de Cuenta',
            logout: 'Cerrar Sesión',
            profile: 'Perfil',
            health: 'Salud del Cultivo',
            marketplace: 'Tienda Agrícola',
            forum: 'Foro Comunitario',
            pricing: 'Actualizar Plan',
            kb: 'Manuales y Guías',
            usage: 'Uso de Plan',
            menuFarming: 'Mi Campo',
            menuServices: 'Servicios',
            menuAccount: 'Cuenta',
            more: 'Más'
        },
        hi: {
            dashboard: 'होम',
            farms: 'मेरे खेत',
            crops: 'मेरी फसलें',
            weather: 'मौसम केंद्र',
            settings: 'खाता सेटिंग्स',
            logout: 'लॉगआउट',
            profile: 'प्रोफाइल',
            health: 'फसल स्वास्थ्य लॉग',
            marketplace: 'कृषि बाजार',
            forum: 'सामुदायिक मंच',
            pricing: 'योजनाएं अपग्रेड',
            kb: 'कृषि ज्ञानकोष',
            usage: 'उपयोग विवरण',
            menuFarming: 'मेरा खेत',
            menuServices: 'सेवाएं',
            menuAccount: 'खाता',
            more: 'अधिक'
        }
    };
    const lang = t[language] || t.en;

    const dropdownItems = {
        farming: [
            { name: lang.farms, path: '/farms', desc: "Manage your fields & acreage", icon: Layers, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
            { name: lang.crops, path: '/crops', desc: "Track active crops & statistics", icon: Sprout, color: "text-green-500 bg-green-50 dark:bg-green-950/20" },
            { name: lang.health, path: '/health-tracking', desc: "View health trends & PDF exports", icon: Activity, color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
            { name: lang.weather, path: '/weather', desc: "Get agricultural weather reports", icon: Sun, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" }
        ],
        services: [
            { name: lang.marketplace, path: '/marketplace', desc: "Shop seeds & organic sprays", icon: ShoppingBag, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
            { name: lang.forum, path: '/forum', desc: "Discuss symptoms with farmers", icon: MessageSquare, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
            { name: lang.kb, path: '/knowledge-base', desc: "Read remedies guides by extension", icon: BookOpen, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" }
        ],
        account: [
            { name: lang.pricing, path: '/pricing', desc: "Upgrade tiers limits & pricing", icon: Award, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
            { name: lang.usage, path: '/usage', desc: "Monitor scanned limits usage", icon: BarChart3, color: "text-slate-500 bg-slate-50 dark:bg-slate-950/20" },
            { name: lang.settings, path: '/settings', desc: "Adjust system profile options", icon: Settings, color: "text-slate-500 bg-slate-50 dark:bg-slate-950/20" }
        ]
    };

    const getUserInitial = () => {
        if (user && user.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'F';
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200/40 dark:border-gray-800/40 shadow-sm transition-all duration-300">
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

                {/* Desktop Dropdown Mega-Menu Navigation */}
                <nav className="hidden md:flex items-center gap-2 bg-slate-100/60 dark:bg-gray-950/40 p-1.5 rounded-2xl border border-slate-200/40 dark:border-gray-850/40 relative">
                    
                    {/* Home Link */}
                    <Link
                        to="/"
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
                            location.pathname === '/'
                                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-450 shadow-sm'
                                : 'text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-105'
                        }`}
                    >
                        <Home size={14} />
                        <span>{lang.dashboard}</span>
                    </Link>

                    {/* Dropdown: My Farm */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setActiveDropdown('farming')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black bg-transparent border-none cursor-pointer transition ${
                            activeDropdown === 'farming' || ['/farms', '/crops', '/health-tracking', '/weather'].includes(location.pathname)
                                ? 'text-emerald-600 dark:text-emerald-450'
                                : 'text-slate-655 dark:text-slate-400'
                        }`}>
                            <span>{lang.menuFarming}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'farming' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'farming' && (
                            <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/80 rounded-3xl shadow-xl z-50 p-2.5 animate-scale-in grid grid-cols-1 gap-1">
                                {dropdownItems.farming.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-850 transition duration-200 text-left cursor-pointer border-none no-underline text-current group"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                            <item.icon size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-105 group-hover:text-emerald-500 transition-colors">{item.name}</p>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-snug">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dropdown: Services */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setActiveDropdown('services')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black bg-transparent border-none cursor-pointer transition ${
                            activeDropdown === 'services' || ['/marketplace', '/forum', '/knowledge-base'].includes(location.pathname)
                                ? 'text-emerald-600 dark:text-emerald-450'
                                : 'text-slate-655 dark:text-slate-400'
                        }`}>
                            <span>{lang.menuServices}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'services' && (
                            <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/80 rounded-3xl shadow-xl z-50 p-2.5 animate-scale-in grid grid-cols-1 gap-1">
                                {dropdownItems.services.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-850 transition duration-200 text-left cursor-pointer border-none no-underline text-current group"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                            <item.icon size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-105 group-hover:text-emerald-500 transition-colors">{item.name}</p>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-snug">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dropdown: Account */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setActiveDropdown('account')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-black bg-transparent border-none cursor-pointer transition ${
                            activeDropdown === 'account' || ['/settings', '/pricing', '/usage'].includes(location.pathname)
                                ? 'text-emerald-600 dark:text-emerald-450'
                                : 'text-slate-655 dark:text-slate-400'
                        }`}>
                            <span>{lang.menuAccount}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'account' && (
                            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/80 rounded-3xl shadow-xl z-50 p-2.5 animate-scale-in grid grid-cols-1 gap-1">
                                {dropdownItems.account.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-850 transition duration-200 text-left cursor-pointer border-none no-underline text-current group"
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                            <item.icon size={15} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-105 group-hover:text-emerald-500 transition-colors">{item.name}</p>
                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-snug">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {/* Right controls panel */}
                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-150/20 dark:hover:bg-gray-800/40 border-none cursor-pointer transition active:scale-95 duration-200"
                    >
                        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                    </button>

                    {/* User profile settings link */}
                    <Link 
                        to="/profile" 
                        className="flex items-center gap-2 p-1 pr-3 bg-slate-100/70 hover:bg-slate-200/50 dark:bg-gray-900 dark:hover:bg-gray-800 border border-slate-200/40 dark:border-gray-800/40 rounded-full transition border-none text-current no-underline group shadow-sm"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white font-extrabold flex items-center justify-center text-xs shadow-inner group-hover:scale-105 transition duration-200">
                            {getUserInitial()}
                        </div>
                        <div className="hidden sm:block text-left leading-none">
                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider">{lang.profile}</span>
                            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-350 mt-0.5">{user?.username || 'Farmer'}</p>
                        </div>
                    </Link>

                    {/* Log out */}
                    <button
                        onClick={logout}
                        className="hidden sm:flex px-3 py-2 text-xs font-bold text-red-650 hover:text-white border border-red-200 hover:bg-red-500 dark:border-red-950/40 dark:hover:bg-red-650 rounded-xl transition shadow-sm border-none cursor-pointer items-center gap-1 bg-transparent"
                    >
                        <LogOut size={13} />
                        <span>{lang.logout}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-gray-850/60 py-2.5 px-4 flex items-center justify-around z-50 shadow-xl">
                <Link to="/" className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${location.pathname === '/' ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <Home size={16} />
                    <span className="text-[8px] font-black uppercase tracking-tight">Home</span>
                </Link>
                <Link to="/farms" className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${location.pathname === '/farms' ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <Layers size={16} />
                    <span className="text-[8px] font-black uppercase tracking-tight">{lang.farms}</span>
                </Link>
                <Link to="/marketplace" className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${location.pathname.startsWith('/marketplace') ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <ShoppingBag size={16} />
                    <span className="text-[8px] font-black uppercase tracking-tight">Shop</span>
                </Link>
                <Link to="/forum" className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${location.pathname.startsWith('/forum') ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <MessageSquare size={16} />
                    <span className="text-[8px] font-black uppercase tracking-tight">Forum</span>
                </Link>
                
                {/* Mobile 'More' Drawer Menu button */}
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`flex flex-col items-center gap-1 bg-transparent border-none text-center cursor-pointer transition ${isMobileMenuOpen ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
                >
                    {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                    <span className="text-[8px] font-black uppercase tracking-tight">{lang.more}</span>
                </button>
            </nav>

            {/* Mobile Slide-Up Bottom Sheet Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in flex items-end">
                    {/* Drawer Backdrop Close trigger */}
                    <div className="absolute inset-0 z-0" onClick={() => setIsMobileMenuOpen(false)}></div>
                    
                    {/* Drawer Content */}
                    <div className="w-full bg-white dark:bg-gray-905 border-t border-slate-200/50 dark:border-gray-800 rounded-t-3xl p-6 relative z-10 shadow-2xl max-h-[75vh] overflow-y-auto animate-slide-up text-left">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-gray-850">
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                📱 Quick Menu Options
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1.5 bg-transparent border-none cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl text-slate-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100 dark:border-gray-850">
                            {/* Farming Sub-list */}
                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">🌾 {lang.menuFarming}</p>
                                <Link to="/crops" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.crops}</Link>
                                <Link to="/health-tracking" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.health}</Link>
                                <Link to="/weather" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.weather}</Link>
                            </div>

                            {/* Extra Services Sub-list */}
                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-550 tracking-wider">⚙️ {lang.menuAccount}</p>
                                <Link to="/pricing" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.pricing}</Link>
                                <Link to="/usage" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.usage}</Link>
                                <Link to="/settings" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">{lang.settings}</Link>
                                <Link to="/knowledge-base" className="block text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 py-1">📖 {lang.kb}</Link>
                            </div>
                        </div>

                        {/* Mobile Logout Button */}
                        <div className="pt-5">
                            <button
                                onClick={logout}
                                className="w-full py-3 bg-red-50 text-red-650 hover:bg-red-500 hover:text-white dark:bg-red-950/20 dark:hover:bg-red-650 border border-red-200/20 dark:border-red-900/30 rounded-2xl text-xs font-black cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <LogOut size={14} />
                                {lang.logout}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
