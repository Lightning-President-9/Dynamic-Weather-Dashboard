document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Variables ---
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const locationEl = document.getElementById('location');
    const currentDayEl = document.getElementById('current-day');
    const currentDateEl = document.getElementById('current-date');
    const currentWeatherIcon = document.getElementById('current-weather-icon');
    const currentTempEl = document.getElementById('current-temp');
    const currentConditionEl = document.getElementById('current-condition');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');
    const feelsLikeEl = document.getElementById('feels-like');
    const visibilityEl = document.getElementById('visibility');
    const celsiusBtn = document.getElementById('celsius-btn');
    const fahrenheitBtn = document.getElementById('fahrenheit-btn');
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    const dailyForecastContainer = document.getElementById('daily-forecast');
    const loadingSpinner = document.getElementById('loading-spinner');
    const weatherContainer = document.getElementById('weather-container');
    const forecastContainer = document.getElementById('forecast-container');
    const errorMessage = document.getElementById('error-message');
    const refreshBtn = document.getElementById('refresh-btn');

    let currentUnit = 'celsius';
    let weatherDataCache = null;

    // --- API Fetching (Updated for OnRender) ---
    const getWeatherData = async (city = 'Nagpur') => {
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
    
    // --- UI Updates ---
    const updateUI = () => {
        if (!weatherDataCache) return;

        const { current, forecast } = weatherDataCache;

        // Update header
        locationEl.textContent = `${current.name}, ${current.sys.country}`;

        // Update current weather
        const now = new Date(current.dt * 1000);
        currentDayEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
        currentDateEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        currentWeatherIcon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
        currentTempEl.textContent = formatTemperature(current.main.temp);
        currentConditionEl.textContent = current.weather[0].description;
        
        // Update details
        humidityEl.textContent = `${current.main.humidity}%`;
        windSpeedEl.textContent = formatSpeed(current.wind.speed);
        feelsLikeEl.textContent = formatTemperature(current.main.feels_like);
        visibilityEl.textContent = `${(current.visibility / 1000).toFixed(1)} km`;

        // Update hourly forecast
        updateHourlyForecast(forecast.list);
        
        // Update daily forecast
        updateDailyForecast(forecast.list);

        hideLoading();
    };
    
    const updateHourlyForecast = (hourlyData) => {
        hourlyForecastContainer.innerHTML = '';
        const next24Hours = hourlyData.slice(0, 8); // 3-hour intervals for 24 hours
        next24Hours.forEach(item => {
            const hour = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const hourlyEl = document.createElement('div');
            hourlyEl.className = "flex flex-col items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex-shrink-0";
            hourlyEl.innerHTML = `
                <p class="text-sm text-gray-600 dark:text-gray-300">${hour}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather icon" class="w-12 h-12">
                <p class="font-semibold text-gray-800 dark:text-white">${formatTemperature(item.main.temp)}</p>
            `;
            hourlyForecastContainer.appendChild(hourlyEl);
        });
    };

    const updateDailyForecast = (dailyData) => {
        dailyForecastContainer.innerHTML = '';
        const dailyForecasts = {};

        dailyData.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            if (!dailyForecasts[date] && Object.keys(dailyForecasts).length < 7) {
                 // Ensure we don't duplicate today
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                if(date !== today) {
                   dailyForecasts[date] = { temps: [], weather: item.weather[0] };
                }
            }
            if(dailyForecasts[date]) {
                dailyForecasts[date].temps.push(item.main.temp);
            }
        });

        for (const day in dailyForecasts) {
            const dayData = dailyForecasts[day];
            const minTemp = Math.min(...dayData.temps);
            const maxTemp = Math.max(...dayData.temps);

            const dailyEl = document.createElement('div');
            dailyEl.className = "flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-3";
            dailyEl.innerHTML = `
                <p class="font-medium text-gray-800 dark:text-white w-1/3">${day}</p>
                <div class="flex items-center w-1/3 justify-center">
                    <img src="https://openweathermap.org/img/wn/${dayData.weather.icon}@2x.png" alt="weather icon" class="w-8 h-8 mr-2">
                    <p class="text-sm text-gray-600 dark:text-gray-300 capitalize">${dayData.weather.description}</p>
                </div>
                <p class="font-semibold text-gray-800 dark:text-white w-1/3 text-right">${formatTemperature(maxTemp)} / ${formatTemperature(minTemp)}</p>
            `;
            dailyForecastContainer.appendChild(dailyEl);
        }
    };
    
    // --- UI State Management ---
    const showLoading = () => {
        loadingSpinner.style.display = 'block';
        weatherContainer.classList.add('hidden');
        forecastContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        locationEl.textContent = 'Loading...';
    };

    const hideLoading = () => {
        loadingSpinner.style.display = 'none';
        weatherContainer.classList.remove('hidden');
        forecastContainer.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    };

    const showError = (message) => {
        loadingSpinner.style.display = 'none';
        weatherContainer.classList.add('hidden');
        forecastContainer.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorMessage.querySelector('p').textContent = message;
        locationEl.textContent = 'Error';
    };
    
    // --- Unit Conversion & Formatting ---
    const formatTemperature = (temp) => {
        if (currentUnit === 'celsius') {
            return `${Math.round(temp)}°C`;
        } else {
            return `${Math.round(temp * 9/5 + 32)}°F`;
        }
    };
    
    const formatSpeed = (speed) => {
        // speed is in meter/sec, convert to km/h
         return `${(speed * 3.6).toFixed(1)} km/h`;
    }

    const toggleUnits = (unit) => {
        if (unit === currentUnit) return;
        currentUnit = unit;
        if (unit === 'celsius') {
            celsiusBtn.classList.add('bg-white', 'dark:bg-gray-500', 'text-gray-800', 'dark:text-white', 'shadow');
            fahrenheitBtn.classList.remove('bg-white', 'dark:bg-gray-500', 'text-gray-800', 'dark:text-white', 'shadow');
        } else {
            fahrenheitBtn.classList.add('bg-white', 'dark:bg-gray-500', 'text-gray-800', 'dark:text-white', 'shadow');
            celsiusBtn.classList.remove('bg-white', 'dark:bg-gray-500', 'text-gray-800', 'dark:text-white', 'shadow');
        }
        updateUI(); // Re-render with new units
    };
    
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
        } else {
            getWeatherData(); // Fallback to default city
        }
    });

    celsiusBtn.addEventListener('click', () => toggleUnits('celsius'));
    fahrenheitBtn.addEventListener('click', () => toggleUnits('fahrenheit'));

    // --- Initial Load ---
    getWeatherData(); // Load default city on start
});