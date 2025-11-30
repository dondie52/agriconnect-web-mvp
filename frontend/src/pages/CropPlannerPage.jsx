/**
 * Crop Planner Page for AgriConnect
 */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  useMyCropPlans, 
  useRegionalTrends, 
  useCrops, 
  useCreateCropPlan 
} from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, Select, Button, PageLoading, EmptyState } from '../components/UI';
import { Calendar, TrendingUp, Users, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const CropPlannerPage = () => {
  const { user } = useAuth();
  const { data: crops } = useCrops();
  const { data: myPlans, isLoading: loadingPlans } = useMyCropPlans({});
  const { data: regionalTrends } = useRegionalTrends(user?.region_id, {});
  const createPlan = useCreateCropPlan();

  const [newPlan, setNewPlan] = useState({
    crop_id: '',
    season: 'summer',
    planned_quantity: '',
  });

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const seasonOptions = [
    { value: 'summer', label: 'Summer (Oct-Mar)' },
    { value: 'autumn', label: 'Autumn (Apr-May)' },
    { value: 'winter', label: 'Winter (Jun-Aug)' },
    { value: 'spring', label: 'Spring (Sep)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPlan.crop_id) {
      toast.error('Please select a crop');
      return;
    }

    try {
      await createPlan.mutateAsync({
        crop_id: parseInt(newPlan.crop_id),
        season: newPlan.season,
        planned_quantity: newPlan.planned_quantity ? parseFloat(newPlan.planned_quantity) : null,
      });
      toast.success('Crop plan saved!');
      setNewPlan({ crop_id: '', season: 'summer', planned_quantity: '' });
    } catch (err) {
      toast.error('Failed to save plan');
    }
  };

  // Format trends for chart
  const chartData = regionalTrends?.slice(0, 10).map(t => ({
    name: t.crop_name,
    farmers: t.farmer_count,
    quantity: parseFloat(t.total_planned_quantity) || 0,
  })) || [];

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="page-title">Crop Planner</h1>
          <p className="text-neutral-500 mt-1">
            Plan your crops and see what others in your region are planting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Plan */}
          <Card>
            <h3 className="section-title flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-primary-500" />
              Plan Your Crop
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Crop"
                value={newPlan.crop_id}
                onChange={(e) => setNewPlan(prev => ({ ...prev, crop_id: e.target.value }))}
                options={cropOptions}
                placeholder="Select crop to plant"
              />
              
              <Select
                label="Season"
                value={newPlan.season}
                onChange={(e) => setNewPlan(prev => ({ ...prev, season: e.target.value }))}
                options={seasonOptions}
              />
              
              <div>
                <label className="label">Planned Quantity (kg) - Optional</label>
                <input
                  type="number"
                  value={newPlan.planned_quantity}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, planned_quantity: e.target.value }))}
                  placeholder="Expected harvest"
                  className="input-field"
                />
              </div>
              
              <Button type="submit" loading={createPlan.isPending} className="w-full">
                Add to Plan
              </Button>
            </form>
          </Card>

          {/* My Plans */}
          <Card>
            <h3 className="section-title mb-4">My Current Plans</h3>
            
            {loadingPlans ? (
              <div className="flex justify-center py-8">
                <div className="spinner" />
              </div>
            ) : myPlans?.length > 0 ? (
              <div className="space-y-3">
                {myPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{plan.crop_name}</p>
                      <p className="text-sm text-neutral-500">
                        {plan.season.charAt(0).toUpperCase() + plan.season.slice(1)} {plan.year}
                        {plan.planned_quantity && ` • ${plan.planned_quantity}kg planned`}
                      </p>
                    </div>
                    <button className="text-red-500 hover:text-red-600 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No plans yet"
                description="Start planning your seasonal crops"
              />
            )}
          </Card>
        </div>

        {/* Regional Trends */}
        <Card>
          <h3 className="section-title flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary-500" />
            Regional Crop Trends
            <span className="text-sm font-normal text-neutral-500">
              - What farmers in your region are planning
            </span>
          </h3>
          
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="farmers" 
                    name="Farmers Planning" 
                    fill="#2E7D32" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <Users size={48} className="mx-auto mb-4 text-neutral-300" />
              <p>No regional data available yet</p>
              <p className="text-sm">Be the first to share your crop plans!</p>
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-3">
            💡 Why Plan Crops?
          </h4>
          <ul className="space-y-2 text-primary-700 text-sm">
            <li>• <strong>Avoid oversupply:</strong> See what others are planting to diversify</li>
            <li>• <strong>Better prices:</strong> Plant crops with less regional competition</li>
            <li>• <strong>Community coordination:</strong> Help balance regional production</li>
            <li>• <strong>Market insights:</strong> Use buyer requests to guide your choices</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};

export default CropPlannerPage;
