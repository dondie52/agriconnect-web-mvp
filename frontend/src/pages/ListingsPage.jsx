/**
 * Listings Page for AgriConnect
 * Browse and filter produce listings
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useListings, useCrops, useRegions } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { 
  Card, 
  Select, 
  Input, 
  PageLoading, 
  EmptyState, 
  Pagination,
  ProductImage,
  Badge 
} from '../components/UI';
import { Search, Filter, MapPin, ShoppingBag } from 'lucide-react';

const ListingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [filters, setFilters] = useState({
    crop_id: '',
    region_id: '',
    min_price: '',
    max_price: '',
    search: '',
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: listingsData, isLoading } = useListings(filters);
  const { data: crops } = useCrops();
  const { data: regions } = useRegions();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      crop_id: '',
      region_id: '',
      min_price: '',
      max_price: '',
      search: '',
      page: 1,
    });
  };

  const cropOptions = crops?.map(c => ({ value: c.id, label: c.name })) || [];
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) || [];

  const listings = listingsData?.listings || [];
  const totalPages = listingsData?.totalPages || 1;

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-title">Browse Listings</h1>
            <p className="text-neutral-500 mt-1">
              Find fresh produce from farmers across Botswana
            </p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search produce..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            {(filters.crop_id || filters.region_id || filters.min_price || filters.max_price) && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-500 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <Select
                label="Crop Type"
                value={filters.crop_id}
                onChange={(e) => handleFilterChange('crop_id', e.target.value)}
                options={cropOptions}
                placeholder="All Crops"
              />
              <Select
                label="Region"
                value={filters.region_id}
                onChange={(e) => handleFilterChange('region_id', e.target.value)}
                options={regionOptions}
                placeholder="All Regions"
              />
              <Input
                label="Min Price (P)"
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
                placeholder="0"
              />
              <Input
                label="Max Price (P)"
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                placeholder="Any"
              />
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <PageLoading />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No listings found"
            description="Try adjusting your filters or check back later for new produce."
            action={
              filters.crop_id || filters.region_id ? (
                <button onClick={clearFilters} className="btn-outline">
                  Clear Filters
                </button>
              ) : null
            }
          />
        ) : (
          <>
            <p className="text-neutral-500">
              Showing {listings.length} of {listingsData?.total || 0} listings
            </p>
            
            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => navigate(`/listings/${listing.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

// Listing Card Component
const ListingCard = ({ listing, onClick }) => {
  let images = [];
  try {
    // Handle both array and JSON string formats
    if (Array.isArray(listing.images)) {
      images = listing.images;
    } else if (typeof listing.images === 'string') {
      images = JSON.parse(listing.images);
    }
  } catch (e) {
    images = [];
  }
  const firstImage = images[0];

  return (
    <Card onClick={onClick} className="overflow-hidden">
      {/* Image */}
      <div className="h-48 -m-6 mb-4 overflow-hidden">
        <ProductImage
          src={firstImage}
          alt={listing.crop_name}
          className="w-full h-full"
        />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-neutral-800">
            {listing.crop_name}
          </h3>
          <Badge>{listing.crop_category}</Badge>
        </div>
        
        <p className="text-2xl font-bold text-primary-600">
          P{listing.price}/{listing.unit}
        </p>
        
        <p className="text-neutral-600">
          {listing.quantity} {listing.unit} available
        </p>
        
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <MapPin size={14} />
          <span>{listing.region_name}</span>
        </div>
        
        <p className="text-sm text-neutral-500 pt-2 border-t">
          by {listing.farmer_name}
        </p>
      </div>
    </Card>
  );
};

export default ListingsPage;
