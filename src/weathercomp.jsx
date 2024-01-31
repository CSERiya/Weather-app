// WeatherComponent.js
import React, { useState } from 'react';
import './weathercomp.css'
import axios from 'axios';


const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  const API_KEY = '5e60fafe89e767af7b9244b4993c50ce';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleUnitChange = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const getWeatherData = async () => {
    try {
      const response = await axios.get(API_URL);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setWeatherData(null);
      
    }
  };

    const renderWeatherDetails = () => {
        if (!weatherData) {
          return <div>City not found! Please enter correct city name</div>;
        }
      
        const currentWeather = weatherData.main;
         const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
        const temperatureUnit = unit === 'metric' ? 'C' : 'F';
      
        const convertTemperature = (temp) => {
          if (unit === 'metric') {
            return temp;
          } else {
            // Convert Celsius to Fahrenheit
            return ((temp * 9) / 5 + 32).toFixed(2);
          }
        };
      
        return (
            <div className='parent'>
          <div className="weather-details" style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
            backgroundImage: `url('https://source.unsplash.com/1600x900/?${weatherData.name}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",}}></div>
<div className='content'>
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
            <div>
              <strong>Description:</strong> {weatherData.weather[0].description}
            </div>
            <img src={iconUrl} alt="Weather Icon" />

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