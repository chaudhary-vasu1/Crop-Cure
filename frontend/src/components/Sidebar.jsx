import { Link, useLocation } from 'react-router-dom';
import { Home, Sprout, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext'; // ✅ Import our AppContext

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    
    // ✅ Pull the theme state and toggle function from our global context
    const { theme, toggleTheme } = useContext(AppContext); 

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'My Crops', path: '/crops', icon: Sprout },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col w-64 min-h-screen text-white transition-colors duration-200 bg-green-800 shadow-xl dark:bg-gray-950 dark:border-r dark:border-gray-800">
            
            {/* Logo Area */}
            <div className="flex items-center justify-center h-20 border-b border-green-700 dark:border-gray-800">
                <h1 className="text-2xl font-extrabold tracking-wider text-white">
                    🌾 CropCure
                </h1>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-green-600 text-white font-semibold shadow-md dark:bg-gray-800/80' 
                                : 'text-green-100 hover:bg-green-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions Area */}
            <div className="p-4 border-t border-green-700 dark:border-gray-800">
                
                {/* ✅ QUICK THEME TOGGLE BUTTON */}
                <button 
                    onClick={toggleTheme}
                    className="flex items-center w-full gap-3 px-4 py-3 mb-2 transition-colors rounded-lg text-green-50 hover:bg-green-700 dark:text-gray-300 dark:hover:bg-gray-900"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className="flex items-center w-full gap-3 px-4 py-3 text-red-200 transition-colors rounded-lg hover:bg-red-500 hover:text-white dark:text-red-400 dark:hover:bg-red-900/50"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;