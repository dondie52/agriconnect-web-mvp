/**
 * Custom React Hooks for AgriConnect
 * Enhanced with real-time refresh options for dashboard stats
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  listingsAPI, 
  ordersAPI, 
  pricesAPI, 
  requestsAPI, 
  notificationsAPI,
  cropPlansAPI,
  analyticsAPI,
  referenceAPI,
  adminAPI,
  dashboardAPI
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
    refetchOnWindowFocus: true,
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
    refetchOnWindowFocus: true,
  });
};

export const useListingStats = () => {
  return useQuery({
    queryKey: ['listingStats'],
    queryFn: async () => {
      const response = await listingsAPI.getStats();
      return response.data.data;
    },
    refetchInterval: 5000, // Fallback refresh every 5s
    refetchOnWindowFocus: true,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => listingsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['listingStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['listingStats'] });
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
      queryClient.invalidateQueries({ queryKey: ['listingStats'] });
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
    refetchOnWindowFocus: true,
  });
};

export const useBuyerOrders = (params) => {
  return useQuery({
    queryKey: ['buyerOrders', params],
    queryFn: async () => {
      const response = await ordersAPI.getBuyerOrders(params);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: async () => {
      const response = await ordersAPI.getStats();
      return response.data.data;
    },
    refetchInterval: 5000, // Fallback refresh every 5s
    refetchOnWindowFocus: true,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ordersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['orderStats'] });
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

// ==================== DASHBOARD STATS HOOK ====================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats();
      return response.data.data;
    },
    refetchInterval: 5000, // Fallback refresh every 5s
    refetchOnWindowFocus: true,
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

export const useBuyerRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['buyerRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getAll(params);
      return response.data.data;
    },
    enabled: options.enabled !== false,
    refetchOnWindowFocus: true,
  });
};

export const useMyRequests = (params) => {
  return useQuery({
    queryKey: ['myRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getMyRequests(params);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useRelevantRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['relevantRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getRelevantForFarmer(params);
      return response.data.data;
    },
    enabled: options.enabled !== false,
    refetchInterval: 5000, // Refresh every 5s for real-time feel
    refetchOnWindowFocus: true,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => requestsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['relevantRequests'] });
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
    refetchOnWindowFocus: true,
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
    refetchOnWindowFocus: true,
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
    refetchInterval: 5000, // Refresh every 5s for real-time dashboard
    refetchOnWindowFocus: true,
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
    refetchInterval: 5000, // Refresh every 5s for real-time dashboard
    refetchOnWindowFocus: true,
  });
};

export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: async () => {
      const response = await adminAPI.getUsers(params);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => adminAPI.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};
