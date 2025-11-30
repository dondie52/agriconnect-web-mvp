/**
 * Create Listing Page for AgriConnect
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrops, useRegions, useCreateListing } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Input, Select, Textarea, Button, Card } from '../components/UI';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();
  const createListing = useCreateListing();

  const [formData, setFormData] = useState({
    crop_id: '',
    quantity: '',
    unit: 'kg',
    price: '',
    region_id: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];
  const unitOptions = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'ton', label: 'Tons' },
    { value: 'bag', label: 'Bags' },
    { value: 'crate', label: 'Crates' },
    { value: 'bunch', label: 'Bunches' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.crop_id) newErrors.crop_id = 'Crop type is required';
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.region_id) newErrors.region_id = 'Region is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const submitData = new FormData();
    submitData.append('crop_id', formData.crop_id);
    submitData.append('quantity', formData.quantity);
    submitData.append('unit', formData.unit);
    submitData.append('price', formData.price);
    submitData.append('region_id', formData.region_id);
    submitData.append('description', formData.description);
    
    images.forEach(image => {
      submitData.append('images', image);
    });

    try {
      await createListing.mutateAsync(submitData);
      toast.success('Listing created successfully!');
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <h1 className="page-title mb-6">Create New Listing</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop Selection */}
            <Select
              label="Crop Type *"
              name="crop_id"
              value={formData.crop_id}
              onChange={handleChange}
              options={cropOptions}
              placeholder="Select crop type"
              error={errors.crop_id}
            />

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity *"
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

            {/* Price */}
            <Input
              label="Price per Unit (Pula) *"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 10.00"
              error={errors.price}
            />

            {/* Region */}
            <Select
              label="Location/Region *"
              name="region_id"
              value={formData.region_id}
              onChange={handleChange}
              options={regionOptions}
              placeholder="Select region"
              error={errors.region_id}
            />

            {/* Description */}
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your produce (quality, freshness, farming method, etc.)"
              rows={4}
            />

            {/* Image Upload */}
            <div>
              <label className="label">Photos (Max 5)</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto text-neutral-400 mb-2" />
                  <p className="text-neutral-600">Click to upload images</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    JPEG, PNG, or WebP. Max 5MB each.
                  </p>
                </label>
              </div>
              
              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createListing.isPending}
                className="flex-1"
              >
                Create Listing
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateListingPage;
