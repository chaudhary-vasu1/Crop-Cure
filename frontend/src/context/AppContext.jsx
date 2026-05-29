import { createContext, useState, useEffect } from 'react';

// ✅ 1. This must be AppContext
export const AppContext = createContext();

// ✅ 2. This must be AppProvider
export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

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

    return (
        // ✅ 3. This must match the AppContext created at the top
        <AppContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage }}>
            {children}
        </AppContext.Provider>
    );
};