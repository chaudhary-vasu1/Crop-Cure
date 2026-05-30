import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
            {/* Sidebar */}
            <div className="flex-shrink-0 w-64 hidden md:block border-r border-gray-200">
                <Sidebar />
            </div>
            
            {/* Main Content Area - Forced to stretch */}
            <main className="flex-1 w-full overflow-x-hidden">
                <div className="p-8 w-full">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default Layout;