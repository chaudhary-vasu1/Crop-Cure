import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Settings = () => {
    const { language, setLanguage } = useContext(AppContext);

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Settings</h1>
            <label style={{ marginRight: '1rem' }}>Select Language:</label>
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '0.25rem' }}
            >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
            </select>
        </div>
    );
};

export default Settings;