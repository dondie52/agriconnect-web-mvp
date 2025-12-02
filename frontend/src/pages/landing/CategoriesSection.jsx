/**
 * Categories Section Component
 * Grid/carousel of category cards with icons and titles
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wheat, 
  Apple, 
  Carrot, 
  Beef, 
  Milk, 
  Egg, 
  Leaf, 
  Flower2,
  Fish,
  Coffee,
  Grape,
  TreeDeciduous
} from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    {
      id: 'grains',
      name: 'Grains & Cereals',
      icon: Wheat,
      count: 342,
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=200&fit=crop',
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      icon: Carrot,
      count: 567,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop',
    },
    {
      id: 'fruits',
      name: 'Fruits',
      icon: Apple,
      count: 234,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop',
    },
    {
      id: 'livestock',
      name: 'Livestock & Meat',
      icon: Beef,
      count: 189,
      color: 'from-rose-400 to-rose-600',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=200&h=200&fit=crop',
    },
    {
      id: 'dairy',
      name: 'Dairy Products',
      icon: Milk,
      count: 156,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    },
    {
      id: 'poultry',
      name: 'Poultry & Eggs',
      icon: Egg,
      count: 298,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
    },
    {
      id: 'organic',
      name: 'Organic Produce',
      icon: Leaf,
      count: 145,
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    },
    {
      id: 'herbs',
      name: 'Herbs & Spices',
      icon: Flower2,
      count: 87,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      image: 'https://images.unsplash.com/photo-1509358271058-adc39f7f8cf4?w=200&h=200&fit=crop',
    },
    {
      id: 'fish',
      name: 'Fish & Seafood',
      icon: Fish,
      count: 63,
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=200&h=200&fit=crop',
    },
    {
      id: 'beverages',
      name: 'Beverages',
      icon: Coffee,
      count: 42,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
    },
    {
      id: 'wine',
      name: 'Wine & Grapes',
      icon: Grape,
      count: 28,
      color: 'from-violet-400 to-violet-600',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=200&h=200&fit=crop',
    },
    {
      id: 'tree-crops',
      name: 'Tree Crops',
      icon: TreeDeciduous,
      count: 94,
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop',
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-3xl mb-3">🛒</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 font-display mb-3">
            Shop by Category
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Browse our wide selection of agricultural products organized by category
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/listings?category=${category.id}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="bg-white rounded-2xl p-4 md:p-5 text-center shadow-card hover:shadow-card-hover 
                            transition-all duration-300 hover:-translate-y-1 border border-neutral-100
                            hover:border-primary-200">
                {/* Icon Container */}
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl ${category.bgColor} 
                              flex items-center justify-center mb-3 group-hover:scale-110 
                              transition-transform duration-300`}>
                  <category.icon size={32} className={category.iconColor} />
                </div>

                {/* Category Name */}
                <h3 className="font-semibold text-neutral-800 text-sm md:text-base mb-1 
                             group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>

                {/* Item Count */}
                <p className="text-xs text-neutral-500">
                  {category.count} products
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Categories Banner */}
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {/* Fresh Produce Banner */}
          <div className="relative rounded-2xl overflow-hidden h-48 md:col-span-2 group">
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop"
              alt="Fresh Produce"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <span className="text-primary-400 text-sm font-semibold mb-1">Fresh Daily</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 font-display">
                Farm Fresh Vegetables
              </h3>
              <p className="text-white/80 text-sm mb-4 max-w-xs">
                Direct from local farms to your table
              </p>
              <Link
                to="/listings?category=vegetables"
                className="w-fit px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg 
                         font-medium text-sm transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Organic Banner */}
          <div className="relative rounded-2xl overflow-hidden h-48 group">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
              alt="Organic Products"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-green-400 text-xs font-semibold mb-1">100% Organic</span>
              <h3 className="text-white text-xl font-bold mb-3 font-display">
                Go Organic
              </h3>
              <Link
                to="/listings?category=organic"
                className="w-fit px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg 
                         font-medium text-sm transition-colors backdrop-blur-sm"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">12</div>
              <div className="text-neutral-600 text-sm">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">2,500+</div>
              <div className="text-neutral-600 text-sm">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">500+</div>
              <div className="text-neutral-600 text-sm">Verified Sellers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-1">50+</div>
              <div className="text-neutral-600 text-sm">Regions Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;


