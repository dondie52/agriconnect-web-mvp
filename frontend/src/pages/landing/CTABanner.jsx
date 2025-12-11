/**
 * CTA Banner Section Component
 * Large green banner - "Join the AgriConnect Community"
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const CTABanner = () => {
  const benefits = [
    { icon: ShoppingCart, text: 'Fresh Products' },
    { icon: TrendingUp, text: 'Growing Daily' },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-green-400" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10c-8 15-25 22-35 22 15 8 22 25 22 35 8-15 25-22 35-22-15-8-22-25-22-35z' fill='white' fill-opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 text-7xl md:text-9xl opacity-10 animate-bounce select-none" 
           style={{ animationDuration: '4s' }}>
        🍀
      </div>
      <div className="absolute bottom-10 right-10 text-7xl md:text-9xl opacity-10 animate-bounce select-none" 
           style={{ animationDuration: '5s', animationDelay: '1s' }}>
        🌾
      </div>
      <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 select-none hidden md:block">
        🌱
      </div>
      <div className="absolute top-1/3 right-1/4 text-5xl opacity-10 select-none hidden md:block">
        🌽
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 
                        bg-white/20 rounded-full mb-8 backdrop-blur-sm border border-white/30
                        shadow-xl">
            <span className="text-5xl md:text-6xl">🍀</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 
                       font-display leading-tight">
            Join the AgriConnect
            <br className="hidden sm:block" />
            <span className="text-primary-100">Community Today</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with farmers, discover fresh produce, and be part of Botswana's growing 
            agricultural marketplace. It's completely free to get started!
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <benefit.icon size={16} />
                </div>
                <span className="text-sm md:text-base font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-3 bg-white text-primary-600 
                       px-8 py-4 rounded-xl font-bold text-lg shadow-lg 
                       hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register?role=farmer"
              className="group inline-flex items-center justify-center gap-3 bg-transparent text-white 
                       px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/50
                       hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              <Sprout size={20} />
              Become a Farmer
            </Link>
          </div>

          {/* Trust Note */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6 
                        text-white/70 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
              Free to join
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
              No hidden fees
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
