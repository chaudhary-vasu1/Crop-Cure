import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    Search, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, 
    Eye, Gauge, Sparkles, CloudRain, Navigation, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeatherCenter = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('Meerut');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchCity, setSearchCity] = useState('');

    // Fetch full weather details (current + forecast + AI advisory)
    const fetchWeatherDetails = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            let queryString = '';
            if (params.lat && params.lng) {
                queryString = `?lat=${params.lat}&lng=${params.lng}`;
            } else {
                const targetCity = params.city || city;
                queryString = `?city=${encodeURIComponent(targetCity)}`;
            }

            const response = await api.get(`/weather/details${queryString}`);
            setWeatherData(response.data);
            setCity(response.data.current.city);
        } catch (err) {
            console.error("Error loading weather details:", err);
            setError("Could not retrieve forecast details. Please check your network or try another city.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-load weather on mount
    useEffect(() => {
        fetchWeatherDetails();
    }, []);

    // Manual search query
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCity.trim()) {
            fetchWeatherDetails({ city: searchCity.trim() });
            setSearchCity('');
        }
    };

    // GPS Auto-detect location
    const handleGpsWeather = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await fetchWeatherDetails({ lat: latitude, lng: longitude });
                setGpsLoading(false);
            },
            (err) => {
                console.error("GPS access error:", err);
                alert("Geolocation access denied. Please type your location manually.");
                setGpsLoading(false);
            }
        );
    };

    // Helper to format date string to weekday
    const formatDay = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Helper to convert timestamp to local time string
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header / Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition border-none cursor-pointer bg-transparent"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                            🌤️ Weather Center
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Real-time farm weather metrics & agricultural advisory
                        </p>
                    </div>
                </div>

                {/* Manual Search & GPS Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="flex items-center gap-1.5 flex-1 sm:flex-none">
                        <div className="relative flex-1 sm:flex-none">
                            <input 
                                type="text"
                                placeholder="Search city or village..."
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                className="w-full sm:w-56 pl-9 pr-4 py-2 border border-gray-250 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition shadow-sm"
                        >
                            Search
                        </button>
                    </form>
                    <button 
                        disabled={gpsLoading}
                        onClick={handleGpsWeather}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-450 text-white font-bold rounded-xl text-sm border-none cursor-pointer transition flex items-center gap-1.5 shadow-sm"
                        title="Auto-detect location using GPS"
                    >
                        <MapPin size={16} className={gpsLoading ? "animate-pulse" : ""} />
                        <span>{gpsLoading ? "Detecting..." : "GPS"}</span>
                    </button>
                </div>
            </div>

            {/* Error handling state */}
            {error && (
                <div className="p-5 mb-8 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-2xl text-left font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Loader animation */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-green-200 rounded-full border-t-green-600 animate-spin mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-bold animate-pulse text-sm">
                        Retrieving forecast and AI agricultural guidance...
                    </p>
                </div>
            ) : weatherData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: General Weather Card & AI Advisory */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Weather Summary Card */}
                        <div className="p-8 text-white rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 shadow-lg relative overflow-hidden group">
                            <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-500"></div>
                            
                            <div className="flex justify-between items-start z-10 relative text-left">
                                <div>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                                        Live Forecast
                                    </span>
                                    <h2 className="text-4xl font-black mt-3 tracking-tight">
                                        {weatherData.current.city}
                                    </h2>
                                    <p className="text-sm font-semibold capitalize opacity-90 mt-1">
                                        {weatherData.current.description}
                                    </p>
                                </div>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@4x.png`} 
                                    alt={weatherData.current.description} 
                                    className="w-28 h-28 select-none pointer-events-none drop-shadow-lg"
                                />
                            </div>

                            <div className="mt-8 flex items-baseline gap-2 z-10 relative text-left">
                                <span className="text-7xl font-black tracking-tighter">
                                    {weatherData.current.temp}°C
                                </span>
                                <span className="text-lg opacity-85 font-medium">
                                    / Feels like {weatherData.current.feelsLike}°C
                                </span>
                            </div>
                        </div>

                        {/* AI Advisory Panel */}
                        <div className="p-6 border border-green-100 dark:border-green-950/45 bg-green-50/50 dark:bg-green-950/10 rounded-3xl text-left">
                            <div className="flex items-center gap-2 mb-4 text-green-700 dark:text-green-400">
                                <Sparkles size={20} className="animate-bounce" />
                                <h3 className="text-lg font-bold tracking-tight">AI Agricultural Advisory</h3>
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 whitespace-pre-line font-medium pl-1">
                                {weatherData.advisory}
                            </div>
                        </div>

                        {/* Detailed Metrics Section */}
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                                Today's Weather Metrics
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Humidity</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{weatherData.current.humidity}%</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-xl">
                                        <Wind size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Wind Speed</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{weatherData.current.windSpeed} m/s</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl">
                                        <Gauge size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Pressure</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{weatherData.current.pressure} hPa</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Visibility</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{weatherData.current.visibility} km</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
                                        <Sunrise size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Sunrise</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{formatTime(weatherData.current.sunrise)}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl">
                                        <Sunset size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Sunset</p>
                                        <p className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">{formatTime(weatherData.current.sunset)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: 5-Day Forecast Grid */}
                    <div className="text-left">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 tracking-tight flex items-center gap-1.5">
                            📅 5-Day Outlook
                        </h3>
                        <div className="flex flex-col gap-3">
                            {weatherData.forecast.map((dayForecast, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl flex items-center justify-between hover:shadow-sm transition"
                                >
                                    <div className="flex items-center gap-3 min-w-[120px]">
                                        <img 
                                            src={`https://openweathermap.org/img/wn/${dayForecast.icon}.png`} 
                                            alt={dayForecast.condition} 
                                            className="w-10 h-10 shrink-0 bg-blue-50 dark:bg-gray-700 rounded-xl"
                                        />
                                        <div>
                                            <p className="text-sm font-extrabold text-gray-800 dark:text-white">
                                                {formatDay(dayForecast.date)}
                                            </p>
                                            <p className="text-xs font-semibold text-gray-400 mt-0.5 capitalize">
                                                {dayForecast.condition}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rainfall Chance */}
                                    <div className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-lg">
                                        <CloudRain size={12} />
                                        <span>{dayForecast.rainChance}%</span>
                                    </div>

                                    {/* Daily High / Low Temperatures */}
                                    <div className="text-right">
                                        <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                                            {dayForecast.maxTemp}°
                                        </span>
                                        <span className="text-xs font-semibold text-gray-400 ml-1.5">
                                            {dayForecast.minTemp}°
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : null}
        </div>
    );
};

export default WeatherCenter;
