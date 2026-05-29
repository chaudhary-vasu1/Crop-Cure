import { Link, useLocation } from 'react-router-dom';
import { Home, Sprout, Settings, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    // The navigation menu items
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'My Crops', path: '/crops', icon: Sprout },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col w-64 min-h-screen text-white bg-green-800 shadow-xl">
            {/* Logo Area */}
            <div className="flex items-center justify-center h-20 border-b border-green-700">
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
                                ? 'bg-green-600 text-white font-semibold shadow-md' 
                                : 'text-green-100 hover:bg-green-700'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button at the bottom */}
            <div className="p-4 border-t border-green-700">
                <button 
                    onClick={logout}
                    className="flex items-center w-full gap-3 px-4 py-3 text-red-200 transition-colors rounded-lg hover:bg-red-500 hover:text-white"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;