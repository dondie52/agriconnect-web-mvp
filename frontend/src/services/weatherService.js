/**
 * Weather Service for AgriConnect
 * Uses Open-Meteo API (no API key required)
 * https://open-meteo.com/
 */

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * WMO Weather Code to Description Mapping
 * Based on WMO Code Table 4677
 */
const weatherCodeDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

/**
 * Get weather description from WMO code
 * @param {number} code - WMO weather code
 * @returns {string} Human-readable description
 */
export const getWeatherDescription = (code) => {
  return weatherCodeDescriptions[code] || 'Unknown';
};

/**
 * Fetch weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const getWeather = async (lat, lon) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: 'true',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
    timezone: 'auto',
  });

  const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  // Transform the response into a more usable format
  const current = data.current_weather;
  const daily = data.daily;

  return {
    // Current conditions
    temperature: Math.round(current.temperature),
    windspeed: Math.round(current.windspeed),
    weatherCode: current.weathercode,
    description: getWeatherDescription(current.weathercode),
    isDay: current.is_day === 1,

    // Today's forecast (first day in daily array)
    highTemp: Math.round(daily.temperature_2m_max[0]),
    lowTemp: Math.round(daily.temperature_2m_min[0]),
    precipitationChance: daily.precipitation_probability_max[0] || 0,

    // Location info
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,

    // Raw data for extended use
    dailyForecast: daily.time.map((date, index) => ({
      date,
      highTemp: Math.round(daily.temperature_2m_max[index]),
      lowTemp: Math.round(daily.temperature_2m_min[index]),
      precipitationChance: daily.precipitation_probability_max[index] || 0,
      weatherCode: daily.weathercode[index],
      description: getWeatherDescription(daily.weathercode[index]),
    })),

    // Timestamp for cache validation
    fetchedAt: new Date().toISOString(),
  };
};

export default { getWeather, getWeatherDescription };

