import { useState, useEffect } from 'react';
import api from '../utils/api';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // This calls your secure backend route!
                const response = await api.get('/weather');
                setWeather(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError("Could not load weather data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm h-28 animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-4 mb-6 border border-red-200 shadow-sm bg-red-50 rounded-lg h-28">
                <p className="font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    if (!weather) return null;

    return (
        <div className="flex items-center justify-between p-6 mb-6 text-white rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-cyan-500">
            <div>
                <h3 className="text-xl font-bold">{weather.city} Forecast</h3>
                <p className="capitalize opacity-90">{weather.description}</p>
            </div>
            <div className="flex items-center gap-4">
                <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                    alt={weather.description} 
                    className="w-16 h-16 drop-shadow-md"
                />
                <span className="text-4xl font-extrabold">{weather.temp}°C</span>
            </div>
        </div>
    );
};

export default WeatherWidget;