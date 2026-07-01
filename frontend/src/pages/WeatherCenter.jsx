import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';
import { 
    Search, MapPin, Wind, Droplets, Sunrise, Sunset, 
    Eye, Gauge, Sparkles, CloudRain, ArrowLeft, Loader2 
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

    const { language } = useContext(AppContext);

    // Translations mapping
    const t = {
        en: {
            title: "Weather Center",
            subtitle: "Real-time farm weather metrics & agricultural advisory",
            searchPlaceholder: "Search city or village...",
            btnSearch: "Search",
            btnGps: "GPS",
            detecting: "Detecting...",
            liveForecast: "Live Forecast",
            feelsLike: "/ Feels like ",
            advisoryTitle: "AI Agricultural Advisory",
            metricsTitle: "Today's Weather Metrics",
            outlookTitle: "5-Day Outlook",
            loading: "Retrieving weather updates...",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            pressure: "Pressure",
            visibility: "Visibility",
            sunrise: "Sunrise",
            sunset: "Sunset",
            errorGeolocation: "Geolocation is not supported by your browser",
            errorGpsAccess: "Geolocation access denied. Please type your location manually."
        },
        es: {
            title: "Centro Meteorológico",
            subtitle: "Métricas del clima del campo en tiempo real y asesoría agrícola",
            searchPlaceholder: "Buscar ciudad o pueblo...",
            btnSearch: "Buscar",
            btnGps: "GPS",
            detecting: "Detectando...",
            liveForecast: "Pronóstico en Vivo",
            feelsLike: "/ Sensación térmica ",
            advisoryTitle: "Asesoría Agrícola por IA",
            metricsTitle: "Métricas del Clima de Hoy",
            outlookTitle: "Pronóstico de 5 Días",
            loading: "Obteniendo actualizaciones climáticas...",
            humidity: "Humedad",
            windSpeed: "Velocidad del Viento",
            pressure: "Presión",
            visibility: "Visibilidad",
            sunrise: "Amanecer",
            sunset: "Atardecer",
            errorGeolocation: "La geolocalización no es compatible con su navegador",
            errorGpsAccess: "Acceso a la geolocalización denegado. Escriba su ubicación manualmente."
        },
        hi: {
            title: "मौसम केंद्र",
            subtitle: "वास्तविक समय के कृषि मौसम मापदंड और कृषि सलाह",
            searchPlaceholder: "शहर या गाँव खोजें...",
            btnSearch: "खोजें",
            btnGps: "जीपीएस",
            detecting: "खोज रहा है...",
            liveForecast: "लाइव पूर्वानुमान",
            feelsLike: "/ महसूस होता है ",
            advisoryTitle: "एआई कृषि सलाह",
            metricsTitle: "आज का मौसम विवरण",
            outlookTitle: "5-दिवसीय दृष्टिकोण",
            loading: "मौसम अपडेट प्राप्त किए जा रहे हैं...",
            humidity: "आर्द्रता",
            windSpeed: "हवा की गति",
            pressure: "वायुमंडलीय दबाव",
            visibility: "दृश्यता (Visibility)",
            sunrise: "सूर्योदय",
            sunset: "सूर्यास्त",
            errorGeolocation: "जियोलोकेशन आपके ब्राउज़र द्वारा समर्थित नहीं है",
            errorGpsAccess: "जियोलोकेशन अनुमति अस्वीकार कर दी गई। कृपया स्थान टाइप करें।"
        }
    };
    const lang = t[language] || t.en;

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
            alert(lang.errorGeolocation);
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
                alert(lang.errorGpsAccess);
                setGpsLoading(false);
            }
        );
    };

    // Helper to format date string to weekday
    const formatDay = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString(
            language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US',
            { weekday: 'short', month: 'short', day: 'numeric' }
        );
    };

    // Helper to convert timestamp to local time string
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up text-left">
            {/* Header / Navigation Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-gray-900 rounded-xl transition border-none cursor-pointer bg-transparent active:scale-95 shrink-0"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                            🌤️ {lang.title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                            {lang.subtitle}
                        </p>
                    </div>
                </div>

                {/* Manual Search & GPS Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex items-center gap-1.5 flex-1 md:flex-none">
                        <div className="relative flex-1 md:flex-none">
                            <input 
                                type="text"
                                placeholder={lang.searchPlaceholder}
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                className="w-full md:w-56 pl-9 pr-4 py-2.5 border border-slate-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-905 text-slate-850 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
                        </div>
                        <button 
                            type="submit"
                            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs border-none cursor-pointer transition shadow-sm active:scale-95"
                        >
                            {lang.btnSearch}
                        </button>
                    </form>
                    <button 
                        disabled={gpsLoading}
                        onClick={handleGpsWeather}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-450 text-white font-bold rounded-xl text-xs border-none cursor-pointer transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Auto-detect location using GPS"
                    >
                        <MapPin size={14} className={gpsLoading ? "animate-pulse" : ""} />
                        <span>{gpsLoading ? lang.detecting : lang.btnGps}</span>
                    </button>
                </div>
            </div>

            {/* Error handling state */}
            {error && (
                <div className="p-5 mb-8 border border-red-200/50 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/10 text-red-750 dark:text-red-400 rounded-2xl font-semibold text-xs leading-relaxed">
                    ⚠️ {error}
                </div>
            )}

            {/* Loader animation */}
            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-3 text-slate-400 dark:text-slate-500">
                    <Loader2 size={36} className="animate-spin text-emerald-500" />
                    <p className="text-sm font-bold animate-pulse">{lang.loading}</p>
                </div>
            ) : weatherData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: General Weather Card & AI Advisory */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Weather Summary Card */}
                        <div className="p-8 text-white rounded-3xl bg-gradient-to-br from-blue-600 via-sky-500 to-teal-500 shadow-lg relative overflow-hidden group">
                            <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-500"></div>
                            
                            <div className="flex justify-between items-start z-10 relative">
                                <div>
                                    <span className="px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                                        {lang.liveForecast}
                                    </span>
                                    <h2 className="text-3xl font-black mt-4 tracking-tight text-white">
                                        {weatherData.current.city}
                                    </h2>
                                    <p className="text-xs font-semibold capitalize opacity-90 mt-1">
                                        {weatherData.current.description}
                                    </p>
                                </div>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${weatherData.current.icon}@4x.png`} 
                                    alt={weatherData.current.description} 
                                    className="w-24 h-24 select-none pointer-events-none drop-shadow-md"
                                />
                            </div>

                            <div className="mt-8 flex items-baseline gap-2 z-10 relative">
                                <span className="text-6xl font-black tracking-tighter">
                                    {weatherData.current.temp}°C
                                </span>
                                <span className="text-xs opacity-85 font-extrabold uppercase tracking-wider">
                                    {lang.feelsLike}{weatherData.current.feelsLike}°C
                                </span>
                            </div>
                        </div>

                        {/* AI Advisory Panel */}
                        <div className="p-6 border border-emerald-100 dark:border-emerald-950/45 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-3xl">
                            <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400">
                                <Sparkles size={16} className="animate-bounce" />
                                <h3 className="text-base font-extrabold tracking-tight">{lang.advisoryTitle}</h3>
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-semibold pl-1">
                                {weatherData.advisory}
                            </div>
                        </div>

                        {/* Detailed Metrics Section */}
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 tracking-tight">
                                {lang.metricsTitle}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Droplets size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.humidity}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{weatherData.current.humidity}%</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 rounded-xl">
                                        <Wind size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.windSpeed}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{weatherData.current.windSpeed} m/s</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                        <Gauge size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.pressure}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{weatherData.current.pressure} hPa</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                        <Eye size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.visibility}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{weatherData.current.visibility} km</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
                                        <Sunrise size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.sunrise}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{formatTime(weatherData.current.sunrise)}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                    <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-xl">
                                        <Sunset size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{lang.sunset}</p>
                                        <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{formatTime(weatherData.current.sunset)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: 5-Day Forecast Grid */}
                    <div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 tracking-tight flex items-center gap-2">
                            {lang.outlookTitle}
                        </h3>
                        <div className="flex flex-col gap-3">
                            {weatherData.forecast.map((dayForecast, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 bg-white dark:bg-gray-900 border border-slate-200/50 dark:border-gray-800/50 rounded-2xl flex items-center justify-between hover:shadow-sm hover:border-slate-300 dark:hover:border-gray-700 transition duration-200"
                                >
                                    <div className="flex items-center gap-3 min-w-[120px]">
                                        <img 
                                            src={`https://openweathermap.org/img/wn/${dayForecast.icon}.png`} 
                                            alt={dayForecast.condition} 
                                            className="w-10 h-10 shrink-0 bg-slate-50 dark:bg-gray-800 rounded-xl"
                                        />
                                        <div>
                                            <p className="text-xs font-black text-slate-805 dark:text-white">
                                                {formatDay(dayForecast.date)}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                                                {dayForecast.condition}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rainfall Chance */}
                                    <div className="flex items-center gap-1 text-[10px] font-extrabold text-blue-500 bg-blue-50/70 dark:bg-blue-950/20 px-2.5 py-1 rounded-lg">
                                        <CloudRain size={12} />
                                        <span>{dayForecast.rainChance}%</span>
                                    </div>

                                    {/* Daily High / Low Temperatures */}
                                    <div className="text-right font-semibold">
                                        <span className="text-xs font-black text-slate-805 dark:text-white">
                                            {dayForecast.maxTemp}°
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1.5">
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
