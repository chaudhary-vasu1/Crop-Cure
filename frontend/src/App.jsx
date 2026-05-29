import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- UNCOMMENTED THIS

// Temporary Dashboard Placeholder
const Dashboard = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-green-700">Farmer Dashboard</h1>
        <p>Welcome! Your auth setup is complete.</p>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> {/* <-- UNCOMMENTED THIS */}
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;