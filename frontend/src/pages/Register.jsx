import { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState(''); // <-- Added username state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://crop-cure-backend-f2zf.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // <-- Now sending username along with email and password
                body: JSON.stringify({ username, email, password }) 
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Account created successfully! Welcome to Crop Cure.");
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
            <h2 className="text-2xl font-bold mb-4 text-green-700">Create an Account</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
                {/* <-- Added Username Input --> */}
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
                <button type="submit" className="p-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;