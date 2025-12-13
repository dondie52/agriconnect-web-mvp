/**
 * Main App Component for AgriConnect
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute, FarmerRoute, BuyerRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import MarketPricesPage from './pages/MarketPricesPage';
import NotificationsPage from './pages/NotificationsPage';
import { LandingPage } from './pages/landing';
import RoleSelectPage from './pages/auth/RoleSelectPage';

// Info Pages
import {
  AboutPage,
  HowItWorksPage,
  MissionPage,
  SuccessStoriesPage,
  CareersPage,
  PressPage,
  HelpCenterPage,
  SafetyPage,
  FAQPage,
  TermsPage,
  PrivacyPage,
  USSDGuidePage,
  SellerGuidePage,
  CommunityPage,
  CookiesPage,
} from './pages/info';

// Global Chatbot Widget
import Chatbot from './components/chatbot';

// Lazy load other pages for better performance
const MyListingsPage = React.lazy(() => import('./pages/MyListingsPage'));
const ListingDetailPage = React.lazy(() => import('./pages/ListingDetailPage'));
const EditListingPage = React.lazy(() => import('./pages/EditListingPage'));
const BuyerRequestsPage = React.lazy(() => import('./pages/BuyerRequestsPage'));
const CreateRequestPage = React.lazy(() => import('./pages/CreateRequestPage'));
const WeatherPage = React.lazy(() => import('./pages/WeatherPage'));
const CropPlannerPage = React.lazy(() => import('./pages/CropPlannerPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MyOrdersPage = React.lazy(() => import('./pages/MyOrdersPage'));
const MyRequestsPage = React.lazy(() => import('./pages/MyRequestsPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const LivestockPage = React.lazy(() => import('./pages/LivestockPage'));
const AddLivestockPage = React.lazy(() => import('./pages/AddLivestockPage'));
const LivestockDetailPage = React.lazy(() => import('./pages/LivestockDetailPage'));

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
              <Route path="/" element={<LandingPage />} />
              <Route path="/role-select" element={<RoleSelectPage />} />
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

              {/* ==================== */}
              {/* Info / Static Pages */}
              {/* ==================== */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/mission" element={<MissionPage />} />
              <Route path="/success-stories" element={<SuccessStoriesPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/ussd-guide" element={<USSDGuidePage />} />
              <Route path="/seller-guide" element={<SellerGuidePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/cookies" element={<CookiesPage />} />

              {/* ==================== */}
              {/* Farmer Routes */}
              {/* ==================== */}
              <Route path="/farmer/dashboard" element={
                <FarmerRoute>
                  <FarmerDashboard />
                </FarmerRoute>
              } />
              <Route path="/farmer/my-listings" element={
                <FarmerRoute>
                  <MyListingsPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/create-listing" element={
                <FarmerRoute>
                  <CreateListingPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/edit-listing/:id" element={
                <FarmerRoute>
                  <EditListingPage />
                </FarmerRoute>
              } />
              <Route path="/edit-listing/:id" element={
                <FarmerRoute>
                  <EditListingPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/crop-planner" element={
                <FarmerRoute>
                  <CropPlannerPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/analytics" element={
                <FarmerRoute>
                  <AnalyticsPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/livestock" element={
                <FarmerRoute>
                  <LivestockPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/livestock/add" element={
                <FarmerRoute>
                  <AddLivestockPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/livestock/:id" element={
                <FarmerRoute>
                  <LivestockDetailPage />
                </FarmerRoute>
              } />
              <Route path="/farmer/livestock/:id/edit" element={
                <FarmerRoute>
                  <AddLivestockPage />
                </FarmerRoute>
              } />

              {/* Legacy farmer routes - redirect to new paths */}
              <Route path="/dashboard" element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="/my-listings" element={<Navigate to="/farmer/my-listings" replace />} />
              <Route path="/create-listing" element={<Navigate to="/farmer/create-listing" replace />} />
              <Route path="/crop-planner" element={<Navigate to="/farmer/crop-planner" replace />} />
              <Route path="/analytics" element={<Navigate to="/farmer/analytics" replace />} />

              {/* ==================== */}
              {/* Buyer Routes */}
              {/* ==================== */}
              <Route path="/buyer/dashboard" element={
                <BuyerRoute>
                  <ListingsPage />
                </BuyerRoute>
              } />
              <Route path="/buyer/cart" element={
                <BuyerRoute>
                  <CartPage />
                </BuyerRoute>
              } />
              <Route path="/buyer/create-request" element={
                <BuyerRoute>
                  <CreateRequestPage />
                </BuyerRoute>
              } />

              {/* Buyer Orders and Requests */}
              <Route path="/buyer/my-orders" element={
                <BuyerRoute>
                  <MyOrdersPage />
                </BuyerRoute>
              } />
              <Route path="/buyer/my-requests" element={
                <BuyerRoute>
                  <MyRequestsPage />
                </BuyerRoute>
              } />

              {/* Legacy buyer routes - redirect to new paths */}
              <Route path="/create-request" element={<Navigate to="/buyer/create-request" replace />} />
              <Route path="/my-orders" element={<Navigate to="/buyer/my-orders" replace />} />
              <Route path="/my-requests" element={<Navigate to="/buyer/my-requests" replace />} />
              <Route path="/cart" element={<Navigate to="/buyer/cart" replace />} />

              {/* ==================== */}
              {/* Shared Routes (Farmer & Buyer) */}
              {/* ==================== */}
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* ==================== */}
              {/* Admin Routes */}
              {/* ==================== */}
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

              {/* ==================== */}
              {/* 404 - Not Found */}
              {/* ==================== */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
                    <p className="text-xl text-neutral-600 mb-6">Page not found</p>
                    <a 
                      href="/" 
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Return Home
                    </a>
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

        {/* Global Chatbot Widget - Appears on all pages */}
        <Chatbot />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
