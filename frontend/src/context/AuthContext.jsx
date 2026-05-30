import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // ✅ 1. Add a loading state that starts as TRUE
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        // ✅ 2. Safely check local storage when the app first loads
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from local storage");
        } finally {
            // ✅ 3. Tell the ProtectedRoute we are done checking!
            setLoading(false); 
        }
    }, []);

    const login = (userData) => {
        const userToken = userData.token; 
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken); 
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; 
    };

    return (
        // ✅ 4. Export the loading variable so ProtectedRoute can actually use it!
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};