import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Moon, Sun, Globe } from 'lucide-react';

const Settings = () => {
    // Pull our global state from the context we just created!
    const { theme, toggleTheme, language, setLanguage } = useContext(AppContext);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="mb-8 text-3xl font-bold text-gray-800 dark:text-white">
                Platform Settings
            </h1>
            
            <div className="p-8 space-y-8 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                
                {/* 🌙 Theme Section */}
                <div>
                    <div className="flex items-center gap-2 pb-2 mb-4 border-b dark:border-gray-700">
                        <Moon className="text-gray-500 dark:text-gray-400" size={20}/>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Appearance</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl dark:bg-gray-700/50">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme across the entire application.</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className={`flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors rounded-lg ${
                                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'
                            }`}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            {theme === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
                        </button>
                    </div>
                </div>

                {/* 🌍 Language Section */}
                <div>
                    <div className="flex items-center gap-2 pb-2 mb-4 border-b dark:border-gray-700">
                        <Globe className="text-gray-500 dark:text-gray-400" size={20}/>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Language Preferences</h3>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl dark:bg-gray-700/50">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">Display Language</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language for the interface.</p>
                        </div>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg outline-none cursor-pointer hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;