import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Edit2, Check } from 'lucide-react';

const WeatherWidget = ({ defaultCity }) => {
    const [city, setCity] = useState('Meerut');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchCity, setSearchCity] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);

    const handleGpsWeather = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await api.get(`/weather/reverse-geocode?lat=${latitude}&lng=${longitude}`);
                    const resolvedName = response.data.location;
                    await fetchWeather(resolvedName);
                    setIsEditing(false);
                } catch (err) {
                    console.error("GPS weather error:", err);
                    alert("Failed to auto-detect location weather. Please search manually.");
                } finally {
                    setGpsLoading(false);
                }
            },
            (err) => {
                console.error("GPS access error:", err);
                alert("Geolocation access denied. Please search your location manually.");
                setGpsLoading(false);
            }
        );
    };

    const fetchWeather = async (targetCity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/weather?city=${encodeURIComponent(targetCity)}`);
            setWeather(response.data);
            setCity(response.data.city);
        } catch (err) {
            console.error("Error fetching weather:", err);
            setError(`Could not load weather for "${targetCity}".`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (defaultCity) {
            fetchWeather(defaultCity);
        } else {
            fetchWeather(city);
        }
    }, [defaultCity]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchCity.trim()) {
            fetchWeather(searchCity.trim());
            setIsEditing(false);
            setSearchCity('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm h-28 animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 mb-6 border border-red-200 dark:border-red-900/50 shadow-sm bg-red-50 dark:bg-red-950/20 rounded-2xl text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="font-semibold text-red-600 dark:text-red-400">{error}</p>
                <div className="flex gap-2 items-center w-full sm:w-auto">
                    {isEditing ? (
                        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center w-full flex-wrap sm:flex-nowrap">
                            <input 
                                type="text" 
                                placeholder="Enter city..." 
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                className="px-3 py-1 border rounded-lg focus:ring-1 focus:ring-red-500 text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                autoFocus
                            />
                            <button type="submit" className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg border-none cursor-pointer font-bold text-xs">
                                Go
                            </button>
                            <button 
                                type="button"
                                disabled={gpsLoading}
                                onClick={handleGpsWeather}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg border-none cursor-pointer font-bold text-xs flex items-center gap-1 transition"
                            >
                                📍 {gpsLoading ? "..." : "GPS"}
                            </button>
                        </form>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs border-none cursor-pointer"
                            >
                                Try Another City
                            </button>
                            <button 
                                type="button"
                                disabled={gpsLoading}
                                onClick={handleGpsWeather}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl text-xs border-none cursor-pointer flex items-center gap-1 transition"
                            >
                                📍 {gpsLoading ? "Detecting..." : "Detect GPS"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 mb-6 text-white rounded-2xl shadow-md bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden group">
            <div className="z-10 text-left">
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center flex-wrap sm:flex-nowrap animate-fade-in">
                            <input 
                                type="text" 
                                placeholder="Change city..." 
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 focus:bg-white text-white focus:text-gray-900 placeholder-white/70 border border-white/30 rounded-xl text-sm focus:outline-none transition duration-200"
                                autoFocus
                            />
                            <button type="submit" className="p-2 bg-white/25 hover:bg-white/40 text-white rounded-xl border-none cursor-pointer flex items-center justify-center">
                                <Check size={14} />
                            </button>
                            <button 
                                type="button"
                                disabled={gpsLoading}
                                onClick={handleGpsWeather}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl border-none cursor-pointer text-xs flex items-center gap-1 transition"
                                title="Use current GPS location"
                            >
                                📍 {gpsLoading ? "..." : "GPS"}
                            </button>
                        </form>
                    ) : (
                        <>
                            <h3 className="text-2xl font-black">{weather.city} Forecast</h3>
                            <button 
                                id="change-city-btn"
                                onClick={() => setIsEditing(true)} 
                                className="p-1 bg-white/10 hover:bg-white/25 text-white rounded-lg border-none cursor-pointer transition flex items-center justify-center"
                                title="Change city"
                            >
                                <Edit2 size={12} />
                            </button>
                        </>
                    )}
                </div>
                <p className="capitalize opacity-90 mt-1 font-medium text-sm sm:text-base">{weather.description}</p>
            </div>
            <div className="flex items-center gap-4 z-10 mt-4 sm:mt-0">
                <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                    alt={weather.description} 
                    className="w-16 h-16 drop-shadow-md select-none pointer-events-none"
                />
                <span className="text-4xl sm:text-5xl font-black tracking-tighter">{weather.temp}°C</span>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        </div>
    );
};

export default WeatherWidget;