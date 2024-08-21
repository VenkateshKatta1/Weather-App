import React, { useState } from "react";
import "./style.css";

const API_KEY = "106ed7e15b90faa038e3974de41e5336";
const API_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const ICON_MAP = {
  Clouds: "/Images/clouds.png",
  Clear: "/Images/clear.png",
  Rain: "/Images/rain.png",
  Drizzle: "/Images/drizzle.png",
  Snow: "/Images/snow.png",
  Mist: "/Images/mist.png",
};

const convertToLocalTime = (timestamp, timezone) => {
  const localDate = new Date((timestamp + timezone) * 1000);
  return localDate.toLocaleString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch weather data
  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(`${API_URL}${city}&appid=${API_KEY}`);
      if (!response.ok)
        throw new Error("City not found or API request failed.");

      const data = await response.json();
      setWeatherData({
        ...data,
        localTime: convertToLocalTime(data.dt, data.timezone),
      });
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    } else {
      setError("Please enter a city name.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const getWeatherIcon = (weather) =>
    ICON_MAP[weather] || "/Images/default.png";

  return (
    <div className="weather-card">
      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
        />
        <button onClick={handleSearch}>
          <img src="/Images/search.png" alt="Search" />
        </button>
      </div>

      {error && (
        <div className="weather-error">
          <p>{error}</p>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-info">
          <img
            src={getWeatherIcon(weatherData.weather[0].main)}
            className="weather-icon"
            alt="Weather Icon"
          />
          <h1 className="weather-temp">
            {Math.round(weatherData.main.temp)}°C
          </h1>
          <h3 className="weather-feels">
            Feels like {Math.round(weatherData.main.feels_like)}°C
          </h3>
          <h2 className="weather-city">{weatherData.name}</h2>
          <span className="weather-country">{weatherData.sys.country}</span>
          <p className="weather-local-time">
            Local Time: {weatherData.localTime}
          </p>
          <div className="weather-details">
            <div className="weather-detail">
              <img src="/Images/humidity.png" alt="Humidity" />
              <div>
                <p className="weather-humidity">{weatherData.main.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="weather-detail">
              <img src="/Images/wind.png" alt="Wind" />
              <div>
                <p className="weather-wind">{weatherData.wind.speed} km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
