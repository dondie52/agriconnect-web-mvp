/**
 * My Orders Page for AgriConnect
 * Shows orders placed by buyers with cancel functionality
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerOrders, useCancelOrder } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, EmptyState, Badge, Button, Modal } from '../components/UI';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  MapPin,
  Phone,
  Calendar,
  ShoppingCart,
  AlertTriangle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const cancelOrder = useCancelOrder();
  
  const [cancelModal, setCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const orders = ordersData?.orders || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Safely format price - handles strings, numbers, null, undefined
  const formatPrice = (price) => {
    const num = Number(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;
    
    try {
      await cancelOrder.mutateAsync(orderToCancel.id);
      toast.success('Order cancelled successfully');
      setCancelModal(false);
      setOrderToCancel(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
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
              const items = order.items || [];

              if (!order || !order.id) return null;

              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart size={20} className="text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-800">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {items.length} item{items.length !== 1 ? 's' : ''} • {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                      <span className="text-lg font-bold text-primary-600">
                        P{formatPrice(order.total_price)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 border-t pt-4">
                    {items.map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-800">{item.crop_name || 'Unknown'}</span>
                            <span className="text-sm text-neutral-500">× {item.quantity} {item.unit || 'kg'}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                            <span>by {item.farmer_name || 'Unknown'}</span>
                            {item.farmer_phone && (
                              <a 
                                href={`tel:${item.farmer_phone}`}
                                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                              >
                                <Phone size={12} />
                                {item.farmer_phone}
                              </a>
                            )}
                            {item.region_name && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {item.region_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-800">
                            P{formatPrice(item.total_price)}
                          </span>
                          <p className="text-xs text-neutral-500">
                            P{formatPrice(item.unit_price)}/{item.unit || 'kg'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      {order.delivery_preference && (
                        <span className="capitalize">
                          {order.delivery_preference === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </span>
                      )}
                      {order.notes && (
                        <span className="text-neutral-400">|</span>
                      )}
                      {order.notes && (
                        <span className="truncate max-w-xs" title={order.notes}>
                          Note: {order.notes}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(order)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X size={14} />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={cancelModal}
          onClose={() => {
            setCancelModal(false);
            setOrderToCancel(null);
          }}
          title="Cancel Order"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
              <AlertTriangle className="text-amber-500 shrink-0" size={24} />
              <p className="text-sm text-amber-800">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
            </div>

            {orderToCancel && (
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium">Order #{orderToCancel.id}</span>
                </p>
                <p className="text-lg font-semibold text-primary-600 mt-1">
                  P{formatPrice(orderToCancel.total_price)}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCancelModal(false);
                  setOrderToCancel(null);
                }}
                className="flex-1"
              >
                Keep Order
              </Button>
              <Button
                onClick={handleCancelConfirm}
                loading={cancelOrder.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </Modal>

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












