const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
// OnRender provides the PORT environment variable.
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, css, js) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create the secure API endpoint
app.get('/api/weather', async (req, res) => {
    // Get the city from the query parameter (e.g., /api/weather?city=London)
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY; // Get the secret key from OnRender's environment

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
        
        // Send the combined data back to the front-end
        res.json({ current, forecast });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});