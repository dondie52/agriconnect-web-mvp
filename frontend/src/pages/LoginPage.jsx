/**
 * Login Page for AgriConnect
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../components/Layout';
import { Input, Button } from '../components/UI';
import { Eye, EyeOff, Tractor, ShoppingBag, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get role from query parameter
  const roleParam = searchParams.get('role');
  const isRoleSpecific = roleParam === 'farmer' || roleParam === 'buyer';

  const from = location.state?.from?.pathname || null;

  // Role-specific configuration
  const roleConfig = {
    farmer: {
      icon: Tractor,
      title: 'Farmer Login',
      subtitle: 'Access your farm dashboard and manage your listings',
      color: 'bg-primary-500',
      emoji: '🌾',
    },
    buyer: {
      icon: ShoppingBag,
      title: 'Buyer Login',
      subtitle: 'Browse products and connect with local farmers',
      color: 'bg-secondary-500',
      emoji: '🛒',
    },
  };

  const currentRole = isRoleSpecific ? roleConfig[roleParam] : null;

  const validate = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(phone, password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on actual user role (not the query param)
      const dashboardRoutes = {
        farmer: '/farmer/dashboard',
        buyer: '/buyer/dashboard',
        admin: '/admin',
      };
      
      // Use 'from' location if available, otherwise use role-based dashboard
      const redirectTo = from || dashboardRoutes[user.role] || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        {/* Back to Landing Page Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-6 group"
        >
          <Home size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Logo & Role Header */}
        <div className="text-center mb-8">
          {currentRole ? (
            <>
              <div className={`w-16 h-16 ${currentRole.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white text-3xl">{currentRole.emoji}</span>
              </div>
              <h1 className="text-2xl font-bold font-heading text-neutral-800">
                {currentRole.title}
              </h1>
              <p className="text-neutral-500 mt-2">
                {currentRole.subtitle}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">🌿</span>
              </div>
              <h1 className="text-2xl font-bold font-heading text-neutral-800">
                Welcome to AgriConnect
              </h1>
              <p className="text-neutral-500 mt-2">
                Sign in to your account
              </p>
            </>
          )}
        </div>

        {/* Role Switch Link (when role-specific) */}
        {isRoleSpecific && (
          <div className="mb-6 text-center">
            <Link 
              to="/role-select" 
              className="text-sm text-primary-500 hover:underline"
            >
              ← Switch account type
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="26776543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-neutral-600">
          Don't have an account?{' '}
          <Link 
            to={roleParam ? `/register?role=${roleParam}` : '/register'} 
            className="text-primary-500 font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </PublicLayout>
  );
};

export default LoginPage;
