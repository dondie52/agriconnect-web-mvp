/**
 * Login Page for AgriConnect
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../components/Layout';
import { Input, Button } from '../components/UI';
import { Eye, EyeOff } from 'lucide-react';
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

  const from = location.state?.from?.pathname || '/dashboard';

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
      
      // Redirect based on role
      const dashboardRoutes = {
        farmer: '/dashboard',
        buyer: '/listings',
        admin: '/admin',
      };
      navigate(dashboardRoutes[user.role] || from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-neutral-800">
            Welcome to AgriConnect
          </h1>
          <p className="text-neutral-500 mt-2">
            Sign in to your account
          </p>
        </div>

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
          <Link to="/register" className="text-primary-500 font-medium hover:underline">
            Register
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-500 text-center mb-2">Demo Credentials</p>
          <div className="text-xs text-neutral-600 space-y-1">
            <p><strong>Farmer:</strong> 26776543210 / farmer123</p>
            <p><strong>Buyer:</strong> 26774567890 / buyer123</p>
            <p><strong>Admin:</strong> 26712345678 / admin123</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
