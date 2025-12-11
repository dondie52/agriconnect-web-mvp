/**
 * Product Grid Component
 * Amazon-style grid of product cards with real-time data
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI, UPLOAD_URL } from '../../api';
import { ProductImage } from '../../components/UI';

const ProductGrid = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('featured');

  // Fetch listings with real-time updates
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['productGridListings', sortBy],
    queryFn: async () => {
      const params = {
        page: 1,
        limit: 16, // Show 16 products in the grid
      };

      // Apply sorting based on selected option
      switch (sortBy) {
        case 'price-low':
          params.sort_by = 'price';
          params.sort_order = 'asc';
          break;
        case 'price-high':
          params.sort_by = 'price';
          params.sort_order = 'desc';
          break;
        case 'newest':
          params.sort_by = 'created_at';
          params.sort_order = 'desc';
          break;
        case 'rating':
          // For rating, we'll sort by newest as a fallback since rating isn't in the API yet
          params.sort_by = 'created_at';
          params.sort_order = 'desc';
          break;
        case 'featured':
        default:
          params.sort_by = 'created_at';
          params.sort_order = 'desc';
          break;
      }

      const response = await listingsAPI.getAll(params);
      return response.data.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
    refetchOnWindowFocus: true,
    staleTime: 5000, // Consider data fresh for 5 seconds
  });

  // Transform listings data to match component format
  const products = useMemo(() => {
    if (!listingsData?.listings) return [];
    
    return listingsData.listings.map((listing) => {
      // Parse images
      let images = [];
      try {
        if (Array.isArray(listing.images)) {
          images = listing.images;
        } else if (typeof listing.images === 'string') {
          images = JSON.parse(listing.images);
        }
      } catch (e) {
        images = [];
      }
      
      const firstImage = images[0];
      const imageUrl = firstImage 
        ? (firstImage.startsWith('http') ? firstImage : `${UPLOAD_URL}/${firstImage}`)
        : null;

      // Determine if product is in stock
      const inStock = parseFloat(listing.quantity) > 0;

      // Calculate discount if original price exists (placeholder logic)
      const discount = null; // Can be enhanced later with actual discount data

      return {
        id: listing.id,
        title: listing.crop_name,
        image: imageUrl,
        seller: listing.farmer_name,
        location: listing.region_name,
        rating: 4.5, // Default rating (can be enhanced later with actual ratings)
        reviews: Math.floor(Math.random() * 50) + 10, // Placeholder reviews
        price: parseFloat(listing.price).toFixed(2),
        originalPrice: null, // Can be enhanced later
        unit: listing.unit,
        discount: discount,
        inStock: inStock,
      };
    });
  }, [listingsData]);

  const toggleFavorite = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 font-display mb-2">
              Fresh From the Farm
            </h2>
            <p className="text-neutral-600">
              Discover quality produce from farmers across Botswana
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="newest">Newest</option>
            </select>
            <Link 
              to="/listings"
              className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg 
                       font-medium transition-colors hidden sm:block"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden 
                          shadow-sm h-full flex flex-col animate-pulse"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-200" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="h-3 bg-neutral-200 rounded w-2/3" />
                  <div className="h-6 bg-neutral-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg mb-2">No products available at the moment.</p>
            <p className="text-neutral-400 text-sm">Check back soon for new listings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
            <Link
              key={product.id}
              to={`/listings/${product.id}`}
              className="group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden 
                            shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold 
                                  px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 
                                ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                ${favorites.includes(product.id) 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-white text-neutral-600 hover:text-red-500'}`}
                    >
                      <Heart size={16} className={favorites.includes(product.id) ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center 
                               text-neutral-600 hover:text-primary-500 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* Quick Add Button */}
                  <div className={`absolute bottom-0 left-0 right-0 p-2 transition-transform duration-300
                                ${hoveredProduct === product.id ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white 
                               rounded-lg font-medium text-sm flex items-center justify-center gap-2 
                               transition-colors"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-neutral-500 mb-1">
                    <MapPin size={12} />
                    <span>{product.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-neutral-800 mb-1 line-clamp-2 text-sm md:text-base 
                               group-hover:text-primary-600 transition-colors flex-1">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-neutral-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-bold text-primary-600">
                      P{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        P{product.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500">/{product.unit}</span>
                  </div>

                  {/* Seller */}
                  <p className="text-xs text-neutral-500 mt-1">
                    by {product.seller}
                  </p>
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-10">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-500 
                     text-primary-500 rounded-xl font-semibold hover:bg-primary-500 hover:text-white 
                     transition-colors"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;





