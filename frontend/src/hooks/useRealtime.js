/**
 * Real-time Subscription Hooks for AgriConnect
 * Handles Supabase Realtime subscriptions for live dashboard updates
 */
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Subscribe to a Supabase table for real-time changes
 * @param {string} table - Table name to subscribe to
 * @param {function} callback - Callback function when changes occur
 * @returns {object|null} - Supabase channel or null if not available
 */
export function subscribeTable(table, callback) {
  if (!supabase) {
    console.warn(`Cannot subscribe to ${table}: Supabase not configured`);
    return null;
  }

  return supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}

/**
 * Hook to subscribe to multiple tables and invalidate React Query cache
 * @param {Array<{table: string, queryKeys: string[]}>} subscriptions - Array of table/queryKey mappings
 * @param {function} onUpdate - Optional callback when any update occurs
 */
export function useRealtimeSubscriptions(subscriptions, onUpdate) {
  const queryClient = useQueryClient();
  const channelsRef = useRef([]);
  const onUpdateRef = useRef(onUpdate);

  // Keep the callback ref updated without triggering effect re-runs
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Stringify subscriptions for stable dependency
  const subscriptionsKey = JSON.stringify(subscriptions);

  useEffect(() => {
    if (!supabase) return;

    const parsedSubscriptions = JSON.parse(subscriptionsKey);

    // Subscribe to each table
    channelsRef.current = parsedSubscriptions.map(({ table, queryKeys }) => {
      return subscribeTable(table, (payload) => {
        // Invalidate all related query keys
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });

        // Call optional update callback
        if (onUpdateRef.current) {
          onUpdateRef.current({ table, payload });
        }
      });
    });

    // Cleanup subscriptions on unmount
    return () => {
      channelsRef.current.forEach((channel) => {
        if (channel && supabase) {
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = [];
    };
  }, [queryClient, subscriptionsKey]);
}

/**
 * Hook for farmer dashboard real-time updates
 * @param {function} onUpdate - Callback when updates occur (for UI feedback)
 */
export function useFarmerDashboardRealtime(onUpdate) {
  const subscriptions = [
    {
      table: 'listings',
      queryKeys: ['listings', 'myListings', 'listingStats']
    },
    {
      table: 'orders',
      queryKeys: ['farmerOrders', 'orderStats', 'buyerOrders']
    },
    {
      table: 'buyer_requests',
      queryKeys: ['buyerRequests', 'relevantRequests', 'myRequests']
    }
  ];

  useRealtimeSubscriptions(subscriptions, onUpdate);
}

/**
 * Hook for admin dashboard real-time updates
 * @param {function} onUpdate - Callback when updates occur (for UI feedback)
 */
export function useAdminDashboardRealtime(onUpdate) {
  const subscriptions = [
    {
      table: 'users',
      queryKeys: ['adminUsers', 'adminDashboard']
    },
    {
      table: 'listings',
      queryKeys: ['listings', 'adminDashboard']
    },
    {
      table: 'orders',
      queryKeys: ['farmerOrders', 'buyerOrders', 'orderStats', 'adminDashboard']
    }
  ];

  useRealtimeSubscriptions(subscriptions, onUpdate);
}

/**
 * Remove a Supabase channel subscription
 * @param {object} channel - Supabase channel to remove
 */
export function removeChannel(channel) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}

export default {
  subscribeTable,
  useRealtimeSubscriptions,
  useFarmerDashboardRealtime,
  useAdminDashboardRealtime,
  removeChannel
};

