import React from 'react';
import { Layout } from '../components/Layout';
import { Card, EmptyState, PageLoading } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useBuyerOrders, useFarmerOrders } from '../hooks/useApi';
import { Package } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  approved: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      statusStyles[status?.toLowerCase?.()] || 'bg-neutral-100 text-neutral-600'
    }`}
  >
    {status?.charAt(0)?.toUpperCase?.() + status?.slice(1) || 'Unknown'}
  </span>
);

const OrdersPage = () => {
  const { isFarmer } = useAuth();
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = isFarmer ? useFarmerOrders() : useBuyerOrders();

  const orders = ordersData?.orders || [];

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPartyLabel = (order) => {
    if (isFarmer) {
      return order?.buyer_name || order?.buyer?.name || 'Buyer';
    }

    return order?.farmer_name || order?.farmer?.name || order?.seller_name || 'Seller';
  };

  const getProductSummary = (order) => {
    const items = order?.items || [];

    if (items.length === 0) {
      return order?.product_name || order?.crop_name || 'Product';
    }

    return items
      .map((item) => item?.crop_name || item?.product_name || 'Item')
      .filter(Boolean)
      .join(', ');
  };

  const getQuantity = (order) => {
    const items = order?.items || [];

    if (items.length === 0) {
      return order?.quantity ? `${order.quantity} ${order.unit || ''}`.trim() : '—';
    }

    return items
      .map((item) => {
        const qty = item?.quantity;
        const unit = item?.unit;
        return qty ? `${qty}${unit ? ` ${unit}` : ''}` : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLoading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <EmptyState
          icon={Package}
          title="Unable to load orders"
          description={error?.message || 'Please try again later.'}
          action={(
            <button onClick={() => refetch()} className="btn-primary">
              Retry
            </button>
          )}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="page-title">My Orders</h1>
          <p className="text-neutral-600">Track and manage your recent orders.</p>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-neutral-500">You have no orders yet.</p>
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left">
                <tr>
                  <th className="p-3 font-semibold text-neutral-700">Order ID</th>
                  <th className="p-3 font-semibold text-neutral-700">Product</th>
                  <th className="p-3 font-semibold text-neutral-700">Quantity</th>
                  <th className="p-3 font-semibold text-neutral-700">Buyer / Seller</th>
                  <th className="p-3 font-semibold text-neutral-700">Date</th>
                  <th className="p-3 font-semibold text-neutral-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-neutral-100">
                    <td className="p-3 font-medium text-neutral-800">{order.id}</td>
                    <td className="p-3 text-neutral-700">{getProductSummary(order)}</td>
                    <td className="p-3 text-neutral-700">{getQuantity(order)}</td>
                    <td className="p-3 text-neutral-700">{getPartyLabel(order)}</td>
                    <td className="p-3 text-neutral-700">{formatDate(order.created_at || order.date)}</td>
                    <td className="p-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
