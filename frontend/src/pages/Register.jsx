import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [identifier, setIdentifier] = useState(''); // Handles both Email or Phone
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Smart Formatting: Add +91 if they typed a 10-digit Indian phone number
        let finalIdentifier = identifier;
        if (!identifier.includes('@') && !identifier.startsWith('+') && identifier.length === 10) {
            finalIdentifier = `+91${identifier}`;
        }

        try {
            // We now send 'identifier' instead of 'email'
            const res = await api.post('/auth/register', { 
                username, 
                identifier: finalIdentifier, 
                password 
            });
            
            // Automatically log them in after successful registration
            login(res.data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white' }}>
                <form onSubmit={handleRegister}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Create an Account</h2>
                    
                    <input 
                        type="text" 
                        placeholder="Choose a Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                        required 
                    />
                    
                    <input 
                        type="text" 
                        placeholder="Email or Phone Number" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)} 
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Create a Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} 
                        required 
                    />
                    
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        Register
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#059669', textDecoration: 'none', fontWeight: 'bold' }}>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;