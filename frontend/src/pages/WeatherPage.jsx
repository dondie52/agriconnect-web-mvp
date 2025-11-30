/**
 * Weather Page for AgriConnect
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeather, useWeatherForecast, useRegions } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, Select } from '../components/UI';
import { Cloud, Droplets, Wind, Sun, Thermometer } from 'lucide-react';

const WeatherPage = () => {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = React.useState(user?.region_id || '');
  
  const { data: regions } = useRegions();
  const { data: weather, isLoading: loadingWeather } = useWeather(selectedRegion || undefined);
  const { data: forecastData, isLoading: loadingForecast } = useWeatherForecast(selectedRegion || undefined);

  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];
  const forecast = forecastData?.forecast || [];

  const getWeatherIcon = (description) => {
    if (description?.includes('rain')) return '🌧️';
    if (description?.includes('cloud')) return '☁️';
    if (description?.includes('sun') || description?.includes('clear')) return '☀️';
    return '🌤️';
  };

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
          
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            options={regionOptions}
            placeholder="Select region"
            className="md:w-64"
          />
        </div>

        {loadingWeather ? (
          <PageLoading />
        ) : weather ? (
          <>
            {/* Current Weather */}
            <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-primary-100">{weather.region}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-6xl">{getWeatherIcon(weather.description)}</span>
                    <div>
                      <p className="text-5xl font-bold">{weather.temperature}°C</p>
                      <p className="capitalize text-primary-100">{weather.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Thermometer size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Feels Like</p>
                    <p className="font-bold">{weather.feels_like}°C</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Droplets size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Humidity</p>
                    <p className="font-bold">{weather.humidity}%</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Wind size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Wind</p>
                    <p className="font-bold">{weather.wind_speed} m/s</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Cloud size={24} className="mx-auto mb-2" />
                    <p className="text-sm text-primary-100">Rain Chance</p>
                    <p className="font-bold">{weather.rain_chance}%</p>
                  </div>
                </div>
              </div>
              
              {weather.is_mock && (
                <p className="text-xs text-primary-200 mt-4">
                  * Demo data. Connect OpenWeather API for real weather.
                </p>
              )}
            </Card>

            {/* 7-Day Forecast */}
            <Card>
              <h3 className="section-title mb-4">7-Day Forecast</h3>
              
              {loadingForecast ? (
                <div className="flex justify-center py-8">
                  <div className="spinner" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                  {forecast.map((day, index) => (
                    <div 
                      key={index}
                      className="bg-neutral-50 rounded-lg p-4 text-center"
                    >
                      <p className="text-sm text-neutral-500 font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <span className="text-3xl my-2 block">
                        {getWeatherIcon(day.description)}
                      </span>
                      <p className="font-bold">{day.temp_max}°</p>
                      <p className="text-neutral-400 text-sm">{day.temp_min}°</p>
                      {day.rain_mm > 0 && (
                        <p className="text-blue-500 text-xs mt-1">
                          {day.rain_mm}mm
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Farming Tips */}
            <Card className="bg-yellow-50 border border-yellow-200">
              <h3 className="section-title text-yellow-800 mb-3">
                🌾 Farming Tips Based on Weather
              </h3>
              <ul className="space-y-2 text-yellow-700 text-sm">
                {weather.temperature > 30 && (
                  <li>• High temperatures expected - consider irrigating early morning or late evening</li>
                )}
                {weather.humidity < 40 && (
                  <li>• Low humidity - monitor soil moisture levels closely</li>
                )}
                {weather.rain_chance > 50 && (
                  <li>• Rain expected - good time for planting, delay pesticide application</li>
                )}
                {weather.wind_speed > 5 && (
                  <li>• Moderate winds - secure any loose materials and coverings</li>
                )}
                {weather.temperature < 15 && (
                  <li>• Cool temperatures - protect frost-sensitive crops</li>
                )}
                <li>• Always check the forecast before planning field work</li>
              </ul>
            </Card>
          </>
        ) : (
          <Card className="text-center py-12">
            <Cloud size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">
              Select a region to view weather information
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default WeatherPage;
