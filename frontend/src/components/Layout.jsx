import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
            {/* Geometric background mesh */}
            <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none z-0"></div>

            {/* Navbar - Sticky Top */}
            <Navbar />
            
            {/* Main Content Area */}
            <main className="flex-grow z-10 relative animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;