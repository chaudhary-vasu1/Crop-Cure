import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* Sidebar - Fixed width */}
            <div className="w-64 shrink-0">
                <Sidebar />
            </div>
            
            {/* Main Content - Flex-grow to fill remaining space */}
            <main className="flex-grow overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;