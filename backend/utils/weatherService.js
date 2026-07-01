import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

// Lazy client initialization to avoid ES Module import hoisting issues
let aiInstance = null;
const getAi = () => {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
};

// In-memory caching system
const weatherCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

const getCachedData = (key) => {
    const cached = weatherCache.get(key);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`[Weather Service] Cache HIT for key: ${key}`);
        return cached.data;
    }
    return null;
};

const setCachedData = (key, data) => {
    console.log(`[Weather Service] Caching data for key: ${key}`);
    weatherCache.set(key, {
        timestamp: Date.now(),
        data
    });
};

/**
 * Standardizes 3-hour forecasts from OpenWeatherMap by grouping by date.
 */
const groupForecastByDay = (list) => {
    const days = {};
    list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
        if (!days[date]) {
            days[date] = {
                temps: [],
                conditions: [],
                icons: [],
                humidities: [],
                windSpeeds: [],
                rainChances: []
            };
        }
        days[date].temps.push(item.main.temp);
        days[date].conditions.push(item.weather[0].main);
        days[date].icons.push(item.weather[0].icon);
        days[date].humidities.push(item.main.humidity);
        days[date].windSpeeds.push(item.wind.speed);
        if (item.pop !== undefined) {
            days[date].rainChances.push(item.pop * 100);
        }
    });

    return Object.keys(days).slice(0, 5).map(date => {
        const dayData = days[date];
        const minTemp = Math.round(Math.min(...dayData.temps));
        const maxTemp = Math.round(Math.max(...dayData.temps));
        
        const mode = (arr) => arr.sort((a,b) =>
            arr.filter(v => v===a).length - arr.filter(v => v===b).length
        ).pop();
        
        const condition = mode(dayData.conditions);
        const icon = mode(dayData.icons);
        const avgHumidity = Math.round(dayData.humidities.reduce((a,b)=>a+b, 0) / dayData.humidities.length);
        const maxWind = Math.round(Math.max(...dayData.windSpeeds));
        const maxRainChance = dayData.rainChances.length > 0 ? Math.round(Math.max(...dayData.rainChances)) : 0;

        return {
            date,
            minTemp,
            maxTemp,
            condition,
            icon,
            avgHumidity,
            maxWind,
            rainChance: maxRainChance
        };
    });
};

/**
 * Generates AI Advisory recommendations based on weather parameters.
 */
const getAiAdvisory = async (city, current, forecast, lang = 'en') => {
    try {
        const forecastSummary = forecast.map(f => `${f.date}: ${f.condition}, Temp: ${f.minTemp}-${f.maxTemp}°C, Rain: ${f.rainChance}%`).join('; ');
        
        let targetLanguage = 'English';
        if (lang === 'hi') targetLanguage = 'Hindi (हिंदी)';
        else if (lang === 'es') targetLanguage = 'Spanish (Español)';

        const prompt = `You are a professional agricultural advisor. Based on this weather data for the city/village "${city}":
Current Weather: Temp ${current.temp}°C, Humidity ${current.humidity}%, Condition ${current.description}, Wind ${current.windSpeed} m/s.
5-Day Forecast: ${forecastSummary}

Provide a practical agricultural advisory for farmers in 3-4 clear, bulleted recommendations. Focus on irrigation schedule, pesticide/fertilizer application safety, and crop protection actions based on these specific conditions.
Keep the recommendations concise and return them as a bulleted text list in ${targetLanguage}. Do not add markdown bolding or code blocks.`;

        const aiResponse = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return aiResponse.text.trim();
    } catch (err) {
        console.error("AI Advisory Error:", err);
        if (lang === 'hi') {
            return "• सिंचाई करने से पहले स्थानीय मिट्टी की नमी की जांच करें।\n• दोपहर की अत्यधिक गर्मी से युवा पौधों की रक्षा करें।\n• सामान्य कृषि प्रक्रियाएं लागू होती हैं।";
        } else if (lang === 'es') {
            return "• Verifique la humedad del suelo local antes de regar.\n• Proteja las plántulas jóvenes del calor extremo del mediodía.\n• Se aplican los procedimientos agrícolas estándar.";
        }
        return "• Check local soil moisture before watering.\n• Protect young seedlings from extreme midday heat.\n• Standard farming procedures apply.";
    }
};

/**
 * Main function to retrieve current weather, used by controllers.
 */
export const getLocalWeather = async (location) => {
    const cacheKey = `current:${location.toLowerCase().trim()}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.WEATHER_API_KEY;
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        const weatherResult = {
            temp: data.main.temp,
            humidity: data.main.humidity,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            rainfallAmount: data.rain ? data.rain['1h'] || 0 : 0
        };

        setCachedData(cacheKey, weatherResult);
        return weatherResult;
    } catch (error) {
        console.warn(`Primary OpenWeatherMap call failed for getLocalWeather, trying Open-Meteo fallback:`, error.message);
        try {
            // Geocode location using Open-Meteo
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
            const geoRes = await axios.get(geoUrl);
            let lat = 28.98, lng = 77.70; // default Meerut
            if (geoRes.data.results && geoRes.data.results.length > 0) {
                lat = geoRes.data.results[0].latitude;
                lng = geoRes.data.results[0].longitude;
            }

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m,precipitation`;
            const response = await axios.get(url);
            const current = response.data.current_weather;
            const weatherResult = {
                temp: current.temperature,
                humidity: response.data.hourly ? response.data.hourly.relativehumidity_2m[0] : 60,
                condition: current.weathercode > 50 ? 'Rain' : 'Clear',
                description: `Code: ${current.weathercode}`,
                rainfallAmount: response.data.hourly ? response.data.hourly.precipitation[0] || 0 : 0
            };
            setCachedData(cacheKey, weatherResult);
            return weatherResult;
        } catch (fallbackErr) {
            console.error('All weather sources failed in getLocalWeather:', fallbackErr.message);
            throw new Error('Failed to fetch weather data.');
        }
    }
};

/**
 * Returns comprehensive weather information (Current + 5-day forecast + AI Advisory).
 */
export const getFullWeather = async ({ city, lat, lng, lang = 'en' }) => {
    let resolvedCity = city || 'Meerut';
    const cacheKey = `full:${lat && lng ? `${Number(lat).toFixed(2)},${Number(lng).toFixed(2)}` : resolvedCity.toLowerCase().trim()}:${lang}`;
    
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const apiKey = process.env.WEATHER_API_KEY;
    let current = null;
    let forecast = [];

    try {
        if (lat && lng && resolvedCity === city) {
            console.log(`Resolving GPS coordinates for detailed weather: lat=${lat}, lng=${lng}`);
            const prompt = `Given the latitude: ${lat} and longitude: ${lng} in India, resolve the nearest town/city name. Return ONLY the location name in English (e.g. "Sardhana" or "Meerut"), no extra punctuation.`;
            const aiResponse = await getAi().models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            resolvedCity = aiResponse.text.trim().replace(/[*"']/g, '');
        }

        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(resolvedCity)}&appid=${apiKey}&units=metric`;
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(resolvedCity)}&appid=${apiKey}&units=metric`;

        if (lat && lng && resolvedCity === city) {
            currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        }

        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        current = {
            temp: Math.round(currentRes.data.main.temp),
            feelsLike: Math.round(currentRes.data.main.feels_like),
            condition: currentRes.data.weather[0].main,
            description: currentRes.data.weather[0].description,
            icon: currentRes.data.weather[0].icon,
            humidity: currentRes.data.main.humidity,
            windSpeed: currentRes.data.wind.speed,
            pressure: currentRes.data.main.pressure,
            visibility: currentRes.data.visibility ? (currentRes.data.visibility / 1000) : 10,
            sunrise: currentRes.data.sys.sunrise,
            sunset: currentRes.data.sys.sunset,
            city: currentRes.data.name,
            rainfallAmount: currentRes.data.rain ? currentRes.data.rain['1h'] || 0 : 0
        };

        forecast = groupForecastByDay(forecastRes.data.list);

    } catch (error) {
        console.warn(`Primary detailed weather forecast query failed: ${error.message}. Resorting to fallbacks.`);
        try {
            let resolvedLat = lat;
            let resolvedLng = lng;
            if (!resolvedLat || !resolvedLng) {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(resolvedCity)}&count=1`;
                const geoRes = await axios.get(geoUrl);
                if (geoRes.data.results && geoRes.data.results.length > 0) {
                    resolvedLat = geoRes.data.results[0].latitude;
                    resolvedLng = geoRes.data.results[0].longitude;
                    resolvedCity = geoRes.data.results[0].name;
                } else {
                    resolvedLat = 28.98;
                    resolvedLng = 77.70;
                    resolvedCity = 'Meerut (Fallback)';
                }
            }

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLat}&longitude=${resolvedLng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relativehumidity_2m_max&timezone=auto`;
            const response = await axios.get(url);
            const data = response.data;

            current = {
                temp: Math.round(data.current_weather.temperature),
                feelsLike: Math.round(data.current_weather.temperature),
                condition: data.current_weather.weathercode > 50 ? 'Rain' : 'Clear',
                description: `Code: ${data.current_weather.weathercode}`,
                icon: '01d',
                humidity: 65,
                windSpeed: data.current_weather.windspeed / 3.6,
                pressure: 1013,
                visibility: 10,
                sunrise: Math.floor(Date.now() / 1000),
                sunset: Math.floor(Date.now() / 1000),
                city: resolvedCity,
                rainfallAmount: 0
            };

            forecast = data.daily.time.map((time, idx) => ({
                date: time,
                minTemp: Math.round(data.daily.temperature_2m_min[idx]),
                maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
                condition: data.daily.weathercode[idx] > 50 ? 'Rain' : 'Clear',
                icon: '01d',
                avgHumidity: data.daily.relativehumidity_2m_max[idx] || 60,
                maxWind: Math.round(data.daily.windspeed_10m_max[idx] / 3.6),
                rainChance: data.daily.weathercode[idx] > 50 ? 80 : 10
            })).slice(0, 5);

        } catch (fallbackErr) {
            console.error('All forecast mechanisms failed:', fallbackErr.message);
            throw new Error('Failed to load weather forecast details.');
        }
    }

    const advisory = await getAiAdvisory(current.city, current, forecast, lang);
    const result = {
        current,
        forecast,
        advisory
    };

    setCachedData(cacheKey, result);
    return result;
};