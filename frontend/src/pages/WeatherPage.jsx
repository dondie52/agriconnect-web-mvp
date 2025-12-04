/**
 * Weather Page for AgriConnect
 * Uses Open-Meteo API for real-time weather data
 * Dynamically loads all regions from the database
 * Features AI-powered farming tips
 */
import React, { useEffect } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useAiTips, useRefreshAiTips } from '../hooks/useAiTips';
import { useRegions } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, PageLoading } from '../components/UI';
import AiTipsCard from '../components/weather/AiTipsCard';
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  ThermometerSun,
  ThermometerSnowflake,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Get weather icon component based on weather code
 */
const getWeatherIcon = (code, size = 24) => {
  const iconProps = { size, strokeWidth: 1.5 };
  
  if (code <= 1) return <Sun {...iconProps} className="text-yellow-500" />;
  if (code <= 3) return <Cloud {...iconProps} className="text-neutral-400" />;
  if (code >= 45 && code <= 48) return <CloudFog {...iconProps} className="text-neutral-400" />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain {...iconProps} className="text-blue-500" />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <CloudSnow {...iconProps} className="text-blue-300" />;
  if (code >= 95) return <CloudLightning {...iconProps} className="text-purple-500" />;
  
  return <Cloud {...iconProps} className="text-neutral-400" />;
};

/**
 * Get weather emoji based on weather code and day/night
 */
const getWeatherEmoji = (code, isDay = true) => {
  // Clear or mainly clear
  if (code <= 1) return isDay ? '☀️' : '🌙';
  // Partly cloudy
  if (code <= 3) return isDay ? '⛅' : '☁️';
  // Fog
  if (code >= 45 && code <= 48) return '🌫️';
  // Rain/Drizzle
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '❄️';
  // Thunderstorm
  if (code >= 95) return '⛈️';
  // Default
  return isDay ? '🌤️' : '🌙';
};

// Default coordinates (Gaborone) as fallback
const DEFAULT_COORDS = { latitude: -24.6282, longitude: 25.9231 };

const WeatherPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: regions, isLoading: loadingRegions } = useRegions();
  
  const [selectedRegionId, setSelectedRegionId] = React.useState(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Get selected region object with coordinates
  const selectedRegion = React.useMemo(() => {
    if (!regions?.length) return null;
    const region = regions.find(r => r.id === selectedRegionId);
    return region || regions[0];
  }, [regions, selectedRegionId]);

  // Set initial region based on user's region or first available
  useEffect(() => {
    if (regions?.length && !selectedRegionId) {
      // Try to use user's region first, otherwise use first region
      const userRegionId = user?.region_id;
      if (userRegionId && regions.find(r => r.id === userRegionId)) {
        setSelectedRegionId(userRegionId);
      } else {
        setSelectedRegionId(regions[0].id);
      }
    }
  }, [regions, user?.region_id, selectedRegionId]);

  // Get coordinates for weather API
  const coords = React.useMemo(() => {
    if (selectedRegion?.latitude && selectedRegion?.longitude) {
      return {
        lat: parseFloat(selectedRegion.latitude),
        lon: parseFloat(selectedRegion.longitude)
      };
    }
    return { lat: DEFAULT_COORDS.latitude, lon: DEFAULT_COORDS.longitude };
  }, [selectedRegion]);

  const { data: weather, isLoading: loadingWeather, isFetching, refetch } = useWeather({
    lat: coords.lat,
    lon: coords.lon,
    enabled: !!selectedRegion
  });

  // AI Tips query - automatically fetches and caches based on weather/location
  const { 
    data: aiTipsData, 
    isLoading: aiTipsLoading,
    isFetching: aiTipsFetching,
    isError: aiTipsError
  } = useAiTips({
    weather: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      windspeed: weather.windspeed,
      precipitationChance: weather.precipitationChance
    } : null,
    forecast: weather?.dailyForecast,
    location: selectedRegion?.name,
    enabled: !!weather && !!selectedRegion
  });

  // Refresh AI tips handler
  const refreshAiTips = useRefreshAiTips();
  const handleRefreshTips = () => refreshAiTips();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['weather'] });
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleRegionChange = (e) => {
    setSelectedRegionId(parseInt(e.target.value));
  };

  const isLoading = loadingRegions || (loadingWeather && !weather);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Weather Forecast</h1>
            <p className="text-neutral-500 mt-1">
              Plan your farming activities based on weather conditions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={selectedRegionId || ''}
                onChange={handleRegionChange}
                className="select-field md:w-64 pl-9"
                disabled={loadingRegions}
              >
                {loadingRegions ? (
                  <option>Loading regions...</option>
                ) : (
                  regions?.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isFetching}
              className="p-3 rounded-lg bg-white shadow-sm hover:bg-neutral-50 transition-colors disabled:opacity-50"
              title="Refresh weather"
            >
              <RefreshCw 
                size={20} 
                className={`text-neutral-500 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
        </div>

        {isLoading ? (
          <PageLoading />
        ) : weather && selectedRegion ? (
          <>
            {/* Current Weather */}
            <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-primary-100">{selectedRegion.name}, Botswana</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-6xl">{getWeatherEmoji(weather.weatherCode, weather.isDay)}</span>
                    <div>
                      <p className="text-5xl font-bold">{weather.temperature}°C</p>
                      <p className="capitalize text-primary-100">{weather.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-center gap-1 mb-2">
                      <ThermometerSun size={20} className="text-red-300" />
                      <ThermometerSnowflake size={20} className="text-blue-300" />
                    </div>
                    <p className="text-sm text-primary-100">High / Low</p>
                    <p className="font-bold">{weather.highTemp}° / {weather.lowTemp}°</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Droplets size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Rain Chance</p>
                    <p className="font-bold">{weather.precipitationChance}%</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Wind size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Wind Speed</p>
                    <p className="font-bold">{weather.windspeed} km/h</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Cloud size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Conditions</p>
                    <p className="font-bold text-sm">{weather.isDay ? 'Daytime' : 'Nighttime'}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-primary-200 mt-4">
                Data from Open-Meteo • Auto-refreshes every 10 min
              </p>
            </Card>

            {/* 7-Day Forecast */}
            <Card>
              <h3 className="section-title mb-4">7-Day Forecast</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                {weather.dailyForecast?.slice(0, 7).map((day, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg p-4 text-center ${
                      index === 0 ? 'bg-primary-50 border-2 border-primary-200' : 'bg-neutral-50'
                    }`}
                  >
                    <p className="text-sm text-neutral-500 font-medium">
                      {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="my-2 flex justify-center">
                      {getWeatherIcon(day.weatherCode, 32)}
                    </div>
                    <p className="font-bold text-neutral-800">{day.highTemp}°</p>
                    <p className="text-neutral-400 text-sm">{day.lowTemp}°</p>
                    {day.precipitationChance > 0 && (
                      <div className="flex items-center justify-center gap-1 text-blue-500 text-xs mt-1">
                        <Droplets size={12} />
                        <span>{day.precipitationChance}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Farming Tips */}
            <AiTipsCard
              tips={aiTipsData?.tips || []}
              isLoading={aiTipsLoading || aiTipsFetching}
              isError={aiTipsError}
              source={aiTipsData?.source}
              onRetry={handleRefreshTips}
            />
          </>
        ) : (
          <Card className="text-center py-12">
            <Cloud size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">
              {!regions?.length 
                ? "No regions available. Please contact an administrator."
                : "Unable to load weather data. Please try again."
              }
            </p>
            <button 
              onClick={handleRefresh}
              className="btn-primary mt-4"
            >
              Retry
            </button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default WeatherPage;
