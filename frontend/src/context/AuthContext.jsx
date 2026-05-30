import { createContext, useState } from 'react';

// ✅ 1. This is AuthContext
export const AuthContext = createContext();

// ✅ 2. This is AuthProvider
export const AuthProvider = ({ children }) => {
    
    // 🔥 THE FIX: Check local storage synchronously before the very first render
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Login function
    const login = (userData) => {
        // Automatically extract the token from the backend response
        const userToken = userData.token; 
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken); // Safely store the real token
        setUser(userData);
    };

    // Logout function (This is what your Sidebar button uses!)
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; // Send them back to login page
    };

    return (
        // ✅ 3. This returns AuthContext.Provider
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};