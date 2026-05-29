import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages & Components
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard'; 
import Crops from './pages/Crops';       // ✅ IMPORTED NEW PAGE
import Settings from './pages/Settings'; // ✅ IMPORTED NEW PAGE

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> 
                    
                    {/* Protected Routes wrapped in the Sidebar Layout */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        } 
                    >
                        {/* The 'index' route loads Dashboard automatically at '/' */}
                        <Route index element={<Dashboard />} />
                        
                        {/* ✅ CONNECTED THE NEW PAGES */}
                        <Route path="crops" element={<Crops />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;