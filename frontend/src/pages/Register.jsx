import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate

const Register = () => {
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate(); // <-- 2. Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://crop-cure-backend-f2zf.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }) 
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Account created successfully! Redirecting to login...");
                navigate('/login'); // <-- 3. Redirect to login page instantly
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Failed to register:", error);
            alert("Network error. Check console.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="mb-4 text-2xl font-bold text-green-700">Create an Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs gap-4">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded"
                    minLength="6"
                    required
                />
                <button type="submit" className="p-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;