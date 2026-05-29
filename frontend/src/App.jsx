import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages & Components
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard'; 

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
                        
                        {/* We will add more pages here in the next phase! */}
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;