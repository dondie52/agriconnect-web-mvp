/**
 * Featured Carousel Component
 * Horizontal snap-scroll slider showcasing featured products
 * Connected to real-time listings data
 */
import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '../../api';
import { UPLOAD_URL } from '../../api';
import { ProductImage } from '../../components/UI';

const FeaturedCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch featured listings with real-time updates (newest first, limit to 10 for carousel)
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: async () => {
      const response = await listingsAPI.getAll({
        page: 1,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      return response.data.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds for real-time updates
    refetchOnWindowFocus: true,
    staleTime: 5000, // Consider data fresh for 5 seconds
  });

  // Transform listings data to match component format
  const featuredProducts = useMemo(() => {
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

      // Determine badge based on how recent the listing is
      const createdAt = new Date(listing.created_at);
      const hoursAgo = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
      const isNew = hoursAgo < 24;
      
      return {
        id: listing.id,
        title: listing.crop_name,
        image: imageUrl,
        seller: listing.farmer_name,
        location: listing.region_name,
        rating: 4.5, // Default rating (can be enhanced later with actual ratings)
        reviews: Math.floor(Math.random() * 50) + 10, // Placeholder reviews
        price: parseFloat(listing.price).toFixed(2),
        unit: listing.unit,
        badge: isNew ? 'New' : listing.crop_category,
        badgeColor: isNew ? 'bg-green-500' : 'bg-primary-500',
      };
    });
  }, [listingsData]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="bg-white py-6 md:py-8 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-primary-500 rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold text-neutral-800 font-display">
              Featured Products
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm text-primary-600 font-medium">
              <Clock size={14} />
              Updated in real-time
            </span>
          </div>
          <Link 
            to="/listings" 
            className="text-primary-500 hover:text-primary-600 font-medium text-sm 
                     flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 
                      bg-white shadow-lg rounded-full flex items-center justify-center 
                      border border-neutral-200 transition-all duration-200
                      ${canScrollLeft 
                        ? 'opacity-100 hover:bg-neutral-50 hover:shadow-xl -translate-x-1/2' 
                        : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-neutral-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 
                      bg-white shadow-lg rounded-full flex items-center justify-center 
                      border border-neutral-200 transition-all duration-200
                      ${canScrollRight 
                        ? 'opacity-100 hover:bg-neutral-50 hover:shadow-xl translate-x-1/2' 
                        : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-neutral-700" />
          </button>

          {/* Products Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                     scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="flex-shrink-0 w-[260px] md:w-[280px] snap-start"
                >
                  <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-card">
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-3 bg-neutral-200 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-neutral-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length === 0 ? (
              // Empty state
              <div className="w-full text-center py-8 text-neutral-500">
                <p>No featured products available at the moment.</p>
                <p className="text-sm mt-2">Check back soon for new listings!</p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/listings/${product.id}`}
                  className="group/card flex-shrink-0 w-[260px] md:w-[280px] snap-start"
                >
                  <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden 
                                shadow-card hover:shadow-card-hover transition-all duration-300 
                                hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full group-hover/card:scale-105 transition-transform duration-300"
                      />
                      {/* Badge */}
                      <span className={`absolute top-3 left-3 ${product.badgeColor} text-white 
                                     text-xs font-semibold px-2.5 py-1 rounded-full shadow-md`}>
                        {product.badge}
                      </span>
                    </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-neutral-800 mb-1 line-clamp-1 
                                 group-hover/card:text-primary-600 transition-colors">
                      {product.title}
                    </h3>

                    {/* Seller & Location */}
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                      <span>{product.seller}</span>
                      <span className="w-1 h-1 bg-neutral-400 rounded-full" />
                      <span className="flex items-center gap-0.5">
                        <MapPin size={12} />
                        {product.location}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-neutral-700">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-400">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-primary-600">
                        P{product.price}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {product.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;





