/**
 * Product Grid Component
 * Amazon-style grid of 16 placeholder product cards
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ShoppingCart, Eye } from 'lucide-react';

const ProductGrid = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Placeholder products data
  const products = [
    {
      id: 1,
      title: 'Organic White Maize',
      price: 850,
      originalPrice: 950,
      unit: '50kg bag',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 124,
      location: 'Gaborone',
      seller: 'Thabo Farms',
      inStock: true,
      discount: 11,
    },
    {
      id: 2,
      title: 'Farm Fresh Eggs (30)',
      price: 95,
      originalPrice: null,
      unit: 'tray',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 89,
      location: 'Francistown',
      seller: 'Happy Hens',
      inStock: true,
      discount: null,
    },
    {
      id: 3,
      title: 'Premium Beef Cuts',
      price: 120,
      originalPrice: 140,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 56,
      location: 'Maun',
      seller: 'Kalahari Ranch',
      inStock: true,
      discount: 14,
    },
    {
      id: 4,
      title: 'Red Tomatoes (5kg)',
      price: 45,
      originalPrice: null,
      unit: 'crate',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 203,
      location: 'Kasane',
      seller: 'Green Valley',
      inStock: true,
      discount: null,
    },
    {
      id: 5,
      title: 'Pure Raw Honey (1L)',
      price: 180,
      originalPrice: 220,
      unit: 'jar',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
      rating: 5.0,
      reviews: 45,
      location: 'Nata',
      seller: 'BeeKeep BW',
      inStock: true,
      discount: 18,
    },
    {
      id: 6,
      title: 'Fresh Farm Milk (5L)',
      price: 65,
      originalPrice: null,
      unit: 'container',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 167,
      location: 'Lobatse',
      seller: 'Dairy Dreams',
      inStock: true,
      discount: null,
    },
    {
      id: 7,
      title: 'Butternut Squash',
      price: 35,
      originalPrice: null,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 78,
      location: 'Palapye',
      seller: 'Sunset Farms',
      inStock: true,
      discount: null,
    },
    {
      id: 8,
      title: 'Free-Range Chicken',
      price: 95,
      originalPrice: 110,
      unit: 'per bird',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 134,
      location: 'Serowe',
      seller: 'Village Poultry',
      inStock: true,
      discount: 14,
    },
    {
      id: 9,
      title: 'Sorghum Grain (25kg)',
      price: 320,
      originalPrice: null,
      unit: 'bag',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      rating: 4.4,
      reviews: 42,
      location: 'Ghanzi',
      seller: 'Heritage Grains',
      inStock: true,
      discount: null,
    },
    {
      id: 10,
      title: 'Fresh Spinach (2kg)',
      price: 28,
      originalPrice: null,
      unit: 'bunch',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 89,
      location: 'Gaborone',
      seller: 'Green Leaf',
      inStock: false,
      discount: null,
    },
    {
      id: 11,
      title: 'Goat Meat (Fresh)',
      price: 135,
      originalPrice: 150,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 67,
      location: 'Kanye',
      seller: 'Local Farmers',
      inStock: true,
      discount: 10,
    },
    {
      id: 12,
      title: 'Onions (10kg bag)',
      price: 55,
      originalPrice: null,
      unit: 'bag',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
      rating: 4.3,
      reviews: 156,
      location: 'Molepolole',
      seller: 'Farm Direct',
      inStock: true,
      discount: null,
    },
    {
      id: 13,
      title: 'Fresh Cabbage',
      price: 18,
      originalPrice: null,
      unit: 'per head',
      image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 98,
      location: 'Jwaneng',
      seller: 'Valley Fresh',
      inStock: true,
      discount: null,
    },
    {
      id: 14,
      title: 'Groundnuts (5kg)',
      price: 145,
      originalPrice: 170,
      unit: 'bag',
      image: 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 73,
      location: 'Selebi-Phikwe',
      seller: 'Nut House',
      inStock: true,
      discount: 15,
    },
    {
      id: 15,
      title: 'Sweet Potatoes',
      price: 40,
      originalPrice: null,
      unit: 'per kg',
      image: 'https://images.unsplash.com/photo-1596097635121-14b38e5b97f2?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 112,
      location: 'Ramotswa',
      seller: 'Root Farms',
      inStock: true,
      discount: null,
    },
    {
      id: 16,
      title: 'Morogo (Wild Spinach)',
      price: 25,
      originalPrice: null,
      unit: 'bunch',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 201,
      location: 'Tlokweng',
      seller: 'Traditional Greens',
      inStock: true,
      discount: null,
    },
  ];

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
              Discover quality produce from verified farmers across Botswana
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
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
                  <img
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

        {/* Load More Button */}
        <div className="text-center mt-10">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-500 
                     text-primary-500 rounded-xl font-semibold hover:bg-primary-500 hover:text-white 
                     transition-colors"
          >
            Explore All Products
            <span className="text-sm font-normal">(2,500+ listings)</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;





