/**
 * AI Tips Hook for AgriConnect
 * React Query hook for fetching AI-powered farming tips with caching
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '../api';

/**
 * Hook to fetch AI-powered farming tips with smart caching
 * @param {Object} options
 * @param {Object} options.weather - Current weather data
 * @param {Array} options.forecast - 7-day forecast array
 * @param {string} options.location - Region/location name
 * @param {string} options.cropType - Optional crop type
 * @param {boolean} options.enabled - Whether to enable the query
 * @returns {Object} React Query result with data, isLoading, error, refetch
 */
export const useAiTips = ({ weather, forecast, location, cropType, enabled = true } = {}) => {
  // Create a stable key based on location and weather summary
  // Only refetch when location changes or weather significantly changes
  const weatherKey = weather ? `${weather.temperature}-${weather.precipitationChance}-${Math.round(weather.windspeed / 5) * 5}` : null;
  
  return useQuery({
    queryKey: ['ai-tips', location, weatherKey],
    queryFn: async () => {
      const response = await aiAPI.getFarmingTips({
        weather,
        forecast,
        location,
        cropType
      });
      return response.data;
    },
    enabled: enabled && !!weather && !!location,
    staleTime: 1000 * 60 * 15, // Consider fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1,
  });
};

/**
 * Hook to manually refresh AI tips
 */
export const useRefreshAiTips = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['ai-tips'] });
  };
};

export default useAiTips;
