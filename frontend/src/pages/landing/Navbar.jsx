/**
 * Landing Page Navbar Component
 * Amazon-style sticky navigation with categories dropdown, search bar, and mobile drawer
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  User, 
  ShoppingCart,
  Wheat,
  Apple,
  Carrot,
  Beef,
  Milk,
  Egg,
  Leaf,
  TreeDeciduous,
  LayoutDashboard,
  LogOut,
  Tractor,
  ShoppingBag,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCartCount } from '../../hooks/useApi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { isAuthenticated, user, isFarmer, isBuyer, logout } = useAuth();
  const { data: cartCount } = useCartCount();

  const categories = [
    { name: 'All Categories', value: 'All', icon: Search },
    { name: 'Grains & Cereals', value: 'grains', icon: Wheat },
    { name: 'Vegetables', value: 'vegetables', icon: Carrot },
    { name: 'Fruits', value: 'fruits', icon: Apple },
    { name: 'Livestock', value: 'livestock', icon: Beef },
    { name: 'Dairy Products', value: 'dairy', icon: Milk },
    { name: 'Poultry & Eggs', value: 'poultry', icon: Egg },
    { name: 'Organic Produce', value: 'organic', icon: Leaf },
    { name: 'Tree Crops', value: 'tree-crops', icon: TreeDeciduous },
  ];

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (isFarmer) return '/farmer/dashboard';
    if (isBuyer) return '/buyer/dashboard';
    return '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to listings with search query
    window.location.href = `/listings?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (isFarmer) return 'bg-primary-500';
    if (isBuyer) return 'bg-secondary-500';
    return 'bg-neutral-500';
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-nav' 
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-primary-500 text-white py-1.5 text-center text-sm hidden md:block">
          <span className="font-medium">Fresh from Botswana's farms</span>
          <span className="mx-2">•</span>
          <span>Free delivery on orders over P500</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-3xl group-hover:scale-110 transition-transform">🍀</span>
              <span className="text-xl md:text-2xl font-bold text-primary-500 font-display hidden sm:block">
                AgriConnect
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full rounded-lg overflow-hidden border-2 border-primary-500 hover:border-primary-600 focus-within:border-primary-600 transition-colors">
                {/* Category Dropdown */}
                <div className="relative" ref={categoriesRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="h-full px-4 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1 
                             text-sm text-neutral-700 font-medium border-r border-neutral-300 transition-colors"
                  >
                    <span className="hidden lg:inline">{selectedCategory === 'All' ? 'All' : selectedCategory}</span>
                    <span className="lg:hidden">All</span>
                    <ChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.value);
                            setIsCategoriesOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-primary-50 transition-colors
                                    ${selectedCategory === cat.value ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}
                        >
                          <cat.icon size={18} className="text-neutral-500" />
                          <span className="text-sm">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for fresh produce, livestock, grains..."
                  className="flex-1 px-4 py-3 text-neutral-800 placeholder:text-neutral-400 
                           focus:outline-none min-w-0"
                />

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-6 bg-primary-500 hover:bg-primary-600 text-white transition-colors
                           flex items-center justify-center"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Cart Icon - Mobile/Desktop (only for buyers) */}
              {isAuthenticated && isBuyer && (
                <Link
                  to="/buyer/cart"
                  className="p-2 text-neutral-600 hover:text-primary-500 transition-colors relative"
                >
                  <ShoppingCart size={24} />
                  {(cartCount || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-xs 
                                   rounded-full flex items-center justify-center font-medium">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Authenticated User Menu - Desktop */}
              {isAuthenticated ? (
                <div className="hidden md:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 ${getRoleBadgeColor()} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {getUserInitials()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-neutral-800 line-clamp-1 max-w-[100px]">
                        {user?.name?.split(' ')[0] || 'User'}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown size={16} className={`text-neutral-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-fade-in">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="font-semibold text-neutral-800">{user?.name}</p>
                        <p className="text-sm text-neutral-500">{user?.phone}</p>
                        <span className={`inline-flex items-center gap-1 mt-2 px-2 py-1 ${getRoleBadgeColor()} text-white text-xs font-medium rounded-full`}>
                          {isFarmer && <Tractor size={12} />}
                          {isBuyer && <ShoppingBag size={12} />}
                          <span className="capitalize">{user?.role}</span>
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to={getDashboardRoute()}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          <span>Dashboard</span>
                        </Link>
                        
                        {isFarmer && (
                          <Link
                            to="/farmer/my-listings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <ShoppingBag size={18} />
                            <span>My Listings</span>
                          </Link>
                        )}

                        <Link
                          to="/notifications"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <Bell size={18} />
                          <span>Notifications</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-neutral-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Register - Desktop (Not authenticated) */
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-primary-500 
                             font-medium transition-colors"
                  >
                    <User size={20} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg 
                             font-medium transition-colors shadow-sm hover:shadow-md"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-neutral-700 hover:text-primary-500 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex rounded-lg overflow-hidden border-2 border-primary-500">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 bg-primary-500 text-white"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Categories Bar - Desktop */}
        <div className="hidden md:block bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-6 py-2 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 font-medium hover:text-primary-100 transition-colors shrink-0"
              >
                <Menu size={18} />
                <span>All Categories</span>
              </button>
              <div className="h-5 w-px bg-primary-400" />
              {categories.slice(1, 6).map((cat) => (
                <Link
                  key={cat.value}
                  to={`/listings?category=${cat.value}`}
                  className="text-sm hover:text-primary-100 transition-colors whitespace-nowrap shrink-0"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                to="/listings"
                className="text-sm hover:text-primary-100 transition-colors whitespace-nowrap shrink-0"
              >
                Today's Deals
              </Link>
              <Link
                to="/register?role=farmer"
                className="text-sm hover:text-primary-100 transition-colors whitespace-nowrap shrink-0"
              >
                Sell on AgriConnect
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div 
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl 
                    transform transition-transform duration-300 ${
                      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
        >
          {/* Drawer Header - Authenticated */}
          {isAuthenticated ? (
            <div className={`${getRoleBadgeColor()} text-white p-4`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-white/80 capitalize flex items-center gap-1">
                    {isFarmer && <Tractor size={14} />}
                    {isBuyer && <ShoppingBag size={14} />}
                    {user?.role}
                  </p>
                </div>
              </div>
              <Link
                to={getDashboardRoute()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
            </div>
          ) : (
            /* Drawer Header - Not Authenticated */
            <div className="bg-primary-500 text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User size={22} />
              </div>
              <div>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium hover:underline"
                >
                  Sign In
                </Link>
                <span className="mx-2">or</span>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium hover:underline"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* Drawer Content */}
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {/* User Quick Links (Authenticated) */}
            {isAuthenticated && (
              <div className="p-4 border-b border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3">
                  My Account
                </h3>
                <div className="space-y-1">
                  {isFarmer && (
                    <>
                      <Link
                        to="/farmer/my-listings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                                 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <ShoppingBag size={20} className="text-neutral-500" />
                        <span>My Listings</span>
                      </Link>
                      <Link
                        to="/farmer/create-listing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                                 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <Tractor size={20} className="text-neutral-500" />
                        <span>Post Product</span>
                      </Link>
                    </>
                  )}
                  {isBuyer && (
                    <>
                      <Link
                        to="/buyer/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                                 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart size={20} className="text-neutral-500" />
                          <span>Shopping Cart</span>
                        </div>
                        {(cartCount || 0) > 0 && (
                          <span className="w-6 h-6 bg-secondary-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {cartCount > 9 ? '9+' : cartCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/buyer/my-orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                                 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        <ShoppingBag size={20} className="text-neutral-500" />
                        <span>My Orders</span>
                      </Link>
                    </>
                  )}
                  <Link
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                             hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <Bell size={20} className="text-neutral-500" />
                    <span>Notifications</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="p-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3">
                Shop by Category
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    to={`/listings?category=${cat.value}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                             hover:text-primary-600 rounded-lg transition-colors"
                  >
                    <cat.icon size={20} className="text-neutral-500" />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <div className="space-y-1">
                <Link
                  to="/register?role=farmer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                           hover:text-primary-600 rounded-lg transition-colors"
                >
                  Become a Seller
                </Link>
                <Link
                  to="/listings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                           hover:text-primary-600 rounded-lg transition-colors"
                >
                  Browse Marketplace
                </Link>
                <Link
                  to="/prices"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                           hover:text-primary-600 rounded-lg transition-colors"
                >
                  Market Prices
                </Link>
              </div>
            </div>

            {/* Help & Settings */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-3">
                Help & Settings
              </h3>
              <div className="space-y-1">
                <a
                  href="#help"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                           hover:text-primary-600 rounded-lg transition-colors"
                >
                  Customer Service
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-neutral-700 hover:bg-primary-50 
                           hover:text-primary-600 rounded-lg transition-colors"
                >
                  Contact Us
                </a>
                
                {/* Logout button (Authenticated) */}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 
                             rounded-lg transition-colors w-full mt-4"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-28 md:h-36" />
    </>
  );
};

export default Navbar;
