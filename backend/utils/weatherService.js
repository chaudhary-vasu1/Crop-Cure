import axios from 'axios';

/**
 * Fetches current weather data for a given location.
 * @param {string} location - The city name (e.g., "Meerut", "Sacramento")
 * @returns {object} - Standardized weather data
 */
export const getLocalWeather = async (location) => {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        // Using metric units for Celsius
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        const data = response.data;

        return {
            temp: data.main.temp,
            humidity: data.main.humidity,
            condition: data.weather[0].main, // e.g., "Rain", "Clear", "Clouds"
            description: data.weather[0].description,
            rainfallAmount: data.rain ? data.rain['1h'] || 0 : 0 // mm in the last hour
        };
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch weather data for the specified location.');
    }
};