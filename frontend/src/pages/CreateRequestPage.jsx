/**
 * Create Request Page for AgriConnect (Buyer)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrops, useRegions, useCreateRequest } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Input, Select, Textarea, Button, Card } from '../components/UI';
import toast from 'react-hot-toast';

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();
  const createRequest = useCreateRequest();

  const [formData, setFormData] = useState({
    crop_id: '',
    quantity: '',
    unit: 'kg',
    max_price: '',
    region_id: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];
  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'ton', label: 'Tons' },
    { value: 'bag', label: 'Bags' },
    { value: 'crate', label: 'Crates' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.crop_id) newErrors.crop_id = 'Crop type is required';
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createRequest.mutateAsync({
        crop_id: parseInt(formData.crop_id),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        region_id: formData.region_id ? parseInt(formData.region_id) : null,
        notes: formData.notes,
      });
      toast.success('Request posted successfully!');
      navigate('/buyer-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <h1 className="page-title mb-6">Post Produce Request</h1>
        <p className="text-neutral-500 mb-6">
          Let farmers know what produce you're looking for.
        </p>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Crop Type *"
              name="crop_id"
              value={formData.crop_id}
              onChange={handleChange}
              options={cropOptions}
              placeholder="Select crop type"
              error={errors.crop_id}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity Needed *"
                name="quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 100"
                error={errors.quantity}
              />
              <Select
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                options={unitOptions}
              />
            </div>

            <Input
              label="Maximum Price per Unit (Pula) - Optional"
              name="max_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.max_price}
              onChange={handleChange}
              placeholder="Leave blank for flexible"
            />

            <Select
              label="Preferred Region - Optional"
              name="region_id"
              value={formData.region_id}
              onChange={handleChange}
              options={regionOptions}
              placeholder="Any region"
            />

            <Textarea
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Specify quality requirements, delivery needs, timeline, etc."
              rows={4}
            />

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" loading={createRequest.isPending} className="flex-1">
                Post Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateRequestPage;
