import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

// ✅ 1. This must be AppContext
export const AppContext = createContext();

// ✅ 2. This must be AppProvider
export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [farms, setFarms] = useState([]);
    const [selectedFarm, setSelectedFarm] = useState(localStorage.getItem('selectedFarmId') || 'all');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const refreshFarms = async () => {
        if (!localStorage.getItem('token')) {
            setFarms([]);
            setSelectedFarm('all');
            localStorage.setItem('selectedFarmId', 'all');
            return;
        }
        try {
            const response = await api.get('/farms');
            setFarms(response.data);
            const stored = localStorage.getItem('selectedFarmId') || 'all';
            if (stored !== 'all' && !response.data.some(f => f._id === stored)) {
                setSelectedFarm('all');
                localStorage.setItem('selectedFarmId', 'all');
            } else {
                setSelectedFarm(stored);
            }
        } catch (error) {
            console.error("Failed to load farms in AppContext:", error);
        }
    };

    const changeSelectedFarm = (farmId) => {
        setSelectedFarm(farmId);
        localStorage.setItem('selectedFarmId', farmId);
    };

    // Auto-fetch farms when token is available on mount or auth status changes
    useEffect(() => {
        refreshFarms();
    }, [language]); // refreshes when lang switches or trigger called manually

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));

    const addToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(item => item.product._id === product._id);
            let updated;
            if (exists) {
                updated = prev.map(item => 
                    item.product._id === product._id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updated = [...prev, { product, quantity: 1 }];
            }
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const updated = prev.filter(item => item.product._id !== productId);
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        // ✅ 3. This must match the AppContext created at the top
        <AppContext.Provider value={{ 
            theme, setTheme, toggleTheme, 
            language, setLanguage, 
            farms, setFarms, 
            selectedFarm, changeSelectedFarm, 
            refreshFarms,
            cart, addToCart, removeFromCart, clearCart
        }}>
            {children}
        </AppContext.Provider>
    );
};