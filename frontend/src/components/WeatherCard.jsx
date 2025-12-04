/**
 * WeatherCard Component for AgriConnect
 * Displays real-time weather from Open-Meteo API
 * Auto-refreshes every 10 minutes
 * Uses user's region if available
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useWeather } from '../hooks/useWeather';
import { useRegions } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Card } from './UI';
import { 
  Cloud, 
  RefreshCw, 
  ArrowRight, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Wind,
  Droplets,
  ThermometerSun,
  ThermometerSnowflake,
  CloudFog,
  MapPin
} from 'lucide-react';

// Default coordinates (Gaborone)
const DEFAULT_COORDS = { lat: -24.6282, lon: 25.9231, name: 'Gaborone' };

/**
 * Get weather icon based on weather code
 */
const getWeatherIcon = (code, isDay = true) => {
  const iconProps = { size: 48, strokeWidth: 1.5 };
  
  // Clear or mainly clear
  if (code <= 1) {
    return <Sun {...iconProps} className="text-yellow-500" />;
  }
  // Partly cloudy, overcast
  if (code <= 3) {
    return <Cloud {...iconProps} className="text-neutral-400" />;
  }
  // Fog
  if (code >= 45 && code <= 48) {
    return <CloudFog {...iconProps} className="text-neutral-400" />;
  }
  // Drizzle, rain, freezing rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain {...iconProps} className="text-blue-500" />;
  }
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return <CloudSnow {...iconProps} className="text-blue-300" />;
  }
  // Thunderstorm
  if (code >= 95) {
    return <CloudLightning {...iconProps} className="text-purple-500" />;
  }
  
  return <Cloud {...iconProps} className="text-neutral-400" />;
};

const WeatherCard = ({ className = '', lat: propLat, lon: propLon }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: regions } = useRegions();
  
  // Get user's region with coordinates
  const userRegion = useMemo(() => {
    if (!user?.region_id || !regions?.length) return null;
    return regions.find(r => r.id === user.region_id);
  }, [user?.region_id, regions]);

  // Determine coordinates: props > user's region > default
  const { lat, lon, regionName } = useMemo(() => {
    if (propLat && propLon) {
      return { lat: propLat, lon: propLon, regionName: null };
    }
    if (userRegion?.latitude && userRegion?.longitude) {
      return {
        lat: parseFloat(userRegion.latitude),
        lon: parseFloat(userRegion.longitude),
        regionName: userRegion.name
      };
    }
    return { ...DEFAULT_COORDS, regionName: DEFAULT_COORDS.name };
  }, [propLat, propLon, userRegion]);

  const { data: weather, isLoading, isFetching, refetch, error } = useWeather({ lat, lon });
  
  // Track temperature changes for animation
  const [prevTemp, setPrevTemp] = useState(null);
  const [tempChanged, setTempChanged] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detect temperature changes for animation
  useEffect(() => {
    if (weather?.temperature !== undefined && prevTemp !== null && weather.temperature !== prevTemp) {
      setTempChanged(true);
      const timer = setTimeout(() => setTempChanged(false), 1000);
      return () => clearTimeout(timer);
    }
    if (weather?.temperature !== undefined) {
      setPrevTemp(weather.temperature);
    }
  }, [weather?.temperature, prevTemp]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['weather'] });
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Card className={`${className} bg-white rounded-xl shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title flex items-center gap-2">
          <Cloud size={20} className="text-primary-500" />
          Weather
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isFetching}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors disabled:opacity-50"
          title="Refresh weather"
        >
          <RefreshCw 
            size={16} 
            className={`text-neutral-500 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">Failed to load weather</p>
          <button 
            onClick={handleRefresh}
            className="text-primary-500 text-sm hover:underline mt-2"
          >
            Try again
          </button>
        </div>
      ) : weather ? (
        <div className="text-center">
          {/* Region Name */}
          {regionName && (
            <p className="text-sm text-neutral-500 mb-2 flex items-center justify-center gap-1">
              <MapPin size={14} />
              {regionName}
            </p>
          )}

          {/* Weather Icon */}
          <div className="flex justify-center mb-2">
            {getWeatherIcon(weather.weatherCode, weather.isDay)}
          </div>
          
          {/* Current Temperature */}
          <div 
            className={`text-5xl font-bold text-neutral-800 transition-all duration-300 ${
              tempChanged ? 'weather-temp-updated' : ''
            }`}
          >
            {weather.temperature}°C
          </div>
          
          {/* Weather Description */}
          <p className="text-neutral-600 capitalize mt-1 text-lg">
            {weather.description}
          </p>

          {/* High / Low */}
          <div className="flex items-center justify-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1 text-red-500">
              <ThermometerSun size={16} />
              <span className="font-medium">{weather.highTemp}°</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <ThermometerSnowflake size={16} />
              <span className="font-medium">{weather.lowTemp}°</span>
            </div>
          </div>

          {/* Weather Stats Grid */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                <Droplets size={14} />
                <span>Rain Chance</span>
              </div>
              <p className="font-semibold text-neutral-800">{weather.precipitationChance}%</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                <Wind size={14} />
                <span>Wind</span>
              </div>
              <p className="font-semibold text-neutral-800">{weather.windspeed} km/h</p>
            </div>
          </div>

          <Link 
            to="/weather" 
            className="text-primary-500 text-sm hover:underline mt-4 inline-flex items-center gap-1"
          >
            View Forecast <ArrowRight size={14} />
          </Link>
          
          {/* Auto-refresh indicator */}
          <p className="text-xs text-neutral-400 mt-3">
            Auto-refreshes every 10 min
          </p>
        </div>
      ) : (
        <p className="text-neutral-500 text-center py-8">
          Weather data unavailable
        </p>
      )}
    </Card>
  );
};

export default WeatherCard;
