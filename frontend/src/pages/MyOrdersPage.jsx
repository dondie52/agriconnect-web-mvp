/**
 * My Orders Page for AgriConnect
 * Shows orders placed by buyers
 * Enhanced with expandable cards, search, filters with counts, and quick actions
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerOrders } from '../hooks/useApi';
import { Layout } from '../components/Layout';
import { Card, PageLoading, EmptyState } from '../components/UI';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  MapPin,
  Phone,
  Calendar,
  Search,
  X,
  Copy,
  Check,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';

// Status configuration with border colors for visual indicator
const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-700', 
    icon: Clock,
    borderColor: 'border-l-yellow-500'
  },
  accepted: { 
    label: 'Accepted', 
    color: 'bg-blue-100 text-blue-700', 
    icon: CheckCircle,
    borderColor: 'border-l-blue-500'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-700', 
    icon: XCircle,
    borderColor: 'border-l-red-500'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-700', 
    icon: CheckCircle,
    borderColor: 'border-l-green-500'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-neutral-100 text-neutral-700', 
    icon: XCircle,
    borderColor: 'border-l-neutral-400'
  },
};

// Main statuses shown in filter row
const mainStatuses = ['', 'pending', 'accepted', 'completed'];
// Secondary statuses in "More" dropdown
const moreStatuses = ['rejected', 'cancelled'];

const MyOrdersPage = () => {
  // Core state
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI state
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [isStatusGuideOpen, setIsStatusGuideOpen] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  
  // Refs
  const moreDropdownRef = useRef(null);
  
  // Fetch all orders (we'll filter client-side for search)
  const { data: ordersData, isLoading } = useBuyerOrders({});
  const allOrders = ordersData?.orders || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear copied feedback after 2 seconds
  useEffect(() => {
    if (copiedPhoneId) {
      const timer = setTimeout(() => setCopiedPhoneId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPhoneId]);

  // Format date to relative format
  const formatRelativeDate = (date) => {
    const orderDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time for comparison
    const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    const diffTime = todayOnly - orderDateOnly;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays >= 2 && diffDays <= 7) return `${diffDays} days ago`;
    
    return orderDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate status counts from all orders
  const statusCounts = useMemo(() => {
    const counts = { all: allOrders.length };
    Object.keys(statusConfig).forEach(status => {
      counts[status] = allOrders.filter(o => o.status === status).length;
    });
    return counts;
  }, [allOrders]);

  // Filter orders by status and search query
  const filteredOrders = useMemo(() => {
    let result = allOrders;
    
    // Filter by status
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(order => 
        order.crop_name?.toLowerCase().includes(query) ||
        order.farmer_name?.toLowerCase().includes(query) ||
        order.region_name?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [allOrders, statusFilter, searchQuery]);

  // Check if filters/search are active
  const hasActiveFilters = statusFilter || searchQuery.trim();
  const hasNoResults = filteredOrders.length === 0 && hasActiveFilters;
  const hasNoOrders = allOrders.length === 0;

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Copy phone to clipboard
  const handleCopyPhone = async (phone, orderId, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhoneId(orderId);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
  };

  // Format WhatsApp link
  const getWhatsAppLink = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="text-neutral-500 mt-1">
              Track your orders from farmers
            </p>
          </div>
          <Link
            to="/listings"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <ShoppingBag size={18} />
            Browse Listings
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by crop, farmer, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Status Filters with Counts */}
        <Card className="flex flex-wrap items-center gap-2" hover={false}>
          {/* Main status filters */}
          {mainStatuses.map((status) => (
            <button
              key={status || 'all'}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {status ? statusConfig[status]?.label : 'All Orders'} 
              <span className="ml-1 opacity-75">
                ({status ? statusCounts[status] : statusCounts.all})
              </span>
            </button>
          ))}
          
          {/* More dropdown for less common statuses */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                moreStatuses.includes(statusFilter)
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <MoreHorizontal size={16} />
              More
              <ChevronDown size={14} className={`transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMoreDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                {moreStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsMoreDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between ${
                      statusFilter === status ? 'bg-primary-50 text-primary-600' : 'text-neutral-600'
                    }`}
                  >
                    {statusConfig[status]?.label}
                    <span className="text-neutral-400">({statusCounts[status]})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <PageLoading />
        ) : hasNoOrders ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Browse listings and place your first order!"
            action={
              <Link to="/listings" className="btn-primary">
                Browse Listings
              </Link>
            }
          />
        ) : hasNoResults ? (
          <EmptyState
            icon={Search}
            title="No matching orders"
            description={`No orders found for "${searchQuery || statusConfig[statusFilter]?.label}"`}
            action={
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const isExpanded = expandedOrders.has(order.id);
              const isCopied = copiedPhoneId === order.id;

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden transition-all hover:shadow-md border-l-4 ${status.borderColor}`}
                >
                  {/* Clickable header area */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-neutral-800">
                            {order.crop_name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          {/* Expansion chevron */}
                          <button className="ml-auto md:hidden text-neutral-400">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Package size={16} className="text-neutral-400" />
                            <span>{order.quantity} {order.unit || 'kg'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <span className="font-semibold text-primary-600">
                              P{order.total_price?.toFixed(2) || (order.unit_price * order.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Calendar size={16} className="text-neutral-400" />
                            <span>{formatRelativeDate(order.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin size={16} className="text-neutral-400" />
                            <span>{order.region_name || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Farmer Info - Always visible */}
                        <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="text-sm text-neutral-500">Farmer:</span>
                          <span className="text-sm font-medium">{order.farmer_name}</span>
                          
                          {/* Quick Contact Actions - Always visible */}
                          {order.farmer_phone && (
                            <div className="flex items-center gap-1 ml-auto" onClick={(e) => e.stopPropagation()}>
                              {/* Call Button */}
                              <a 
                                href={`tel:${order.farmer_phone}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                                title="Call farmer"
                              >
                                <Phone size={14} />
                                <span className="hidden sm:inline">Call</span>
                              </a>
                              
                              {/* Copy Button */}
                              <button
                                onClick={(e) => handleCopyPhone(order.farmer_phone, order.id, e)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                  isCopied 
                                    ? 'bg-green-50 text-green-600' 
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                }`}
                                title={isCopied ? 'Copied!' : 'Copy phone number'}
                              >
                                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                              
                              {/* WhatsApp Button */}
                              <a
                                href={getWhatsAppLink(order.farmer_phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="Message on WhatsApp"
                              >
                                <MessageCircle size={14} />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions & Expand Button - Desktop */}
                      <div className="hidden md:flex items-center gap-2">
                        <Link
                          to={`/listings/${order.listing_id}`}
                          className="flex items-center gap-1 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Listing
                          <ChevronRight size={16} />
                        </Link>
                        <button className="text-neutral-400 hover:text-neutral-600 p-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-neutral-100 animate-fadeIn">
                      <div className="pt-4 space-y-3">
                        {/* Notes */}
                        {order.notes && (
                          <div className="text-sm">
                            <span className="font-medium text-neutral-700">Notes:</span>
                            <p className="text-neutral-600 mt-1">{order.notes}</p>
                          </div>
                        )}
                        
                        {/* Order Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-neutral-700">Order ID:</span>
                            <p className="text-neutral-600">#{order.id}</p>
                          </div>
                          <div>
                            <span className="font-medium text-neutral-700">Unit Price:</span>
                            <p className="text-neutral-600">P{order.unit_price?.toFixed(2)}/{order.unit || 'kg'}</p>
                          </div>
                          {order.farmer_phone && (
                            <div>
                              <span className="font-medium text-neutral-700">Phone:</span>
                              <p className="text-neutral-600">{order.farmer_phone}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-neutral-700">Created:</span>
                            <p className="text-neutral-600">
                              {new Date(order.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* View Listing - Mobile */}
                        <div className="md:hidden pt-2">
                          <Link
                            to={`/listings/${order.listing_id}`}
                            className="flex items-center justify-center gap-1 w-full px-4 py-2 text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                          >
                            View Listing
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsible Status Guide */}
        <Card className="bg-primary-50 border border-primary-100" hover={false}>
          <button
            onClick={() => setIsStatusGuideOpen(!isStatusGuideOpen)}
            className="w-full flex items-center justify-between"
          >
            <h4 className="font-semibold text-primary-800">
              💡 Order Status Guide
            </h4>
            {isStatusGuideOpen ? (
              <ChevronUp size={20} className="text-primary-600" />
            ) : (
              <ChevronDown size={20} className="text-primary-600" />
            )}
          </button>
          
          {isStatusGuideOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-primary-100 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></span>
                <span className="text-sm text-primary-700">Pending - Awaiting response</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span className="text-sm text-primary-700">Accepted - Ready for pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                <span className="text-sm text-primary-700">Completed - Fulfilled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                <span className="text-sm text-primary-700">Rejected - Declined</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-neutral-400 flex-shrink-0"></span>
                <span className="text-sm text-primary-700">Cancelled - Cancelled</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default MyOrdersPage;
