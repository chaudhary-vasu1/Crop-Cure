import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext'; // ✅ IMPORTED NEW CONTEXT
import ProtectedRoute from './components/ProtectedRoute';

// Pages & Components
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard'; 
import Farms from './pages/Farms'; 
import Crops from './pages/Crops';
import Settings from './pages/Settings'; 
import Profile from './pages/Profile'; 
import WeatherCenter from './pages/WeatherCenter';
import HealthTrackingDashboard from './pages/HealthTrackingDashboard';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import SupplierDetail from './pages/SupplierDetail';
import CommunityForum from './pages/CommunityForum';
import PostDetail from './pages/PostDetail';
import KnowledgeBase from './pages/KnowledgeBase';
import PricingPage from './pages/PricingPage';
import UsagePage from './pages/UsagePage';

function App() {
    return (
        <AuthProvider>
            {/* ✅ WRAPPED THE APP IN THE NEW CONTEXT */}
            <AppProvider> 
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} /> 
                        
                        {/* Protected Routes */}
                        <Route 
                            path="/" 
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            } 
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="farms" element={<Farms />} />
                            <Route path="crops" element={<Crops />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="weather" element={<WeatherCenter />} />
                            <Route path="health-tracking" element={<HealthTrackingDashboard />} />
                            <Route path="marketplace" element={<Marketplace />} />
                            <Route path="marketplace/cart" element={<Cart />} />
                            <Route path="marketplace/orders" element={<OrderHistory />} />
                            <Route path="marketplace/supplier/:supplierId" element={<SupplierDetail />} />
                            <Route path="forum" element={<CommunityForum />} />
                            <Route path="forum/post/:postId" element={<PostDetail />} />
                            <Route path="knowledge-base" element={<KnowledgeBase />} />
                            <Route path="pricing" element={<PricingPage />} />
                            <Route path="usage" element={<UsagePage />} />
                        </Route>
                    </Routes>
                </Router>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;
