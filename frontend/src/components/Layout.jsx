/**
 * Layout Components for AgriConnect
 */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUnreadCount } from '../hooks/useApi';
import { UPLOAD_URL } from '../api';
import {
  Home,
  ShoppingBag,
  PlusCircle,
  TrendingUp,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Cloud,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Search
} from 'lucide-react';

// Helper to get full photo URL
const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${UPLOAD_URL.replace('/uploads', '')}${photo}`;
};

// Sidebar Navigation Component
export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isFarmer, isBuyer, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const farmerLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/my-listings', icon: ShoppingBag, label: 'My Listings' },
    { to: '/create-listing', icon: PlusCircle, label: 'Create Listing' },
    { to: '/prices', icon: TrendingUp, label: 'Market Prices' },
    { to: '/buyer-requests', icon: Search, label: 'Buyer Requests' },
    { to: '/crop-planner', icon: Calendar, label: 'Crop Planner' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/weather', icon: Cloud, label: 'Weather' },
  ];

  const buyerLinks = [
    { to: '/listings', icon: ShoppingBag, label: 'Browse Listings' },
    { to: '/buyer/my-orders', icon: Home, label: 'My Orders' },
    { to: '/prices', icon: TrendingUp, label: 'Market Prices' },
    { to: '/buyer/create-request', icon: PlusCircle, label: 'Post Request' },
    { to: '/buyer/my-requests', icon: Search, label: 'My Requests' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/listings', icon: ShoppingBag, label: 'Listings' },
    { to: '/admin/prices', icon: TrendingUp, label: 'Prices' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : isBuyer ? buyerLinks : farmerLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌿</span>
            </div>
            <span className="font-heading font-bold text-xl text-primary-600">AgriConnect</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-neutral-500 hover:text-neutral-700">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 mb-4 p-2 -m-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile_photo ? (
                <img 
                  src={getPhotoUrl(user.profile_photo)} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-800 text-sm">{user?.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
            </div>
            <span className="text-xs text-primary-600">View Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Header Component
export const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { data: unreadCount } = useUnreadCount();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-neutral-600 hover:text-neutral-800"
        >
          <Menu size={24} />
        </button>

        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative text-neutral-600 hover:text-neutral-800"
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User menu (desktop) */}
          <Link to="/profile" className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile_photo ? (
                <img 
                  src={getPhotoUrl(user.profile_photo)} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={18} className="text-primary-600" />
              )}
            </div>
            <span className="text-sm font-medium text-neutral-700">{user?.name}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

// Main Layout Component
export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>

        <footer className="bg-white border-t py-4 px-6 text-center text-sm text-neutral-500">
          © 2025 AgriConnect Botswana. Connecting farmers to markets.
        </footer>
      </div>
    </div>
  );
};

// Public Layout (for login/register pages)
export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default Layout;
