/**
 * Real-Time Prices Hook for AgriConnect
 * Combines polling (15s interval) with optional WebSocket for live updates
 * Provides graceful fallback when WebSocket is unavailable
 * Includes offline detection to pause/resume requests
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { pricesAPI, WS_URL } from '../api';

// Connection states
export const ConnectionState = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  OFFLINE: 'offline'
};

/**
 * Hook for real-time market prices with polling and WebSocket support
 * @param {Object} filters - Optional filters { crop, region }
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableWebSocket - Enable WebSocket connection (default: true)
 * @param {number} options.pollingInterval - Polling interval in ms (default: 15000)
 * @param {number} options.reconnectDelay - WebSocket reconnect delay in ms (default: 3000)
 * @param {number} options.maxReconnectAttempts - Max reconnect attempts (default: 5)
 */
export const useRealtimePrices = (filters = {}, options = {}) => {
  const {
    enableWebSocket = true,
    pollingInterval = 15000,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5
  } = options;

  const [prices, setPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [wsState, setWsState] = useState(ConnectionState.DISCONNECTED);
  const [countdown, setCountdown] = useState(pollingInterval / 1000);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch prices from API (respects offline status)
  const fetchPrices = useCallback(async (showFetching = true) => {
    // Don't fetch if offline
    if (!navigator.onLine) {
      console.log('📴 Offline - skipping price fetch');
      return null;
    }
    
    try {
      if (showFetching) setIsFetching(true);
      
      const response = await pricesAPI.getLatest(filters);
      const data = response.data;
      
      setPrices(data.data || []);
      setLastSync(data.lastSync);
      setIsCached(data.cached || false);
      setError(null);
      setIsLoading(false);
      
      // Reset countdown
      setCountdown(pollingInterval / 1000);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['latestPrices'] });
      
      return data;
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError(err.message || 'Failed to fetch prices');
      setIsLoading(false);
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [filters, pollingInterval, queryClient]);

  // Manual refresh
  const refetch = useCallback(() => {
    return fetchPrices(true);
  }, [fetchPrices]);

  // Connect to WebSocket (respects offline status)
  const connectWebSocket = useCallback(() => {
    // Don't connect if offline
    if (!navigator.onLine) {
      console.log('📴 Offline - skipping WebSocket connection');
      setWsState(ConnectionState.OFFLINE);
      return;
    }
    
    if (!enableWebSocket || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setWsState(ConnectionState.CONNECTING);

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔌 WebSocket connected to live prices');
        setWsState(ConnectionState.CONNECTED);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'price_update') {
            console.log('📊 Received live price update');
            
            // Update prices from WebSocket data
            if (message.data?.prices) {
              setPrices(message.data.prices);
              setLastSync(message.timestamp);
              setIsCached(false);
              setCountdown(pollingInterval / 1000);
              
              // Invalidate queries to sync with React Query
              queryClient.invalidateQueries({ queryKey: ['latestPrices'] });
            }
          } else if (message.type === 'connected') {
            console.log('✅ WebSocket handshake complete');
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', event.code, event.reason);
        setWsState(ConnectionState.DISCONNECTED);
        wsRef.current = null;

        // Attempt reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          setWsState(ConnectionState.RECONNECTING);
          reconnectAttemptsRef.current++;
          
          const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setWsState(ConnectionState.DISCONNECTED);
    }
  }, [enableWebSocket, maxReconnectAttempts, pollingInterval, reconnectDelay, queryClient]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounted');
      wsRef.current = null;
    }
    
    setWsState(ConnectionState.DISCONNECTED);
  }, []);

  // Initial fetch and setup polling
  useEffect(() => {
    // Initial fetch
    fetchPrices(false);

    // Setup polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchPrices(true);
    }, pollingInterval);

    // Setup countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [fetchPrices, pollingInterval]);

  // Setup WebSocket connection
  useEffect(() => {
    if (enableWebSocket) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [enableWebSocket, connectWebSocket, disconnectWebSocket]);

  // Refetch when filters change
  useEffect(() => {
    fetchPrices(true);
  }, [filters.crop, filters.region]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Back online - resuming connections');
      setIsOnline(true);
      setError(null);
      // Resume polling and WebSocket
      fetchPrices(true);
      if (enableWebSocket) {
        connectWebSocket();
      }
    };
    
    const handleOffline = () => {
      console.log('📴 Gone offline - pausing connections');
      setIsOnline(false);
      setWsState(ConnectionState.OFFLINE);
      setError('You are offline. Data will refresh when connection is restored.');
      // Disconnect WebSocket gracefully
      if (wsRef.current) {
        wsRef.current.close(1000, 'User went offline');
        wsRef.current = null;
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableWebSocket, fetchPrices, connectWebSocket]);

  return {
    // Data
    prices,
    isLoading,
    isFetching,
    error,
    lastSync,
    isCached,
    
    // Network state
    isOnline,
    
    // WebSocket state
    wsState,
    isWebSocketConnected: wsState === ConnectionState.CONNECTED,
    isOffline: wsState === ConnectionState.OFFLINE || !isOnline,
    
    // Polling state
    countdown,
    pollingInterval: pollingInterval / 1000,
    
    // Actions
    refetch,
    connectWebSocket,
    disconnectWebSocket
  };
};

export default useRealtimePrices;
