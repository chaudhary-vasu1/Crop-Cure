import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        // 1. Full height container
        <div className="flex min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
            
            {/* 2. Sidebar takes fixed width, doesn't shrink or grow */}
            <div className="flex-shrink-0 w-64 hidden md:block">
                <Sidebar />
            </div>
            
            {/* 3. Main content takes all remaining space (flex-1) */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default Layout;