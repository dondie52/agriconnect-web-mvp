/**
 * My Orders Page for AgriConnect
 * Shows orders placed by buyers
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerOrders } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, EmptyState, Badge } from '../components/UI';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-neutral-100 text-neutral-700', icon: XCircle },
};

const MyOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: ordersData, isLoading, error, refetch } = useBuyerOrders({ status: statusFilter || undefined });

  const orders = ordersData?.orders || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="text-neutral-500 mt-1">
              Track your orders from farmers
            </p>
          </div>
          <Link
            to="/listings"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <ShoppingBag size={18} />
            Browse Listings
          </Link>
        </div>

        {/* Filters */}
        <Card className="flex flex-wrap gap-2">
          {['', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status ? statusConfig[status]?.label : 'All Orders'}
            </button>
          ))}
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <PageLoading />
        ) : error ? (
          <EmptyState
            icon={Package}
            title="Error loading orders"
            description={error?.message || "Failed to load your orders. Please try again."}
            action={
              <button 
                onClick={() => refetch()} 
                className="btn-primary"
              >
                Retry
              </button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Browse listings and place your first order!"
            action={
              <Link to="/listings" className="btn-primary">
                Browse Listings
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              if (!order || !order.id) return null;

              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-neutral-800">
                          {order.crop_name || 'Unknown Crop'}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Package size={16} className="text-neutral-400" />
                          <span>{order.quantity || 0} {order.unit || 'kg'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <span className="font-semibold text-primary-600">
                            P{order.total_price?.toFixed(2) || (order.unit_price && order.quantity ? (order.unit_price * order.quantity).toFixed(2) : '0.00')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Calendar size={16} className="text-neutral-400" />
                          <span>{order.created_at ? formatDate(order.created_at) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <MapPin size={16} className="text-neutral-400" />
                          <span>{order.region_name || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Farmer Info */}
                      <div className="mt-3 pt-3 border-t flex items-center gap-4">
                        <span className="text-sm text-neutral-500">Farmer:</span>
                        <span className="text-sm font-medium">{order.farmer_name || 'Unknown'}</span>
                        {order.farmer_phone && (
                          <a 
                            href={`tel:${order.farmer_phone}`}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            <Phone size={14} />
                            {order.farmer_phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.listing_id && (
                        <Link
                          to={`/listings/${order.listing_id}`}
                          className="flex items-center gap-1 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          View Listing
                          <ChevronRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-neutral-600">
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-2">
            💡 Order Status Guide
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-primary-700">Pending - Awaiting farmer response</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-primary-700">Accepted - Ready for pickup/delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-primary-700">Completed - Order fulfilled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-primary-700">Rejected - Farmer declined</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neutral-400"></span>
              <span className="text-primary-700">Cancelled - Order cancelled</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MyOrdersPage;












