import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Sidebar = () => {
    const { language } = useContext(AppContext);

    // This object maps the language code to the actual words
    const t = {
        en: { dashboard: "Dashboard", settings: "Settings", logout: "Logout" },
        hi: { dashboard: "डैशबोर्ड", settings: "सेटिंग्स", logout: "लॉग आउट" }
    };

    const strings = t[language];

    return (
        <div style={{ backgroundColor: '#065f46', color: 'white', height: '100vh', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>CropCure</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="/">{strings.dashboard}</a>
                <a href="/settings">{strings.settings}</a>
                <button>{strings.logout}</button>
            </nav>
        </div>
    );
};

export default Sidebar;