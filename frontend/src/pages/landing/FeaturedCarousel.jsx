/**
 * Featured Carousel Component
 * Horizontal snap-scroll slider showcasing featured products
 */
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from 'lucide-react';

const FeaturedCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Placeholder featured products
  const featuredProducts = [
    {
      id: 1,
      title: 'Premium Organic Maize',
      price: 850,
      unit: 'per 50kg bag',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      location: 'Gaborone',
      seller: 'Thabo Farms',
      badge: 'Best Seller',
      badgeColor: 'bg-orange-500',
    },
    {
      id: 2,
      title: 'Fresh Farm Eggs (30 pack)',
      price: 95,
      unit: 'per tray',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      location: 'Francistown',
      seller: 'Happy Hens Farm',
      badge: 'Top Rated',
      badgeColor: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Grass-Fed Beef (per kg)',
      price: 120,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 56,
      location: 'Maun',
      seller: 'Kalahari Ranch',
      badge: 'Premium',
      badgeColor: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Fresh Tomatoes (5kg)',
      price: 45,
      unit: 'per crate',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      rating: 4.6,
      reviews: 203,
      location: 'Kasane',
      seller: 'Green Valley',
      badge: 'Fresh Pick',
      badgeColor: 'bg-red-500',
    },
    {
      id: 5,
      title: 'Raw Honey (1L Jar)',
      price: 180,
      unit: 'per jar',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
      rating: 5.0,
      reviews: 45,
      location: 'Nata',
      seller: 'BeeKeep Botswana',
      badge: 'Organic',
      badgeColor: 'bg-yellow-500',
    },
    {
      id: 6,
      title: 'Fresh Milk (5L)',
      price: 65,
      unit: 'per container',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 167,
      location: 'Lobatse',
      seller: 'Dairy Dreams',
      badge: 'Daily Fresh',
      badgeColor: 'bg-blue-500',
    },
    {
      id: 7,
      title: 'Butternut Squash (10kg)',
      price: 75,
      unit: 'per bag',
      image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=300&fit=crop',
      rating: 4.5,
      reviews: 78,
      location: 'Palapye',
      seller: 'Sunset Farms',
      badge: 'Seasonal',
      badgeColor: 'bg-amber-500',
    },
    {
      id: 8,
      title: 'Free-Range Chicken',
      price: 95,
      unit: 'per bird',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 134,
      location: 'Serowe',
      seller: 'Village Poultry',
      badge: 'Free Range',
      badgeColor: 'bg-teal-500',
    },
  ];

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
              Updated hourly
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
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/listings/${product.id}`}
                className="group/card flex-shrink-0 w-[260px] md:w-[280px] snap-start"
              >
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden 
                              shadow-card hover:shadow-card-hover transition-all duration-300 
                              hover:-translate-y-1">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;




