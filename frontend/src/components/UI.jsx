/**
 * Reusable UI Components for AgriConnect
 */
import React from 'react';
import { UPLOAD_URL } from '../api';

// Loading Spinner
export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`spinner ${sizeClasses[size]}`} />
  );
};

// Loading Overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-neutral-600">{message}</p>
    </div>
  </div>
);

// Page Loading
export const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
);

// Empty State
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-neutral-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-neutral-700 mb-2">{title}</h3>
    {description && <p className="text-neutral-500 mb-4 max-w-md">{description}</p>}
    {action && action}
  </div>
);

// Card Component
export const Card = ({ children, className = '', onClick, hover = true }) => (
  <div 
    className={`card ${hover ? 'hover:shadow-card-hover cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Stat Card
export const StatCard = ({ icon: Icon, label, value, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  return (
    <span className={`badge ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Status Badge
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Active', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'error' },
    completed: { label: 'Completed', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'error' },
    sold: { label: 'Sold', variant: 'info' },
    expired: { label: 'Expired', variant: 'default' },
    open: { label: 'Open', variant: 'success' },
    closed: { label: 'Closed', variant: 'default' },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-neutral-600 hover:bg-neutral-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} inline-flex items-center justify-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

// Input Component
export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={`input-field ${error ? 'border-red-500' : ''}`} {...props} />
    {error && <p className="error-text">{error}</p>}
  </div>
));

// Select Component
export const Select = React.forwardRef(({ label, error, options = [], placeholder, className = '', ...props }, ref) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <select ref={ref} className={`select-field ${error ? 'border-red-500' : ''}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="error-text">{error}</p>}
  </div>
));

// Textarea Component
export const Textarea = React.forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <textarea 
      ref={ref} 
      className={`input-field min-h-[100px] ${error ? 'border-red-500' : ''}`} 
      {...props} 
    />
    {error && <p className="error-text">{error}</p>}
  </div>
));

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-fadeIn`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Image with fallback
export const ProductImage = ({ src, alt, className = '' }) => {
  const [error, setError] = React.useState(false);
  
  const imageUrl = src && !error 
    ? (src.startsWith('http') ? src : `${UPLOAD_URL}/${src}`)
    : null;

  if (!imageUrl) {
    return (
      <div className={`bg-neutral-200 flex items-center justify-center ${className}`}>
        <span className="text-4xl">🌾</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
};

// Pagination Component
export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100"
      >
        Previous
      </button>
      
      <span className="px-4 py-1 text-neutral-600">
        Page {page} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100"
      >
        Next
      </button>
    </div>
  );
};

// Price Change Indicator
export const PriceChange = ({ change }) => {
  if (!change || change === 0) return <span className="text-neutral-500">-</span>;
  
  const isPositive = change > 0;
  
  return (
    <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(change)}%
    </span>
  );
};

export default {
  Spinner,
  LoadingOverlay,
  PageLoading,
  EmptyState,
  Card,
  StatCard,
  Badge,
  StatusBadge,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  ProductImage,
  Pagination,
  PriceChange,
};
