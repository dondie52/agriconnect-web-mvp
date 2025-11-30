/**
 * Main App Component for AgriConnect
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import MarketPricesPage from './pages/MarketPricesPage';
import NotificationsPage from './pages/NotificationsPage';

// Lazy load other pages for better performance
const MyListingsPage = React.lazy(() => import('./pages/MyListingsPage'));
const ListingDetailPage = React.lazy(() => import('./pages/ListingDetailPage'));
const BuyerRequestsPage = React.lazy(() => import('./pages/BuyerRequestsPage'));
const CreateRequestPage = React.lazy(() => import('./pages/CreateRequestPage'));
const WeatherPage = React.lazy(() => import('./pages/WeatherPage'));
const CropPlannerPage = React.lazy(() => import('./pages/CropPlannerPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Loading fallback for lazy loaded components
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner w-12 h-12" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <React.Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />

              {/* Farmer Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-listings" element={
                <ProtectedRoute roles={['farmer']}>
                  <MyListingsPage />
                </ProtectedRoute>
              } />
              <Route path="/create-listing" element={
                <ProtectedRoute roles={['farmer']}>
                  <CreateListingPage />
                </ProtectedRoute>
              } />
              <Route path="/crop-planner" element={
                <ProtectedRoute roles={['farmer']}>
                  <CropPlannerPage />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute roles={['farmer']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              } />

              {/* Buyer Routes */}
              <Route path="/create-request" element={
                <ProtectedRoute roles={['buyer']}>
                  <CreateRequestPage />
                </ProtectedRoute>
              } />

              {/* Shared Routes (Farmer & Buyer) */}
              <Route path="/listings" element={
                <ProtectedRoute>
                  <ListingsPage />
                </ProtectedRoute>
              } />
              <Route path="/listings/:id" element={
                <ProtectedRoute>
                  <ListingDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/prices" element={
                <ProtectedRoute>
                  <MarketPricesPage />
                </ProtectedRoute>
              } />
              <Route path="/buyer-requests" element={
                <ProtectedRoute>
                  <BuyerRequestsPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/weather" element={
                <ProtectedRoute>
                  <WeatherPage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-neutral-800 mb-4">404</h1>
                    <p className="text-neutral-600">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
          </React.Suspense>
        </Router>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#2E7D32',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
