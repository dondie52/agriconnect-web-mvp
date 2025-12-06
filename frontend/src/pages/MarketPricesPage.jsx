/**
 * Market Prices Page for AgriConnect
 * Real-time auto-updating market prices with live data
 * Supports both polling (15s) and WebSocket for instant updates
 */
import React, { useState } from 'react';
import { useCrops, useRegions } from '../hooks/useApi';
import { useRealtimePrices, ConnectionState } from '../hooks/useRealtimePrices';
import { Layout } from '../components/Layout';
import { Select, Card, PageLoading, EmptyState } from '../components/UI';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Clock, Wifi, WifiOff, Zap } from 'lucide-react';

const MarketPricesPage = () => {
  const [filters, setFilters] = useState({
    crop: '',
    region: '',
  });

  // Use real-time prices hook with polling + WebSocket
  const { 
    prices,
    isLoading, 
    isFetching,
    error,
    lastSync,
    isCached,
    wsState,
    isWebSocketConnected,
    isOffline,
    countdown,
    refetch 
  } = useRealtimePrices(filters, {
    enableWebSocket: true,
    pollingInterval: 15000 // 15 seconds
  });
  
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();

  const cropOptions = crops?.map(c => ({ value: c.name, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.name, label: r.name })) || [];

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  // Group prices by crop category
  const groupedPrices = prices.reduce((acc, price) => {
    const category = price.crop_category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(price);
    return acc;
  }, {});

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header with Live Status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">Market Prices</h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
              {/* Connection Status Indicator */}
              {isOffline ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full" title="You are offline">
                  <WifiOff size={12} />
                  OFFLINE
                </span>
              ) : isWebSocketConnected ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full" title="Real-time updates via WebSocket">
                  <Zap size={12} />
                  STREAMING
                </span>
              ) : wsState === ConnectionState.RECONNECTING ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  <RefreshCw size={12} className="animate-spin" />
                  RECONNECTING
                </span>
              ) : null}
            </div>
            <p className="text-neutral-500 mt-1">
              Real-time market prices for crops across Botswana
            </p>
          </div>
          
          {/* Refresh Controls */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <Clock size={16} />
              <span>Auto-refresh in {countdown}s</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Sync Status Bar */}
        <Card className="bg-neutral-50 border border-neutral-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <WifiOff size={16} className="text-gray-500" />
                ) : isCached ? (
                  <WifiOff size={16} className="text-amber-500" />
                ) : isWebSocketConnected ? (
                  <Zap size={16} className="text-blue-500" />
                ) : (
                  <Wifi size={16} className="text-green-500" />
                )}
                <span className="text-neutral-600">
                  {isOffline ? 'Offline - using cached data' : isCached ? 'Cached data' : isWebSocketConnected ? 'Streaming live' : 'Polling (15s)'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <Clock size={14} />
                <span>Last sync: {formatRelativeTime(lastSync)}</span>
              </div>
            </div>
            <div className="text-neutral-500">
              Showing {prices.length} prices
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="flex flex-col md:flex-row gap-4">
          <Select
            label="Filter by Crop"
            value={filters.crop}
            onChange={(e) => setFilters(prev => ({ ...prev, crop: e.target.value }))}
            options={cropOptions}
            placeholder="All Crops"
            className="md:w-64"
          />
          <Select
            label="Filter by Region"
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            options={regionOptions}
            placeholder="All Regions"
            className="md:w-64"
          />
          {(filters.crop || filters.region) && (
            <button
              onClick={() => setFilters({ crop: '', region: '' })}
              className="self-end px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Clear filters
            </button>
          )}
        </Card>

        {/* Price Legend */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            <span>Price Increased</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={18} className="text-red-500" />
            <span>Price Decreased</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus size={18} className="text-neutral-400" />
            <span>No Change</span>
          </div>
        </div>

        {/* Prices Table */}
        {isLoading ? (
          <PageLoading />
        ) : prices.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No prices available"
            description="Market prices will be synced automatically. Check back soon!"
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPrices).map(([category, categoryPrices]) => (
              <Card key={category} className={isFetching ? 'opacity-70 transition-opacity' : ''}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">{category}</h3>
                  <span className="text-sm text-neutral-400">
                    {categoryPrices.length} {categoryPrices.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left text-sm text-neutral-500 border-b">
                      <tr>
                        <th className="pb-3 font-medium">Crop</th>
                        <th className="pb-3 font-medium">Region</th>
                        <th className="pb-3 font-medium text-right">Price</th>
                        <th className="pb-3 font-medium text-right">Change</th>
                        <th className="pb-3 font-medium text-right">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categoryPrices.map((price, idx) => {
                        // Parse change percentage for styling
                        const changeStr = price.change || '0%';
                        const changeNum = parseFloat(changeStr.replace('%', '').replace('+', ''));
                        const isPositive = changeNum > 0;
                        const isNegative = changeNum < 0;
                        
                        return (
                          <tr key={`${price.crop}-${price.region}-${idx}`} className="hover:bg-neutral-50 transition-colors">
                            <td className="py-3 font-medium">{price.crop}</td>
                            <td className="py-3 text-neutral-600">{price.region}</td>
                            <td className="py-3 text-right">
                              <span className="font-semibold text-primary-600">
                                P{typeof price.price === 'number' ? price.price.toFixed(2) : price.price}
                              </span>
                              <span className="text-neutral-400 text-sm">/{price.unit || 'kg'}</span>
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${
                                isPositive 
                                  ? 'bg-green-100 text-green-700' 
                                  : isNegative 
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {isPositive && <TrendingUp size={14} />}
                                {isNegative && <TrendingDown size={14} />}
                                {!isPositive && !isNegative && <Minus size={14} />}
                                {changeStr}
                              </span>
                            </td>
                            <td className="py-3 text-right text-sm text-neutral-500">
                              {price.updated_at 
                                ? new Date(price.updated_at).toLocaleDateString()
                                : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <WifiOff size={18} />
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </Card>
        )}

        {/* Info Note */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-2">
            💡 Using Market Prices
          </h4>
          <p className="text-primary-700 text-sm">
            These prices are updated automatically every 3 hours from market data sources. 
            The page auto-refreshes every 15 seconds to show you the latest prices.
            {isWebSocketConnected && ' Real-time streaming is active for instant updates.'}
            {' '}Prices may vary based on quality, quantity, and direct negotiations with buyers.
          </p>
        </Card>

        {/* Price Alert Info */}
        <Card className="bg-amber-50 border border-amber-100">
          <h4 className="font-semibold text-amber-800 mb-2">
            🔔 Price Alerts
          </h4>
          <p className="text-amber-700 text-sm">
            You'll receive notifications when prices change significantly (+/-10%). 
            Check your notifications regularly for market opportunities!
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketPricesPage;
