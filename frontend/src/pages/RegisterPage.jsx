/**
 * Register Page for AgriConnect
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRegions } from '../hooks/useApi';
import { PublicLayout } from '../components/Layout';
import { Input, Select, Button } from '../components/UI';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    region_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const { data: regions } = useRegions();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^(\+267|267)?[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Botswana phone number';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        role: formData.role,
        region_id: formData.region_id ? parseInt(formData.region_id) : undefined,
      };

      const user = await register(userData);
      toast.success(`Welcome to AgriConnect, ${user.name}!`);
      
      const dashboardRoutes = {
        farmer: '/dashboard',
        buyer: '/listings',
      };
      navigate(dashboardRoutes[user.role] || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer - I want to sell produce' },
    { value: 'buyer', label: 'Buyer - I want to buy produce' },
  ];

  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];

  return (
    <PublicLayout>
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">
            Join AgriConnect
          </h1>
          <p className="text-neutral-500 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Mosweu"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="26776543210"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            label="Email (Optional)"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Select
            label="I am a"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />

          <Select
            label="Region"
            name="region_id"
            value={formData.region_id}
            onChange={handleChange}
            options={regionOptions}
            placeholder="Select your region"
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
