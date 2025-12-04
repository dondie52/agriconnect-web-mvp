/**
 * Weather Hook for AgriConnect
 * Uses React Query with Open-Meteo API
 * Auto-refreshes every 10 minutes
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWeather } from '../services/weatherService';

// Default coordinates: Gaborone, Botswana
const DEFAULT_LAT = -24.65;
const DEFAULT_LON = 25.90;

// Refresh interval: 10 minutes
const REFRESH_INTERVAL = 1000 * 60 * 10;

/**
 * Hook to fetch weather data with auto-refresh
 * @param {Object} options
 * @param {number} options.lat - Latitude (defaults to Gaborone)
 * @param {number} options.lon - Longitude (defaults to Gaborone)
 * @param {boolean} options.enabled - Whether to enable the query
 * @returns {Object} React Query result with weather data
 */
export const useWeather = ({ lat = DEFAULT_LAT, lon = DEFAULT_LON, enabled = true } = {}) => {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather(lat, lon),
    enabled,
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    retry: 2,
  });
};

/**
 * Hook to manually refresh weather data
 * @returns {Function} Refresh function
 */
export const useRefreshWeather = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['weather'] });
  };
};

export default useWeather;


