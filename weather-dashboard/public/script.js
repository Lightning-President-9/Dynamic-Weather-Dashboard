document.addEventListener('DOMContentLoaded', () => {
    
    // ... (all your DOM element variables are the same) ...
    const locationEl = document.getElementById('location');
    const loadingSpinner = document.getElementById('loading-spinner');
    // ... keep all other element definitions

    let currentUnit = 'celsius';
    let weatherDataCache = null;

    // --- API Fetching ---
    const getWeatherData = async (city = 'Delhi') => {
        showLoading();

        // This URL points to our new server endpoint
        const apiUrl = `/api/weather?city=${city}`;

        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'City not found');
            }

            const data = await response.json();
            weatherDataCache = { current: data.current, forecast: data.forecast };
            updateUI();

        } catch (error) {
            console.error("Error fetching weather data:", error);
            showError(error.message);
        }
    };
    
    // --- UI Updates (No changes needed) ---
    // The entire updateUI function and its helpers (updateHourlyForecast, etc.)
    // remain exactly the same, as the data structure we receive is the same.
    const updateUI = () => { /* ... same as before ... */ };
    const updateHourlyForecast = (hourlyData) => { /* ... same as before ... */ };
    const updateDailyForecast = (dailyData) => { /* ... same as before ... */ };
    
    // --- UI State Management (No changes needed) ---
    const showLoading = () => { /* ... same as before ... */ };
    const hideLoading = () => { /* ... same as before ... */ };
    const showError = (message) => { /* ... same as before ... */ };

    // --- Unit Conversion & Formatting (No changes needed) ---
    const formatTemperature = (temp) => { /* ... same as before ... */ };
    const formatSpeed = (speed) => { /* ... same as before ... */ };
    const toggleUnits = (unit) => { /* ... same as before ... */ };
    
    // --- Event Listeners ---
    
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
            cityInput.value = '';
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    refreshBtn.addEventListener('click', () => {
        if (weatherDataCache && weatherDataCache.current) {
            getWeatherData(weatherDataCache.current.name);
        }
    });

    celsiusBtn.addEventListener('click', () => toggleUnits('celsius'));
    fahrenheitBtn.addEventListener('click', () => toggleUnits('fahrenheit'));

    // --- Initial Load ---
    getWeatherData('Delhi'); // Load default city on start
});