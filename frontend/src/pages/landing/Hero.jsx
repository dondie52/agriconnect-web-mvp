/**
 * Hero Section Component
 * Full-width banner with background image, green gradient overlay, central search, and trust badges
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Truck, 
  BadgeCheck, 
  Wallet,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All Categories',
    'Grains & Cereals',
    'Vegetables',
    'Fruits',
    'Livestock',
    'Dairy Products',
    'Poultry & Eggs',
  ];

  const trustBadges = [
    { icon: BadgeCheck, text: 'Verified Farmers', color: 'text-green-400' },
    { icon: ShieldCheck, text: 'Secure Transactions', color: 'text-blue-400' },
    { icon: Truck, text: 'Fast Delivery', color: 'text-yellow-400' },
    { icon: Wallet, text: 'Fair Prices', color: 'text-purple-400' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/listings?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`;
  };

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      {/* Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800/95 via-primary-700/90 to-primary-600/85" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-5 10-15 15-25 15 10 5 15 15 15 25 5-10 15-15 25-15-10-5-15-15-15-25z' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 
                        rounded-full border border-white/20 mb-6 animate-fade-in">
            <span className="text-lg">🍀</span>
            <span className="text-white/90 text-sm font-medium">Botswana's #1 Agricultural Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 
                       font-display leading-tight animate-fade-in-up">
            Farm Fresh Produce,{' '}
            <span className="text-primary-200">Direct to You</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto 
                      animate-fade-in-up stagger-1">
            Connect with local farmers, discover fresh produce, and support sustainable agriculture 
            across Botswana.
          </p>

          {/* Central Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-8 md:mb-12 animate-fade-in-up stagger-2"
          >
            <div className="flex flex-col sm:flex-row bg-white rounded-xl sm:rounded-full overflow-hidden 
                          shadow-2xl">
              {/* Category Select */}
              <div className="relative border-b sm:border-b-0 sm:border-r border-neutral-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-4 bg-transparent text-neutral-700 
                           font-medium appearance-none cursor-pointer focus:outline-none pr-10"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown 
                  size={18} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" 
                />
              </div>

              {/* Search Input */}
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for maize, tomatoes, cattle, eggs..."
                  className="flex-1 px-4 sm:px-6 py-4 text-neutral-800 placeholder:text-neutral-400 
                           focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="m-2 px-6 sm:px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white 
                           rounded-full sm:rounded-full font-semibold transition-all duration-200 
                           flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Search size={20} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 md:mb-14 
                        animate-fade-in-up stagger-3">
            <span className="text-white/60 text-sm">Popular:</span>
            {['Maize', 'Tomatoes', 'Cattle', 'Fresh Eggs', 'Vegetables'].map((item) => (
              <Link
                key={item}
                to={`/listings?search=${item}`}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm 
                         rounded-full transition-colors border border-white/20"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up stagger-4">
            {trustBadges.map((badge, index) => (
              <div 
                key={badge.text}
                className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm 
                         rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                <badge.icon size={28} className={badge.color} />
                <span className="text-white text-sm font-medium text-center">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-14 
                        animate-fade-in-up stagger-5">
            <Link
              to="/listings"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-xl font-bold 
                       text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all 
                       flex items-center justify-center gap-2 group"
            >
              Browse Marketplace
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register?role=farmer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white rounded-xl font-bold 
                       text-lg border-2 border-white/50 hover:bg-white/10 hover:-translate-y-0.5 
                       transition-all flex items-center justify-center gap-2"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#f5f5f5"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
