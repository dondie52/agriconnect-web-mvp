/**
 * Custom React Hooks for AgriConnect
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listingsAPI, 
  ordersAPI, 
  pricesAPI, 
  requestsAPI, 
  notificationsAPI,
  weatherAPI,
  cropPlansAPI,
  analyticsAPI,
  referenceAPI,
  adminAPI
} from '../api';

// ==================== REFERENCE DATA HOOKS ====================

export const useCrops = () => {
  return useQuery({
    queryKey: ['crops'],
    queryFn: async () => {
      const response = await referenceAPI.getCrops();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const response = await referenceAPI.getRegions();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ==================== LISTINGS HOOKS ====================

export const useListings = (params) => {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const response = await listingsAPI.getAll(params);
      return response.data.data;
    },
  });
};

export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await listingsAPI.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useMyListings = (params) => {
  return useQuery({
    queryKey: ['myListings', params],
    queryFn: async () => {
      const response = await listingsAPI.getMyListings(params);
      return response.data.data;
    },
  });
};

export const useListingStats = () => {
  return useQuery({
    queryKey: ['listingStats'],
    queryFn: async () => {
      const response = await listingsAPI.getStats();
      return response.data.data;
    },
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => listingsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => listingsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => listingsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
};

// ==================== ORDERS HOOKS ====================

export const useFarmerOrders = (params) => {
  return useQuery({
    queryKey: ['farmerOrders', params],
    queryFn: async () => {
      const response = await ordersAPI.getFarmerOrders(params);
      return response.data.data;
    },
  });
};

export const useBuyerOrders = (params) => {
  return useQuery({
    queryKey: ['buyerOrders', params],
    queryFn: async () => {
      const response = await ordersAPI.getBuyerOrders(params);
      return response.data.data;
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: async () => {
      const response = await ordersAPI.getStats();
      return response.data.data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ordersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => ordersAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
    },
  });
};

// ==================== PRICES HOOKS ====================

export const usePrices = (params) => {
  return useQuery({
    queryKey: ['prices', params],
    queryFn: async () => {
      const response = await pricesAPI.getAll(params);
      return response.data.data;
    },
  });
};

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => pricesAPI.upsert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
    },
  });
};

// ==================== BUYER REQUESTS HOOKS ====================

export const useBuyerRequests = (params) => {
  return useQuery({
    queryKey: ['buyerRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getAll(params);
      return response.data.data;
    },
  });
};

export const useMyRequests = (params) => {
  return useQuery({
    queryKey: ['myRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getMyRequests(params);
      return response.data.data;
    },
  });
};

export const useRelevantRequests = (params) => {
  return useQuery({
    queryKey: ['relevantRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getRelevantForFarmer(params);
      return response.data.data;
    },
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => requestsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
    },
  });
};

// ==================== NOTIFICATIONS HOOKS ====================

export const useNotifications = (params) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationsAPI.getAll(params);
      return response.data.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const response = await notificationsAPI.getUnreadCount();
      return response.data.data.unread_count;
    },
    refetchInterval: 30000,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => notificationsAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

// ==================== WEATHER HOOKS ====================

export const useWeather = (regionId) => {
  return useQuery({
    queryKey: ['weather', regionId],
    queryFn: async () => {
      const response = regionId 
        ? await weatherAPI.getByRegion(regionId)
        : await weatherAPI.getForUser();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useWeatherForecast = (regionId) => {
  return useQuery({
    queryKey: ['forecast', regionId],
    queryFn: async () => {
      const response = await weatherAPI.getForecast(regionId);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ==================== CROP PLANS HOOKS ====================

export const useMyCropPlans = (params) => {
  return useQuery({
    queryKey: ['myCropPlans', params],
    queryFn: async () => {
      const response = await cropPlansAPI.getMyPlans(params);
      return response.data.data;
    },
  });
};

export const useRegionalTrends = (regionId, params) => {
  return useQuery({
    queryKey: ['regionalTrends', regionId, params],
    queryFn: async () => {
      const response = await cropPlansAPI.getRegionalTrends(regionId, params);
      return response.data.data;
    },
    enabled: !!regionId,
  });
};

export const useCreateCropPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => cropPlansAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCropPlans'] });
    },
  });
};

// ==================== ANALYTICS HOOKS ====================

export const useFarmerAnalytics = (params) => {
  return useQuery({
    queryKey: ['farmerAnalytics', params],
    queryFn: async () => {
      const response = await analyticsAPI.getFarmerSummary(params);
      return response.data.data;
    },
  });
};

export const useTopListings = (params) => {
  return useQuery({
    queryKey: ['topListings', params],
    queryFn: async () => {
      const response = await analyticsAPI.getTopListings(params);
      return response.data.data;
    },
  });
};

// ==================== ADMIN HOOKS ====================

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await adminAPI.getDashboard();
      return response.data.data;
    },
  });
};

export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: async () => {
      const response = await adminAPI.getUsers(params);
      return response.data.data;
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => adminAPI.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};
