/**
 * Analytics Page for AgriConnect (Farmer)
 */
import React, { useState } from 'react';
import { useFarmerAnalytics, useTopListings, useListingStats, useOrderStats } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, StatCard, PageLoading, Select, EmptyState } from '../components/UI';
import { Eye, MousePointer, ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnalyticsPage = () => {
  const [days, setDays] = useState(7);
  
  const { data: analytics, isLoading } = useFarmerAnalytics({ days });
  const { data: topListings } = useTopListings({ limit: 5 });
  const { data: listingStats } = useListingStats();
  const { data: orderStats } = useOrderStats();

  const daysOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 14, label: 'Last 14 Days' },
    { value: 30, label: 'Last 30 Days' },
  ];

  // Format analytics data for charts
  const chartData = analytics || { total_views: 0, total_contacts: 0, total_orders: 0, unique_visitors: 0 };

  if (isLoading) {
    return <Layout><PageLoading /></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="text-neutral-500 mt-1">
              Track your listing performance and buyer engagement
            </p>
          </div>
          
          <Select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            options={daysOptions}
            className="md:w-48"
          />
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Eye}
            label="Total Views"
            value={chartData.total_views || 0}
            color="primary"
          />
          <StatCard
            icon={MousePointer}
            label="Contact Clicks"
            value={chartData.total_contacts || 0}
            color="secondary"
          />
          <StatCard
            icon={ShoppingCart}
            label="Orders Placed"
            value={chartData.total_orders || 0}
            color="success"
          />
          <StatCard
            icon={TrendingUp}
            label="Unique Visitors"
            value={chartData.unique_visitors || 0}
            color="info"
          />
        </div>

        {/* Conversion Funnel */}
        <Card>
          <h3 className="section-title mb-4">Conversion Funnel</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl font-bold text-primary-600">{chartData.total_views || 0}</span>
              </div>
              <p className="text-neutral-600">Views</p>
            </div>
            <div className="text-4xl text-neutral-300">→</div>
            <div className="text-center">
              <div className="w-28 h-28 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-secondary-600">{chartData.total_contacts || 0}</span>
              </div>
              <p className="text-neutral-600">Contacts</p>
            </div>
            <div className="text-4xl text-neutral-300">→</div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-green-600">{chartData.total_orders || 0}</span>
              </div>
              <p className="text-neutral-600">Orders</p>
            </div>
          </div>
          
          {chartData.total_views > 0 && (
            <div className="flex justify-center gap-8 text-sm text-neutral-500 border-t pt-4">
              <span>
                Contact Rate: <strong>{((chartData.total_contacts / chartData.total_views) * 100 || 0).toFixed(1)}%</strong>
              </span>
              <span>
                Order Rate: <strong>{((chartData.total_orders / chartData.total_views) * 100 || 0).toFixed(1)}%</strong>
              </span>
            </div>
          )}
        </Card>

        {/* Top Performing Listings */}
        <Card>
          <h3 className="section-title flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-primary-500" />
            Top Performing Listings
          </h3>
          
          {topListings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-sm text-neutral-500 border-b">
                  <tr>
                    <th className="pb-3 font-medium">Listing</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">Contacts</th>
                    <th className="pb-3 font-medium text-right">Orders</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topListings.map((listing, index) => (
                    <tr key={listing.id} className="hover:bg-neutral-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{listing.crop_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">{listing.views || 0}</td>
                      <td className="py-3 text-right">{listing.contacts || 0}</td>
                      <td className="py-3 text-right">{listing.orders || 0}</td>
                      <td className="py-3 text-right text-primary-600 font-medium">
                        P{listing.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No data yet"
              description="Create listings to start tracking performance"
            />
          )}
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="section-title mb-4">Listing Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Active Listings</span>
                <span className="font-bold text-lg">{listingStats?.active_listings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Sold Listings</span>
                <span className="font-bold text-lg">{listingStats?.sold_listings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Total Views</span>
                <span className="font-bold text-lg">{listingStats?.total_views || 0}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Pending Orders</span>
                <span className="font-bold text-lg text-yellow-600">{orderStats?.pending_orders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Completed Orders</span>
                <span className="font-bold text-lg text-green-600">{orderStats?.completed_orders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Total Revenue</span>
                <span className="font-bold text-lg text-primary-600">
                  P{(orderStats?.total_revenue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tips */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-3">
            📈 Tips to Improve Performance
          </h4>
          <ul className="space-y-2 text-primary-700 text-sm">
            <li>• Add high-quality photos to your listings</li>
            <li>• Write detailed descriptions about produce quality</li>
            <li>• Keep prices competitive - check market prices</li>
            <li>• Respond quickly to buyer inquiries</li>
            <li>• Update listings regularly to stay visible</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
