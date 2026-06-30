import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
            
            const aiResponse = await ai.models.generateContent({
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
        
        const aiResponse = await ai.models.generateContent({
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