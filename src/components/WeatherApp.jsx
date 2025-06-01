import React, { useState, useEffect } from "react";
import axios from "axios";
import { WiHumidity, WiStrongWind, WiDayStormShowers } from "react-icons/wi";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import ForecastCard from "./ForecastCard";
import "./WeatherApp.css";

const api = {
  base: "https://api.openweathermap.org/data/2.5/",
  key: "fcc8de7015bbb202209bbf0261babf4c",
};

const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const fetchWeather = async (city) => {
    if (!city) return;
    setLoading(true);

    try {
      const weatherRes = await axios.get(
        `${api.base}weather?q=${city}&units=metric&appid=${api.key}`
      );
      setWeather(weatherRes.data);

      const forecastRes = await axios.get(
        `${api.base}forecast?q=${city}&units=metric&appid=${api.key}`
      );
      setForecast(forecastRes.data.list.slice(0, 5));

      setError("");
      if (!history.includes(city)) {
        const updatedHistory = [city, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError("City not found. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather(query);
    }
  };

  return (
    <div className={`weather-container ${weather?.weather?.[0]?.main?.toLowerCase() || ""}`}>
      <h1 className="title">🌎 Weather Forecast</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="search-input"
        />
        <button onClick={() => fetchWeather(query)} className="search-button">
          <FaSearch />
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {weather && (
        <div className="weather-info">
          <h2 className="city-name">
            <FaMapMarkerAlt /> {weather.name}, {weather.sys.country}
          </h2>
          <p className="temperature">{Math.round(weather.main.temp)}°C</p>
          <p className="weather-description">{weather.weather[0].description}</p>

          <div className="weather-icons">
            <p className="humidity">
              <WiHumidity /> {weather.main.humidity}%
            </p>
            <p className="wind-speed">
              <WiStrongWind /> {weather.wind.speed} m/s
            </p>
            {weather.weather[0].main.toLowerCase().includes("storm") && (
              <p className="storm">
                <WiDayStormShowers /> Storm Warning!
              </p>
            )}
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h3>🌦 5-Day Forecast</h3>
          {forecast.map((item, index) => (
            <ForecastCard key={index} forecast={item} />
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-container">
          <h3>📌 Recent Searches</h3>
          {history.map((city, index) => (
            <button key={index} onClick={() => fetchWeather(city)} className="history-button">
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
