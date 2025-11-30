/**
 * Weather Service for AgriConnect
 * Handles OpenWeather API integration
 */
const axios = require('axios');

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Simple in-memory cache
const cache = new Map();

const weatherService = {
  // Get current weather for coordinates
  async getWeather(lat, lon, regionName) {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        // Return mock data if no API key
        return this.getMockWeather(regionName);
      }

      const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      });

      const data = this.formatWeatherData(response.data, regionName);
      
      cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Weather API error:', error.message);
      return this.getMockWeather(regionName);
    }
  },

  // Get 7-day forecast
  async getForecast(lat, lon, regionName) {
    const cacheKey = `forecast_${lat}_${lon}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        return this.getMockForecast(regionName);
      }

      const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
          cnt: 40 // 5 days, 8 readings per day
        }
      });

      const data = this.formatForecastData(response.data, regionName);
      
      cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Forecast API error:', error.message);
      return this.getMockForecast(regionName);
    }
  },

  // Get weather alerts (using One Call API if available)
  async getAlerts(lat, lon) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        return [];
      }

      // One Call API 3.0 for alerts
      const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
        params: {
          lat,
          lon,
          appid: apiKey,
          exclude: 'minutely,hourly,daily'
        }
      });

      return response.data.alerts || [];
    } catch (error) {
      console.error('Alerts API error:', error.message);
      return [];
    }
  },

  // Format current weather data
  formatWeatherData(data, regionName) {
    return {
      region: regionName,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      rain_chance: data.clouds?.all || 0,
      pressure: data.main.pressure,
      visibility: data.visibility,
      sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
      sunset: new Date(data.sys.sunset * 1000).toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  // Format forecast data
  formatForecastData(data, regionName) {
    // Group by day
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [],
          humidity: [],
          descriptions: [],
          rain: 0
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
      dailyForecasts[date].rain += item.rain?.['3h'] || 0;
    });

    const forecast = Object.values(dailyForecasts).map(day => ({
      date: day.date,
      temp_min: Math.round(Math.min(...day.temps)),
      temp_max: Math.round(Math.max(...day.temps)),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      rain_mm: Math.round(day.rain * 10) / 10
    }));

    return {
      region: regionName,
      forecast: forecast.slice(0, 7),
      updated_at: new Date().toISOString()
    };
  },

  // Mock weather data for development/fallback
  getMockWeather(regionName) {
    return {
      region: regionName || 'Gaborone',
      temperature: 28,
      feels_like: 30,
      humidity: 45,
      description: 'partly cloudy',
      icon: '02d',
      wind_speed: 3.5,
      rain_chance: 20,
      pressure: 1015,
      visibility: 10000,
      sunrise: new Date().setHours(6, 0, 0, 0),
      sunset: new Date().setHours(18, 30, 0, 0),
      updated_at: new Date().toISOString(),
      is_mock: true
    };
  },

  // Mock forecast data
  getMockForecast(regionName) {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temp_min: 18 + Math.floor(Math.random() * 5),
        temp_max: 28 + Math.floor(Math.random() * 8),
        humidity: 40 + Math.floor(Math.random() * 30),
        description: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)],
        rain_mm: Math.random() < 0.3 ? Math.round(Math.random() * 10) : 0
      });
    }

    return {
      region: regionName || 'Gaborone',
      forecast,
      updated_at: new Date().toISOString(),
      is_mock: true
    };
  },

  // Get farming advice based on weather
  getFarmingAdvice(weather) {
    const advice = [];
    
    if (weather.temperature > 35) {
      advice.push('High temperature warning: Consider irrigating crops early morning or late evening');
    }
    
    if (weather.humidity < 30) {
      advice.push('Low humidity: Monitor soil moisture levels closely');
    }
    
    if (weather.rain_chance > 60) {
      advice.push('High chance of rain: Consider postponing pesticide application');
    }
    
    if (weather.wind_speed > 10) {
      advice.push('Strong winds expected: Secure any loose materials and consider wind-sensitive crops');
    }
    
    return advice;
  }
};

module.exports = weatherService;
