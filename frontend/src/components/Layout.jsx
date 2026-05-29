import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* The persistent Sidebar on the left */}
            <div className="hidden md:block fixed h-full z-10">
                <Sidebar />
            </div>
            
            {/* The dynamic page content on the right */}
            {/* Adding margin-left (ml-64) so it doesn't hide behind the 64-width sidebar */}
            <div className="flex-1 overflow-y-auto md:ml-64">
                <div className="p-8">
                    {/* The <Outlet /> is where Dashboard, Crops, or Settings will appear */}
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default Layout;