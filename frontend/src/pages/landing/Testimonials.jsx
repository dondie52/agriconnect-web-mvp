/**
 * Testimonials Section Component
 * Farmer testimonial cards with dark gradient background
 */
import React from 'react';
import { Quote, Star, BadgeCheck } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Thabo Molefe',
      role: 'Maize Farmer',
      location: 'Gaborone',
      image: '👨‍🌾',
      quote: 'AgriConnect transformed my farming business. Now I sell directly to hotels and restaurants without middlemen! My income has increased by 40% since joining.',
      rating: 5,
      highlight: 'Income increased 40%',
      verified: true,
      sales: 'P25,000+ in sales',
    },
    {
      name: 'Keitumetse Banda',
      role: 'Vegetable Farmer',
      location: 'Francistown',
      image: '👩‍🌾',
      quote: 'Weather alerts saved my entire harvest last season. I moved my tomatoes before the heavy rains hit. This platform is a game-changer for smallholder farmers!',
      rating: 5,
      highlight: 'Saved entire harvest',
      verified: true,
      sales: '200+ orders fulfilled',
    },
    {
      name: 'Mpho Setshwane',
      role: 'Livestock Farmer',
      location: 'Maun',
      image: '👨‍🌾',
      quote: 'The market price feature helps me know when to sell. I no longer get cheated by buyers offering below-market rates. Finally, fair prices for our hard work!',
      rating: 5,
      highlight: 'Fair market prices',
      verified: true,
      sales: '50+ cattle sold',
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-5 10-15 15-25 15 10 5 15 15 15 25 5-10 15-15 25-15-10-5-15-15-15-25z' fill='white' fill-opacity='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-8xl opacity-5 select-none">🍀</div>
      <div className="absolute bottom-10 right-10 text-8xl opacity-5 select-none">🌾</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white 
                        text-sm font-medium px-4 py-2 rounded-full border border-white/20 mb-6">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            Trusted by Farmers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
            What Our Farmers Say
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join hundreds of farmers who have transformed their agricultural business with AgriConnect
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 
                       border border-white/10 hover:border-white/20 transition-all duration-300
                       hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 rounded-full 
                            flex items-center justify-center shadow-lg">
                <Quote size={18} className="text-white" />
              </div>

              {/* Highlight Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 
                            text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                {testimonial.highlight}
              </div>

              {/* Quote */}
              <p className="text-white/90 leading-relaxed mb-6 text-base md:text-lg">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className="text-yellow-400 fill-yellow-400" 
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 
                              rounded-full flex items-center justify-center text-3xl 
                              group-hover:scale-110 transition-transform shadow-lg">
                  {testimonial.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white font-display">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <BadgeCheck size={16} className="text-primary-400" />
                    )}
                  </div>
                  <p className="text-sm text-white/60">
                    {testimonial.role} • {testimonial.location}
                  </p>
                  <p className="text-xs text-primary-400 mt-1">
                    {testimonial.sales}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-14 md:mt-20 bg-gradient-to-r from-primary-600 to-primary-500 
                      rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Farmers' },
              { value: 'P500K+', label: 'Total Sales' },
              { value: '2,500+', label: 'Products Listed' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-display">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <BadgeCheck size={18} className="text-primary-400" />
            <span>Verified Farmers</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <BadgeCheck size={18} className="text-primary-400" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <BadgeCheck size={18} className="text-primary-400" />
            <span>Quality Guaranteed</span>
          </div>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <BadgeCheck size={18} className="text-primary-400" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
