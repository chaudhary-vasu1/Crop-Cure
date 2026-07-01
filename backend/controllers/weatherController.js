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

// @desc    Get live weather data
// @route   GET /api/weather
// @access  Private
export const getWeather = async (req, res) => {
    const rawCity = req.query.city || 'Meerut';
    const apiKey = process.env.WEATHER_API_KEY;

    try {
        // 1. Try to fetch weather directly
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(rawCity)}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        
        return res.status(200).json({
            temp: Math.round(response.data.main.temp),
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            city: response.data.name
        });
    } catch (error) {
        // 2. If it fails (likely 404 for a village/precise location), use Gemini to resolve to nearest major weather city
        console.warn(`Weather search for '${rawCity}' failed. Attempting AI geocoding fallback...`);
        try {
            const prompt = `Identify the nearest major city, town, or district in India (recognized by standard weather services like OpenWeatherMap) for the village or location: "${rawCity}". Return ONLY the name of that city/district in English, with absolutely no punctuation, no bold tags, and no introductory or explanatory text (e.g. return "Meerut" or "Hapur").`;
            
            const aiResponse = await getAi().models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            
            const resolvedCity = aiResponse.text.trim().replace(/[*"']/g, '');
            console.log(`Gemini resolved '${rawCity}' to nearest weather station city: '${resolvedCity}'`);
            
            // Query weather again with the resolved city
            const urlFallback = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(resolvedCity)}&appid=${apiKey}&units=metric`;
            const responseFallback = await axios.get(urlFallback);
            
            return res.status(200).json({
                temp: Math.round(responseFallback.data.main.temp),
                condition: responseFallback.data.weather[0].main,
                description: responseFallback.data.weather[0].description,
                icon: responseFallback.data.weather[0].icon,
                city: `${rawCity} (${resolvedCity})` // Show both the searched village and the weather station city!
            });
        } catch (fallbackError) {
            console.error("Weather AI Fallback Error:", fallbackError.message);
            // Default fallback to Meerut
            try {
                const urlDefault = `https://api.openweathermap.org/data/2.5/weather?q=Meerut&appid=${apiKey}&units=metric`;
                const responseDefault = await axios.get(urlDefault);
                return res.status(200).json({
                    temp: Math.round(responseDefault.data.main.temp),
                    condition: responseDefault.data.weather[0].main,
                    description: responseDefault.data.weather[0].description,
                    icon: responseDefault.data.weather[0].icon,
                    city: `${rawCity} (Meerut)`
                });
            } catch (defaultError) {
                return res.status(500).json({ message: "Failed to fetch weather data", error: defaultError.message });
            }
        }
    }
};

// @desc    Reverse geocode coordinates using AI
// @route   GET /api/weather/reverse-geocode
// @access  Private
export const reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }
        
        console.log(`AI Reverse geocoding Lat: ${lat}, Lng: ${lng}...`);
        const prompt = `You are a precise geocoder. Given the latitude: ${lat} and longitude: ${lng} in India, identify the nearest village, town, and district name. Return ONLY the resolved location name in English (e.g. "Sardhana, Meerut" or "Noida, Gautam Buddha Nagar"), with absolutely no extra sentences, punctuation, or bold tags.`;
        
        const aiResponse = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        
        const locationName = aiResponse.text.trim().replace(/[*"']/g, '');
        console.log(`Resolved coordinate to location name: ${locationName}`);
        
        res.status(200).json({ location: locationName });
    } catch (error) {
        console.error("Reverse geocoding error:", error.message);
        res.status(500).json({ message: "Failed to reverse geocode location" });
    }
};
        
// Helper to group 3-hour forecasts by day
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

// Helper to generate AI agricultural advisory
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

// @desc    Get detailed weather forecast and farming advisories
// @route   GET /api/weather/details
// @access  Private
export const getWeatherDetails = async (req, res) => {
    const apiKey = process.env.WEATHER_API_KEY;
    const { city, lat, lng, lang } = req.query;
    const langCode = lang || 'en';
    
    let resolvedCity = city || 'Meerut';

    try {
        // If GPS parameters are passed, reverse geocode to resolve village/town name first
        if (lat && lng) {
            console.log(`Resolving GPS coordinates for detailed weather: lat=${lat}, lng=${lng}`);
            try {
                const prompt = `Given the latitude: ${lat} and longitude: ${lng} in India, resolve the nearest town/city name. Return ONLY the location name in English (e.g. "Sardhana" or "Meerut"), no extra punctuation.`;
                const aiResponse = await getAi().models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt
                });
                resolvedCity = aiResponse.text.trim().replace(/[*"']/g, '');
                console.log(`Resolved GPS to: ${resolvedCity}`);
            } catch (err) {
                console.error("GPS Reverse geocoding failed, using coordinates directly:", err.message);
            }
        }

        // Fetch current weather
        let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(resolvedCity)}&appid=${apiKey}&units=metric`;
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(resolvedCity)}&appid=${apiKey}&units=metric`;

        // If geocoding failed and resolvedCity is a number or invalid, we query openweather directly by coordinate
        if (lat && lng && resolvedCity === city) {
            currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        }

        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        const currentData = {
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
            city: currentRes.data.name
        };

        const forecastData = groupForecastByDay(forecastRes.data.list);
        const advisory = await getAiAdvisory(currentData.city, currentData, forecastData, langCode);

        return res.status(200).json({
            current: currentData,
            forecast: forecastData,
            advisory
        });

    } catch (error) {
        console.error("Detailed weather fetch failed:", error.message);
        
        // Final fallback block (query default Meerut weather)
        try {
            const currentUrlDefault = `https://api.openweathermap.org/data/2.5/weather?q=Meerut&appid=${apiKey}&units=metric`;
            const forecastUrlDefault = `https://api.openweathermap.org/data/2.5/forecast?q=Meerut&appid=${apiKey}&units=metric`;
            
            const [currentRes, forecastRes] = await Promise.all([
                axios.get(currentUrlDefault),
                axios.get(forecastUrlDefault)
            ]);

            const currentData = {
                temp: Math.round(currentRes.data.main.temp),
                feelsLike: Math.round(currentRes.data.main.feels_like),
                condition: currentRes.data.weather[0].main,
                description: currentRes.data.weather[0].description,
                icon: currentRes.data.weather[0].icon,
                humidity: currentRes.data.main.humidity,
                windSpeed: currentRes.data.wind.speed,
                pressure: currentRes.data.main.pressure,
                visibility: 10,
                sunrise: currentRes.data.sys.sunrise,
                sunset: currentRes.data.sys.sunset,
                city: `${resolvedCity} (Fallback: Meerut)`
            };

            const forecastData = groupForecastByDay(forecastRes.data.list);
            const advisory = await getAiAdvisory("Meerut", currentData, forecastData, langCode);

            return res.status(200).json({
                current: currentData,
                forecast: forecastData,
                advisory
            });
        } catch (fallbackErr) {
            return res.status(500).json({ message: "Failed to load weather forecast details", error: fallbackErr.message });
        }
    }
};