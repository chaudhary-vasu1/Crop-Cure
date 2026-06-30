import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* Navbar - Sticky Top */}
            <Navbar />
            
            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;