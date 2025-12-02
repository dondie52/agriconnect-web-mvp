/**
 * Quick Actions Component
 * 4 action cards for main user flows: Browse, Post, Join, Buy
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Users, 
  ShoppingBag,
  ArrowRight,
  X,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QuickActions = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isFarmer, isBuyer, logout } = useAuth();
  const [showBuyerModal, setShowBuyerModal] = useState(false);

  // Handle Post Product click with role-based logic
  const handlePostProductClick = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Not logged in - go to role select
      navigate('/role-select');
    } else if (isFarmer) {
      // Farmer - go to create listing
      navigate('/farmer/create-listing');
    } else if (isBuyer) {
      // Buyer - show modal
      setShowBuyerModal(true);
    }
  };

  // Handle logout and switch
  const handleLogoutAndSwitch = () => {
    logout();
    setShowBuyerModal(false);
    navigate('/login?role=farmer');
  };

  const actions = [
    {
      id: 'browse',
      icon: Search,
      title: 'Browse Listings',
      description: 'Explore thousands of fresh products from verified local farmers',
      link: '/listings',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      iconBg: 'bg-blue-400/30',
      stat: '2,500+',
      statLabel: 'Active Listings',
      isLink: true,
    },
    {
      id: 'post',
      icon: PlusCircle,
      title: 'Post Product',
      description: 'List your farm produce and reach thousands of potential buyers',
      link: '/farmer/create-listing',
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      iconBg: 'bg-green-400/30',
      stat: 'Free',
      statLabel: 'No listing fees',
      isLink: false, // Use onClick handler
      onClick: handlePostProductClick,
    },
    {
      id: 'join',
      icon: Users,
      title: 'Join as Farmer',
      description: 'Register your farm and become part of our growing community',
      link: '/register?role=farmer',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      iconBg: 'bg-purple-400/30',
      stat: '500+',
      statLabel: 'Verified Farmers',
      isLink: true,
    },
    {
      id: 'buy',
      icon: ShoppingBag,
      title: 'Buy Products',
      description: 'Shop directly from farmers and get the freshest produce delivered',
      link: '/register?role=buyer',
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
      iconBg: 'bg-orange-400/30',
      stat: 'Same Day',
      statLabel: 'Delivery Available',
      isLink: true,
    },
  ];

  // Card content component to avoid duplication
  const ActionCardContent = ({ action }) => (
    <>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-4 border-white" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-4 border-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-14 h-14 ${action.iconBg} rounded-xl flex items-center 
                      justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <action.icon size={28} className="text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 font-display">
          {action.title}
        </h3>

        {/* Description */}
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {action.description}
        </p>

        {/* Stat */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <div className="text-2xl font-bold">{action.stat}</div>
            <div className="text-xs text-white/70">{action.statLabel}</div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center
                        group-hover:bg-white/30 transition-colors">
            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section className="py-10 md:py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 
                        text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            Get Started Today
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 font-display mb-3">
            What Would You Like to Do?
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Whether you're a farmer looking to sell or a buyer searching for fresh produce, 
            we've got you covered.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {actions.map((action, index) => (
            action.isLink ? (
              <Link
                key={action.id}
                to={action.link}
                className={`group relative bg-gradient-to-br ${action.gradient} ${action.hoverGradient} 
                          rounded-2xl p-6 text-white overflow-hidden transition-all duration-300 
                          hover:-translate-y-1 hover:shadow-xl animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ActionCardContent action={action} />
              </Link>
            ) : (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`group relative bg-gradient-to-br ${action.gradient} ${action.hoverGradient} 
                          rounded-2xl p-6 text-white overflow-hidden transition-all duration-300 
                          hover:-translate-y-1 hover:shadow-xl animate-fade-in-up text-left w-full`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ActionCardContent action={action} />
              </button>
            )
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 bg-white rounded-2xl p-6 md:p-8 shadow-card flex flex-col md:flex-row 
                      items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-3xl">🍀</span>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-neutral-800 font-display">
                New to AgriConnect?
              </h3>
              <p className="text-neutral-600 text-sm md:text-base">
                Learn how our platform helps farmers and buyers connect directly.
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="w-full md:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white 
                     rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 
                     shadow-md hover:shadow-lg"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Buyer Warning Modal */}
      {showBuyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBuyerModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={() => setShowBuyerModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={32} className="text-amber-600" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-neutral-800 text-center mb-2 font-display">
              Buyers Cannot Post Products
            </h3>

            {/* Description */}
            <p className="text-neutral-600 text-center mb-6">
              Your account is registered as a <strong>Buyer</strong>. Only farmers can post products 
              for sale on AgriConnect.
            </p>

            {/* Options */}
            <div className="space-y-3">
              <button
                onClick={handleLogoutAndSwitch}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 
                         hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
              >
                <LogOut size={18} />
                Logout & Switch to Farmer Account
              </button>
              
              <button
                onClick={() => setShowBuyerModal(false)}
                className="w-full px-4 py-3 border border-neutral-300 text-neutral-700 
                         hover:bg-neutral-50 rounded-xl font-medium transition-colors"
              >
                Continue as Buyer
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-neutral-500 text-center mt-4">
              Need help? Contact support for assistance with your account type.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuickActions;
