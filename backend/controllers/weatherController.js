import { getLocalWeather, getFullWeather } from '../utils/weatherService.js';
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
    try {
        const data = await getLocalWeather(rawCity);
        return res.status(200).json({
            temp: Math.round(data.temp),
            condition: data.condition,
            description: data.description,
            icon: data.icon || '01d',
            city: rawCity
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch weather data", error: error.message });
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

// @desc    Get detailed weather forecast and farming advisories
// @route   GET /api/weather/details
// @access  Private
export const getWeatherDetails = async (req, res) => {
    const { city, lat, lng, lang } = req.query;
    try {
        const result = await getFullWeather({ city, lat, lng, lang });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Failed to load weather forecast details", error: error.message });
    }
};