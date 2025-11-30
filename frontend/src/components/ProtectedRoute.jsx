/**
 * Protected Route Component for AgriConnect
 * Handles authentication and role-based access control
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoading } from './UI';

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
    const dashboardRoutes = {
      farmer: '/dashboard',
      buyer: '/listings',
      admin: '/admin',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
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
    const dashboardRoutes = {
      farmer: '/dashboard',
      buyer: '/listings',
      admin: '/admin',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
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
