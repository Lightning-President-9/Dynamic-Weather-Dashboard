const express = require('express');
const path = require('path');

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

const rateLimit = require('express-rate-limit');

const weatherLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute per IP
    message: {
        error: "Too many requests. Please try again later."
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', weatherLimiter, async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required.' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const [currentWeatherRes, forecastRes] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);
        
        if (!currentWeatherRes.ok || !forecastRes.ok) {
            return res.status(404).json({ error: 'City not found' });
        }

        const current = await currentWeatherRes.json();
        const forecast = await forecastRes.json();
        
        res.json({ current, forecast });

    } catch (error) {
        console.error("Error on server:", error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
