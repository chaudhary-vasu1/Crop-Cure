import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext'; // ✅ IMPORTED NEW CONTEXT
import ProtectedRoute from './components/ProtectedRoute';

// Pages & Components
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard'; 
import Crops from './pages/Crops';
import Settings from './pages/Settings'; 

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
                            <Route path="crops" element={<Crops />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </Router>
            </AppProvider>
        </AuthProvider>
    );
}

export default App;