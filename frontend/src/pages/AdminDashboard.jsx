/**
 * Admin Dashboard for AgriConnect
 */
import React from 'react';
import { useAdminDashboard, useAdminUsers, useUpdatePrice, useCrops, useRegions } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, StatCard, PageLoading, Button, Input, Select, StatusBadge, Modal } from '../components/UI';
import { Users, ShoppingBag, DollarSign, TrendingUp, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { data: dashboard, isLoading } = useAdminDashboard();
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers({ limit: 10 });
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();
  const updatePrice = useUpdatePrice();

  const [priceModal, setPriceModal] = React.useState(false);
  const [priceData, setPriceData] = React.useState({
    crop_id: '',
    region_id: '',
    price: '',
    unit: 'kg',
  });

  const handleUpdatePrice = async () => {
    if (!priceData.crop_id || !priceData.region_id || !priceData.price) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await updatePrice.mutateAsync({
        crop_id: parseInt(priceData.crop_id),
        region_id: parseInt(priceData.region_id),
        price: parseFloat(priceData.price),
        unit: priceData.unit,
      });
      toast.success('Price updated successfully');
      setPriceModal(false);
      setPriceData({ crop_id: '', region_id: '', price: '', unit: 'kg' });
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  if (isLoading) {
    return <Layout><PageLoading /></Layout>;
  }

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="text-neutral-500 mt-1">
              Platform overview and management
            </p>
          </div>
          <Button onClick={() => setPriceModal(true)}>
            Update Market Prices
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Farmers"
            value={dashboard?.total_farmers || 0}
            color="primary"
          />
          <StatCard
            icon={UserCheck}
            label="Total Buyers"
            value={dashboard?.total_buyers || 0}
            color="secondary"
          />
          <StatCard
            icon={ShoppingBag}
            label="Active Listings"
            value={dashboard?.active_listings || 0}
            color="success"
          />
          <StatCard
            icon={DollarSign}
            label="Total Transactions"
            value={`P${(dashboard?.total_transaction_value || 0).toLocaleString()}`}
            color="warning"
          />
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="section-title mb-4">Order Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800">Pending Orders</span>
                <span className="font-bold text-lg text-yellow-600">
                  {dashboard?.pending_orders || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Completed Orders</span>
                <span className="font-bold text-lg text-green-600">
                  {dashboard?.completed_orders || 0}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4">User Distribution</h3>
            <div className="space-y-4">
              {dashboard?.user_counts?.map(uc => (
                <div key={uc.role} className="flex justify-between items-center">
                  <span className="capitalize text-neutral-600">{uc.role}s</span>
                  <span className="font-bold">{uc.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card>
          <h3 className="section-title mb-4">Recent Users</h3>
          
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="spinner" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left text-sm text-neutral-500 border-b">
                  <tr>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Region</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersData?.users?.map(user => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3">{user.phone}</td>
                      <td className="py-3 capitalize">{user.role}</td>
                      <td className="py-3">{user.region_name || '-'}</td>
                      <td className="py-3">
                        {user.is_active ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-error">Suspended</span>
                        )}
                      </td>
                      <td className="py-3 text-sm text-neutral-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary-500 border-2 border-transparent cursor-pointer">
            <Users size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-neutral-500">View and manage platform users</p>
          </Card>
          
          <Card className="hover:border-primary-500 border-2 border-transparent cursor-pointer">
            <TrendingUp size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Market Prices</h3>
            <p className="text-sm text-neutral-500">Update crop prices by region</p>
          </Card>
          
          <Card className="hover:border-primary-500 border-2 border-transparent cursor-pointer">
            <ShoppingBag size={24} className="text-primary-500 mb-2" />
            <h3 className="font-semibold">Monitor Listings</h3>
            <p className="text-sm text-neutral-500">Review and moderate listings</p>
          </Card>
        </div>

        {/* Update Price Modal */}
        <Modal
          isOpen={priceModal}
          onClose={() => setPriceModal(false)}
          title="Update Market Price"
          size="md"
        >
          <div className="space-y-4">
            <Select
              label="Crop"
              value={priceData.crop_id}
              onChange={(e) => setPriceData(prev => ({ ...prev, crop_id: e.target.value }))}
              options={cropOptions}
              placeholder="Select crop"
            />
            <Select
              label="Region"
              value={priceData.region_id}
              onChange={(e) => setPriceData(prev => ({ ...prev, region_id: e.target.value }))}
              options={regionOptions}
              placeholder="Select region"
            />
            <Input
              label="Price (Pula)"
              type="number"
              step="0.01"
              value={priceData.price}
              onChange={(e) => setPriceData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., 10.00"
            />
            <Select
              label="Unit"
              value={priceData.unit}
              onChange={(e) => setPriceData(prev => ({ ...prev, unit: e.target.value }))}
              options={[
                { value: 'kg', label: 'per kg' },
                { value: 'ton', label: 'per ton' },
                { value: 'bag', label: 'per bag' },
              ]}
            />
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setPriceModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePrice} loading={updatePrice.isPending} className="flex-1">
                Update Price
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
