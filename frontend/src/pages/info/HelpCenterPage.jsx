/**
 * Help Center Page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ChevronRight, MessageCircle, Phone, Mail, BookOpen, Users, ShoppingCart, CreditCard, Truck, Settings } from 'lucide-react';

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: Users, title: 'Getting Started', count: 12, description: 'Account setup, verification, and first steps' },
    { icon: ShoppingCart, title: 'Buying & Selling', count: 18, description: 'How to list products and make purchases' },
    { icon: CreditCard, title: 'Payments', count: 10, description: 'Payment methods, withdrawals, and fees' },
    { icon: Truck, title: 'Delivery & Pickup', count: 8, description: 'Shipping options and logistics' },
    { icon: Settings, title: 'Account Settings', count: 6, description: 'Profile, notifications, and preferences' },
    { icon: BookOpen, title: 'Policies & Rules', count: 5, description: 'Terms, guidelines, and community standards' },
  ];

  const popularArticles = [
    { title: 'How to create your first listing', category: 'Getting Started' },
    { title: 'Accepting mobile money payments', category: 'Payments' },
    { title: 'How to verify your farmer account', category: 'Getting Started' },
    { title: 'Understanding market prices', category: 'Buying & Selling' },
    { title: 'Setting up delivery options', category: 'Delivery & Pickup' },
    { title: 'How to contact a seller', category: 'Buying & Selling' },
    { title: 'Changing your password', category: 'Account Settings' },
    { title: 'Reporting a problem with an order', category: 'Buying & Selling' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero with Search */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">How can we help?</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={24} />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-4 rounded-xl text-neutral-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
            />
          </div>
          <p className="text-primary-200 mt-4 text-sm">
            Popular: listings, payments, verification, delivery
          </p>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <a href="tel:+26776984827" className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Phone className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Call Us</h3>
                <p className="text-neutral-600 text-sm">+267 76 984 827</p>
              </div>
            </a>
            <a href="mailto:support@agriconnect.co.bw" className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                <Mail className="text-secondary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Email Support</h3>
                <p className="text-neutral-600 text-sm">support@agriconnect.co.bw</p>
              </div>
            </a>
            <a href="https://wa.me/26776984827" className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">WhatsApp</h3>
                <p className="text-neutral-600 text-sm">Quick responses</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold font-display text-neutral-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <button key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left group">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                    <category.icon className="text-primary-600 group-hover:text-white transition-colors" size={24} />
                  </div>
                  <span className="text-sm text-neutral-500">{category.count} articles</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">{category.title}</h3>
                <p className="text-neutral-600 text-sm">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold font-display text-neutral-900 mb-8">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <button key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-colors text-left group">
                <div>
                  <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">{article.category}</p>
                </div>
                <ChevronRight className="text-neutral-400 group-hover:text-primary-500 transition-colors" size={20} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Still Need Help?</h2>
          <p className="text-primary-100 mb-8">
            Our support team is available Monday to Friday, 8am to 5pm. 
            We typically respond within 2 hours during business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@agriconnect.co.bw"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              Contact Support
            </a>
            <Link 
              to="/faq"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors border border-primary-500"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-4">
            <span className="text-2xl">🍀</span>
            <span className="text-xl font-bold font-display">AgriConnect</span>
          </Link>
          <p className="text-neutral-400 text-sm">© 2024 AgriConnect Botswana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterPage;


