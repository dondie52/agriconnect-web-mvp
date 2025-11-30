/**
 * Farmer Dashboard for AgriConnect
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  useListingStats, 
  useOrderStats, 
  useFarmerAnalytics,
  useWeather,
  useRelevantRequests 
} from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { StatCard, Card, PageLoading, StatusBadge, EmptyState } from '../components/UI';
import { 
  ShoppingBag, 
  DollarSign, 
  Eye, 
  TrendingUp,
  Cloud,
  Bell,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { data: listingStats, isLoading: loadingListings } = useListingStats();
  const { data: orderStats, isLoading: loadingOrders } = useOrderStats();
  const { data: analytics } = useFarmerAnalytics({ days: 7 });
  const { data: weather } = useWeather();
  const { data: relevantRequests } = useRelevantRequests({ limit: 5 });

  if (loadingListings || loadingOrders) {
    return <Layout><PageLoading /></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Welcome, {user?.name}! 👋</h1>
            <p className="text-neutral-500 mt-1">
              Here's what's happening with your farm today.
            </p>
          </div>
          <Link to="/create-listing" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={20} />
            Create Listing
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Active Listings"
            value={listingStats?.active_listings || 0}
            color="primary"
          />
          <StatCard
            icon={Bell}
            label="Pending Orders"
            value={orderStats?.pending_orders || 0}
            color="warning"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={analytics?.total_views || 0}
            color="info"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`P${(orderStats?.total_revenue || 0).toLocaleString()}`}
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Widget */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2">
                <Cloud size={20} className="text-primary-500" />
                Weather
              </h3>
            </div>
            
            {weather ? (
              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-2">{weather.region}</p>
                <div className="text-5xl font-bold text-neutral-800">
                  {weather.temperature}°C
                </div>
                <p className="text-neutral-600 capitalize mt-2">{weather.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Humidity</p>
                    <p className="font-medium">{weather.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Rain Chance</p>
                    <p className="font-medium">{weather.rain_chance}%</p>
                  </div>
                </div>
                <Link 
                  to="/weather" 
                  className="text-primary-500 text-sm hover:underline mt-4 inline-flex items-center gap-1"
                >
                  View Forecast <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">
                Set your region to see weather
              </p>
            )}
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Recent Orders</h3>
              <Link to="/orders" className="text-primary-500 text-sm hover:underline">
                View All
              </Link>
            </div>
            
            {orderStats?.pending_orders > 0 ? (
              <div className="space-y-3">
                {/* Placeholder for recent orders */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    You have <strong>{orderStats.pending_orders}</strong> pending orders awaiting your response.
                  </p>
                  <Link 
                    to="/orders" 
                    className="text-yellow-700 font-medium hover:underline text-sm mt-2 inline-block"
                  >
                    Review Orders →
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No pending orders"
                description="New orders will appear here when buyers purchase your produce."
              />
            )}
          </Card>
        </div>

        {/* Buyer Requests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Buyer Requests Near You</h3>
            <Link to="/buyer-requests" className="text-primary-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          
          {relevantRequests?.requests?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-sm text-neutral-500 border-b">
                  <tr>
                    <th className="pb-3 font-medium">Crop</th>
                    <th className="pb-3 font-medium">Quantity</th>
                    <th className="pb-3 font-medium">Max Price</th>
                    <th className="pb-3 font-medium">Buyer</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {relevantRequests.requests.map((request) => (
                    <tr key={request.id} className="hover:bg-neutral-50">
                      <td className="py-3 font-medium">{request.crop_name}</td>
                      <td className="py-3">{request.quantity} {request.unit}</td>
                      <td className="py-3">
                        {request.max_price ? `P${request.max_price}` : '-'}
                      </td>
                      <td className="py-3">{request.buyer_name}</td>
                      <td className="py-3">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No buyer requests"
              description="Buyer requests matching your crops will appear here."
            />
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/prices" className="card hover:border-primary-500 border-2 border-transparent">
            <TrendingUp size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Market Prices</h3>
            <p className="text-sm text-neutral-500">Check current crop prices</p>
          </Link>
          
          <Link to="/crop-planner" className="card hover:border-primary-500 border-2 border-transparent">
            <ShoppingBag size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Crop Planner</h3>
            <p className="text-sm text-neutral-500">Plan your seasonal crops</p>
          </Link>
          
          <Link to="/analytics" className="card hover:border-primary-500 border-2 border-transparent">
            <Eye size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-neutral-500">View your performance</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default FarmerDashboard;
