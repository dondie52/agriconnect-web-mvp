/**
 * Add/Edit Livestock Page for AgriConnect
 * Form for creating or editing livestock records
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateLivestock, useUpdateLivestock, useLivestockDetail } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, Button, PageLoading } from '../components/UI';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

// Livestock types
const livestockTypes = [
  { value: 'cattle', label: 'Cattle', icon: '🐄' },
  { value: 'goat', label: 'Goat', icon: '🐐' },
  { value: 'sheep', label: 'Sheep', icon: '🐑' },
  { value: 'chicken', label: 'Chicken', icon: '🐔' },
  { value: 'pig', label: 'Pig', icon: '🐷' },
  { value: 'donkey', label: 'Donkey', icon: '🫏' },
  { value: 'horse', label: 'Horse', icon: '🐴' },
  { value: 'other', label: 'Other', icon: '🐾' },
];

// Gender options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

// Status options
const statusOptions = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'sick', label: 'Sick' },
  { value: 'sold', label: 'Sold' },
  { value: 'deceased', label: 'Deceased' },
];

const AddLivestockPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingLivestock, isLoading: loadingExisting } = useLivestockDetail(id);
  const createLivestock = useCreateLivestock();
  const updateLivestock = useUpdateLivestock();

  const [formData, setFormData] = useState({
    type: '',
    breed: '',
    gender: '',
    age_months: '',
    weight_kg: '',
    tag_number: '',
    status: 'healthy',
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (existingLivestock) {
      setFormData({
        type: existingLivestock.type || '',
        breed: existingLivestock.breed || '',
        gender: existingLivestock.gender || '',
        age_months: existingLivestock.age_months?.toString() || '',
        weight_kg: existingLivestock.weight_kg?.toString() || '',
        tag_number: existingLivestock.tag_number || '',
        status: existingLivestock.status || 'healthy',
        location: existingLivestock.location || '',
        notes: existingLivestock.notes || '',
      });
    }
  }, [existingLivestock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Please select a livestock type';
    }

    if (formData.age_months && (isNaN(formData.age_months) || parseInt(formData.age_months) < 0)) {
      newErrors.age_months = 'Age must be a positive number';
    }

    if (formData.weight_kg && (isNaN(formData.weight_kg) || parseFloat(formData.weight_kg) <= 0)) {
      newErrors.weight_kg = 'Weight must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const submitData = {
        ...formData,
        age_months: formData.age_months ? parseInt(formData.age_months) : null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      };

      if (isEditing) {
        await updateLivestock.mutateAsync({ id: parseInt(id), data: submitData });
        toast.success('Livestock updated successfully');
      } else {
        await createLivestock.mutateAsync(submitData);
        toast.success('Livestock added successfully');
      }

      navigate('/farmer/livestock');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} livestock`);
    }
  };

  if (isEditing && loadingExisting) {
    return (
      <Layout>
        <PageLoading />
      </Layout>
    );
  }

  const isPending = createLivestock.isPending || updateLivestock.isPending;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="page-title">{isEditing ? 'Edit Livestock' : 'Add Livestock'}</h1>
            <p className="text-neutral-500 mt-1">
              {isEditing ? 'Update your animal record' : 'Add a new animal to your farm'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Animal Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {livestockTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: type.value } })}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <p className="text-xs mt-1 font-medium">{type.label}</p>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Breed
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Brahman, Boer, Dorper"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Gender
              </label>
              <div className="flex gap-4">
                {genderOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-neutral-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Age and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Age (months)
                </label>
                <input
                  type="number"
                  name="age_months"
                  value={formData.age_months}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 18"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.age_months ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.age_months && <p className="text-red-500 text-sm mt-1">{errors.age_months}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 320"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.weight_kg ? 'border-red-500' : 'border-neutral-200'
                  }`}
                />
                {errors.weight_kg && <p className="text-red-500 text-sm mt-1">{errors.weight_kg}</p>}
              </div>
            </div>

            {/* Tag Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tag / ID Number
              </label>
              <input
                type="text"
                name="tag_number"
                value={formData.tag_number}
                onChange={handleChange}
                placeholder="e.g., BW-1023"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-neutral-500 mt-1">Ear tag, brand, or unique identifier</p>
            </div>

            {/* Status (only show when editing) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Location / Kraal
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main kraal, North pasture"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional notes about this animal..."
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                className="flex-1"
              >
                <Save size={18} className="mr-2" />
                {isEditing ? 'Update Livestock' : 'Add Livestock'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddLivestockPage;
