import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/UI';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const sampleOrders = [
  {
    id: 'ORD-001',
    product: 'Maize',
    quantity: '10 bags',
    party: 'Buyer: Fresh Foods Co.',
    status: 'Pending',
    date: '12 Dec 2025'
  },
  {
    id: 'ORD-002',
    product: 'Tomatoes',
    quantity: '25 kg',
    party: 'Buyer: City Market',
    status: 'Delivered',
    date: '10 Dec 2025'
  },
  {
    id: 'ORD-003',
    product: 'Sorghum',
    quantity: '15 bags',
    party: 'Seller: Green Valley Farms',
    status: 'Approved',
    date: '08 Dec 2025'
  }
];

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      statusStyles[status] || 'bg-neutral-100 text-neutral-600'
    }`}
  >
    {status}
  </span>
);

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Placeholder data until API integration
    setOrders(sampleOrders);
  }, []);

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
                    <td className="p-3 text-neutral-700">{order.product}</td>
                    <td className="p-3 text-neutral-700">{order.quantity}</td>
                    <td className="p-3 text-neutral-700">{order.party}</td>
                    <td className="p-3 text-neutral-700">{order.date}</td>
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
