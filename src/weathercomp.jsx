
import React, { useState } from 'react';
import axios from 'axios';
import './weathercomp.css';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [unit, setUnit] = useState('metric'); 
  const [showForecast, setShowForecast] = useState(false);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const CURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`;

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleUnitChange = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const getWeatherData = async () => {
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(CURRENT_WEATHER_API_URL),
        axios.get(FORECAST_API_URL),
      ]);

      setWeatherData(currentWeatherResponse.data);
      setForecastData(forecastResponse.data);
    } catch (error) {
      alert('City not exist');
      console.error('Error fetching weather data:', error.message);
      setWeatherData(null);
      setForecastData(null);
    }
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  const getUniqueDays = (forecastList) => {
    const uniqueDays = [];
    const daySet = new Set();
    let uniqueDayCount = 0;
  
    forecastList.forEach((forecast) => {
      const day = forecast.dt_txt.split(' ')[0]; 
      if (!daySet.has(day) && uniqueDayCount < 5) {
        uniqueDays.push(forecast);
        daySet.add(day);
        uniqueDayCount++;
      }
    });
  
    return uniqueDays;
  };
  

  const renderWeatherDetails = () => {
    if (!weatherData || !forecastData) {
      return <div>No data available</div>;
    }
  
    const currentWeather = weatherData.main;
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    const temperatureUnit = unit === 'metric' ? 'C' : 'F';
  
    const convertTemperature = (temp) => {
      return unit === 'metric' ? temp : ((temp * 9) / 5 + 32).toFixed(2);
    };
  
    return (
      <div className='parent' >
        <div className="weather-details" style= {{backgroundImage: `url('https://source.unsplash.com/1600x900/?${weatherData.name}')`}}></div>

        <div className='content'>
          {/* Current Weather Details */}
          <h2>{weatherData.name} Weather</h2>
          <div>
          <strong>Current Temperature:</strong>{' '}
          {convertTemperature(currentWeather.temp)}&deg;{temperatureUnit}
        </div>
        <div>
          <strong>Min Temperature:</strong>{' '}
          {convertTemperature(currentWeather.temp_min)}&deg;{temperatureUnit}
        </div>
        <div>
          <strong>Max Temperature:</strong>{' '}
          {convertTemperature(currentWeather.temp_max)}&deg;{temperatureUnit}
        </div>
        <div>
          <strong>Humidity:</strong> {currentWeather.humidity}%
        </div>
        <div>
          <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s,{' '}
          <strong>Direction:</strong> {weatherData.wind.deg}&deg;
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
  <div>
    <strong>Description:</strong> {weatherData.weather[0].description}
  </div>
  <img src={iconUrl} alt="Weather Icon" style={{ marginLeft: '10px' }} />
</div>

</div>
  
  {/* 5-days forecast weather details */}
<div className="forecast-details">
  <h2>5-Day Forecast</h2>
  {showForecast && (
    <div className="forecast-boxes">
      {getUniqueDays(forecastData.list).map((forecast) => (
        <div className="forecast-box" key={forecast.dt}>
          <strong>Date:</strong> {forecast.dt_txt}
          <div>
            <strong>Average Temperature:</strong>{' '}
            {convertTemperature(forecast.main.temp)}&deg;{temperatureUnit}
          </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
  <div>
    <strong>Description:</strong> {forecast.weather[0].description}
  </div>
  <img
                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                  alt="Weather Icon" style={{ marginLeft: '10px' }}
                />
  </div>
        </div>
      ))}
    </div>
  )}
  <button onClick={toggleForecast}>
    {showForecast ? 'Hide Forecast' : 'Show 5-Day Forecast'}
  </button>
</div>

      </div>
    );
  };

  return (
    <div className="box-container">
      <div className="weather-container">
        <input 
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
        <button onClick={getWeatherData}>Get Weather</button>
        <label>
          <input
            type="checkbox"
            checked={unit === 'imperial'}
            onChange={handleUnitChange}
          />
          Fahrenheit
        </label>
      </div>
      <div className='inner'>{renderWeatherDetails()}</div>
    </div>
  );
};
 
export default WeatherComponent;