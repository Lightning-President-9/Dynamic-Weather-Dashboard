# Sleek Weather Dashboard

Hey there! Welcome to the repository for my dynamic weather dashboard. This was a really fun project built to create a clean, user-friendly way to check the weather, while also learning how to handle API keys securely.

Instead of calling the weather API directly from the browser (which would expose the secret API key), this app uses its own little server as a middleman. The browser asks our server for the weather, and the server secretly adds the API key before asking the OpenWeatherMap API. It's a much safer way to handle things!

**Check out the live demo here!**  
https://dynamic-weather-dashboard-cygs.onrender.com/

*(Note: The free OnRender instance may take a moment to spin up if it's been inactive.)*
---

## What It Can Do

- **Real-Time Weather**: Get the current temperature, conditions, humidity, wind speed, and more.  
- **City Search**: Look up the weather for any city in the world.  
- **Hourly & Daily Forecasts**: Plan your day with an 8-hour hourly forecast and a 7-day daily forecast.  
- **Unit Switching**: Easily toggle between Celsius and Fahrenheit.  
- **Sleek & Responsive**: A clean, modern design that looks great on both desktop and mobile devices.  
- **Secure API Calls**: The front-end never sees the API key, keeping it safe and sound on the server.

---

## How It's Built (The Tech Stack)

This project is split into two main parts: the part you see (the **client**) and the secret agent in the back (the **server**).

### Front-End (What you see in the browser):
- **HTML**: The skeleton of the dashboard.
- **Tailwind CSS**: For all the styling and making the design look clean and modern.
- **Vanilla JavaScript**: To handle all the user interactions, update the display, and talk to our server.

### Back-End (The secure middleman):
- **Node.js**: The JavaScript environment that runs our server.
- **Express.js**: A simple framework for building the server and our secure `/api/weather` endpoint.
- **OnRender**: The platform where the app is deployed and runs 24/7.

---
git clone https://github.com/Lightning-President-9/Dynamic-Weather-Dashboard.git
