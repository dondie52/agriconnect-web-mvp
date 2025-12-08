/**
 * Profile Page for AgriConnect
 * Allows users to view and edit their profile
 */
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, Input, Select, Button } from '../components/UI';
import { useRegions } from '../hooks/useApi';
import { authAPI, UPLOAD_URL } from '../api';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Loader2
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: regions } = useRegions();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    region_id: user?.region_id || '',
  });

  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];
  const currentRegion = regions?.find(r => r.id === user?.region_id)?.name || 'Not set';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Reload to refresh user context
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      region_id: user?.region_id || '',
    });
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await authAPI.uploadProfilePhoto(formData);
      
      if (response.data.success) {
        setProfilePhoto(response.data.data.profile_photo);
        // Update local storage
        const updatedUser = { ...user, profile_photo: response.data.data.profile_photo };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile photo updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Get full photo URL
  const getPhotoUrl = () => {
    if (!profilePhoto) return null;
    if (profilePhoto.startsWith('http')) return profilePhoto;
    return `${UPLOAD_URL.replace('/uploads', '')}${profilePhoto}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="text-neutral-500 mt-1">
              View and manage your account information
            </p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 size={18} />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-6 border-b">
            {/* Profile Photo */}
            <div className="relative">
              <div 
                onClick={handlePhotoClick}
                className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer group"
              >
                {isUploadingPhoto ? (
                  <Loader2 size={30} className="text-primary-600 animate-spin" />
                ) : getPhotoUrl() ? (
                  <img 
                    src={getPhotoUrl()} 
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-primary-600" />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              
              {/* Camera badge */}
              <button
                onClick={handlePhotoClick}
                disabled={isUploadingPhoto}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <Camera size={14} />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-800">{user?.name}</h2>
              <span className={`inline-flex items-center gap-1 px-3 py-1 mt-2 rounded-full text-sm font-medium ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700'
                  : user?.role === 'buyer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                <Shield size={14} />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
              <p className="text-xs text-neutral-500 mt-1">Click photo to change</p>
            </div>
          </div>

          {/* Profile Form / Info */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="pt-6 space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
              <Select
                label="Region"
                name="region_id"
                value={formData.region_id}
                onChange={handleChange}
                options={regionOptions}
                placeholder="Select your region"
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  <Save size={18} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Full Name</p>
                    <p className="font-medium text-neutral-800">{user?.name || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Email Address</p>
                    <p className="font-medium text-neutral-800">{user?.email || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Phone Number</p>
                    <p className="font-medium text-neutral-800">{user?.phone || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Region</p>
                    <p className="font-medium text-neutral-800">{currentRegion}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Member Since</p>
                    <p className="font-medium text-neutral-800">{formatDate(user?.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Account Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user?.is_active !== false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user?.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Security Section */}
        <Card>
          <h3 className="section-title mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-800">Password</p>
                <p className="text-sm text-neutral-500">Last changed: Never</p>
              </div>
              <Button variant="secondary" size="sm">
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Note */}
        <Card className="bg-primary-50 border border-primary-100">
          <h4 className="font-semibold text-primary-800 mb-2">
            💡 Keep Your Profile Updated
          </h4>
          <p className="text-primary-700 text-sm">
            An up-to-date profile helps buyers and sellers connect with you more easily.
            Make sure your phone number and region are correct for the best experience.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;









