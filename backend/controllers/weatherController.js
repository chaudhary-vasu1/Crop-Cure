import axios from 'axios';

// @desc    Get live weather data
// @route   GET /api/weather
// @access  Private
export const getWeather = async (req, res) => {
    try {
        // We will default to Meerut/Delhi region, but you can pass any city from the frontend later!
        const city = req.query.city || 'Meerut'; 
        const apiKey = process.env.WEATHER_API_KEY;
        
        // OpenWeatherMap URL (assuming you are using standard OpenWeather API)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        const response = await axios.get(url);
        
        res.status(200).json({
            temp: Math.round(response.data.main.temp),
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            city: response.data.name
        });
        
    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch weather data" });
    }
};