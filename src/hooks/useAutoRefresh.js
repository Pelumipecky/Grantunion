import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for auto-refreshing data at intervals
 * @param {Function} fetchFunction - Async function to fetch data
 * @param {number} interval - Refresh interval in milliseconds (default: 30000ms = 30s)
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 * @returns {Object} { isRefreshing, lastRefreshed, manualRefresh }
 */
export const useAutoRefresh = (fetchFunction, interval = 30000, dependencies = [], enabled = true) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const manualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchFunction();
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Auto-refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (!enabled) return;

    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      manualRefresh();
    }, interval);

    // Cleanup on unmount or dependency change
    return () => clearInterval(refreshInterval);
  }, [interval, enabled, manualRefresh, ...dependencies]);

  return {
    isRefreshing,
    lastRefreshed,
    manualRefresh
  };
};

/**
 * Custom hook for managing table refresh state
 * @param {string} tableName - Name of the table for UI display
 * @returns {Object} { isAutoRefreshEnabled, toggleAutoRefresh, refreshInterval, setRefreshInterval }
 */
export const useTableRefreshState = (tableName = 'Table') => {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  return {
    isAutoRefreshEnabled,
    toggleAutoRefresh: () => setIsAutoRefreshEnabled(prev => !prev),
    refreshInterval,
    setRefreshInterval: (newInterval) => {
      if (newInterval >= 5000) { // Minimum 5 seconds
        setRefreshInterval(newInterval);
      }
    }
  };
};
