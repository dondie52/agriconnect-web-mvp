/**
 * Landing Page - Main Component
 * Amazon-style agricultural marketplace landing page
 * Composes all landing page sections in the correct order
 */
import React from 'react';
import Navbar from './Navbar';
import FeaturedCarousel from './FeaturedCarousel';
import Hero from './Hero';
import QuickActions from './QuickActions';
import ProductGrid from './ProductGrid';
import CategoriesSection from './CategoriesSection';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-neutral-100 font-body">
      {/* Navigation - Sticky at top */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Featured Products Carousel */}
        <FeaturedCarousel />

        {/* Hero Section with Search */}
        <Hero />

        {/* Quick Action Cards */}
        <QuickActions />

        {/* Product Grid */}
        <ProductGrid />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Testimonials with Dark Background */}
        <Testimonials />

        {/* CTA Banner */}
        <CTABanner />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
