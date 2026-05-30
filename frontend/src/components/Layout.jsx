import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar - Fixed width */}
            <div style={{ width: '256px', flexShrink: 0 }}>
                <Sidebar />
            </div>
            
            {/* Main Content - Flex-grow to fill remaining space */}
            <main style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;