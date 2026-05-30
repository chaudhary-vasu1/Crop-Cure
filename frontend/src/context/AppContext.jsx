import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // 1. Initialize from localStorage to prevent reset on refresh
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    // 2. Persist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <AppContext.Provider value={{ language, setLanguage }}>
            {children}
        </AppContext.Provider>
    );
};