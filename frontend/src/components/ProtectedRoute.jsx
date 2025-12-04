/**
 * Protected Route Component for AgriConnect
 * Handles authentication and role-based access control
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoading } from './UI';

// Dashboard routes for each role
const DASHBOARD_ROUTES = {
  farmer: '/farmer/dashboard',
  buyer: '/buyer/dashboard',
  admin: '/admin',
};

// Protected Route - requires authentication
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  }

  return children;
};

// Public Route - redirects to dashboard if already logged in
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  }

  return children;
};

// Farmer-only Route
export const FarmerRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?role=farmer" state={{ from: location }} replace />;
  }

  if (user.role !== 'farmer') {
    // Redirect non-farmers to their appropriate dashboard
    return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  }

  return children;
};

// Buyer-only Route
export const BuyerRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?role=buyer" state={{ from: location }} replace />;
  }

  if (user.role !== 'buyer') {
    // Redirect non-buyers to their appropriate dashboard
    return <Navigate to={DASHBOARD_ROUTES[user.role] || '/'} replace />;
  }

  return children;
};

// Role-based component rendering
export const RoleGuard = ({ roles, children, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
