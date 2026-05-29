import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        // 👇 ADDED dark:bg-gray-900 for dark mode 👇
        <div className="flex min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
            
            {/* 👇 REMOVED 'hidden' and ADDED 'w-64' so it stays visible 👇 */}
            <div className="fixed z-10 w-64 h-full">
                <Sidebar />
            </div>
            
            {/* The dynamic page content on the right */}
            <div className="flex-1 overflow-y-auto md:ml-64">
                <div className="p-8">
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default Layout;