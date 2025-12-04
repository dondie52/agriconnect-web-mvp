/**
 * Seller Guide Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, DollarSign, Package, Star, TrendingUp, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const SellerGuidePage = () => {
  const listingTips = [
    {
      icon: Camera,
      title: 'Take Great Photos',
      tips: [
        'Use natural daylight',
        'Show multiple angles',
        'Include size reference',
        'Keep background clean',
        'Show quantity available',
      ]
    },
    {
      icon: DollarSign,
      title: 'Price Competitively',
      tips: [
        'Check market prices daily',
        'Factor in quality and freshness',
        'Consider bulk discounts',
        'Be transparent about pricing',
        'Adjust prices seasonally',
      ]
    },
    {
      icon: Package,
      title: 'Describe Accurately',
      tips: [
        'List exact quantities',
        'Mention harvest date',
        'Note any treatments used',
        'Be honest about quality',
        'Update availability regularly',
      ]
    },
  ];

  const doList = [
    'Respond to inquiries within 24 hours',
    'Keep your listings up to date',
    'Be honest about product quality',
    'Package products carefully for delivery',
    'Ask for reviews from happy customers',
    'Build relationships with repeat buyers',
  ];

  const dontList = [
    'Oversell products you don\'t have',
    'Post misleading photos',
    'Ignore buyer messages',
    'Change prices after agreement',
    'Deliver poor quality products',
    'Share buyer information publicly',
  ];

  const pricingStrategies = [
    { name: 'Market Rate', description: 'Match current market prices for quick sales' },
    { name: 'Premium', description: 'Higher prices for organic or specialty items' },
    { name: 'Bulk Discount', description: 'Lower per-unit price for large orders' },
    { name: 'Seasonal', description: 'Adjust based on supply and demand' },
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="text-6xl mb-6 block">📚</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Seller Guide</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Everything you need to know to succeed as a seller on AgriConnect. 
            Learn tips from our top-performing farmers.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">P4,500</div>
              <div className="text-neutral-600 text-sm">Average Monthly Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">48hrs</div>
              <div className="text-neutral-600 text-sm">Average Time to First Sale</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">85%</div>
              <div className="text-neutral-600 text-sm">Repeat Customer Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">3%</div>
              <div className="text-neutral-600 text-sm">Only Fee We Charge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Create Your Account', description: 'Sign up for free and complete your farmer profile with your farm details and location.' },
              { step: 2, title: 'Get Verified', description: 'Submit your ID for verification. Verified sellers get more visibility and buyer trust.' },
              { step: 3, title: 'List Your First Product', description: 'Add photos, set prices, and describe your produce. Your listing goes live instantly!' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm relative">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mt-4 mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/register?role=farmer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Listing Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Creating Great Listings</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {listingTips.map((category, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <category.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-600">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Strategies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Pricing Strategies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingStrategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <TrendingUp className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">{strategy.name}</h3>
                <p className="text-neutral-600 text-sm">{strategy.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-primary-50 rounded-xl p-6 text-center">
            <p className="text-neutral-700">
              💡 <strong>Pro Tip:</strong> Check the Market Prices page daily to stay competitive. 
              Our AI can also suggest optimal prices based on your location and product.
            </p>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Seller Do's & Don'ts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-green-600" size={28} />
                <h3 className="text-xl font-bold text-green-800">Do's</h3>
              </div>
              <ul className="space-y-3">
                {doList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-700">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-red-600" size={28} />
                <h3 className="text-xl font-bold text-red-800">Don'ts</h3>
              </div>
              <ul className="space-y-3">
                {dontList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-700">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Building Reputation */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Star className="w-12 h-12 mb-4" />
                <h2 className="text-3xl font-bold font-display mb-4">Build Your Reputation</h2>
                <p className="text-primary-100 mb-6">
                  Top sellers earn more, get featured on the homepage, and build loyal customer bases. 
                  Here's how to become a top seller:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Maintain 4.5+ star rating
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Complete 20+ successful sales
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Respond within 24 hours consistently
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Get verified as a farmer
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <span className="text-8xl">🏆</span>
                <p className="text-xl font-bold mt-4">Top Seller Badge</p>
                <p className="text-primary-200">Increased visibility & trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Ready to Start Selling?</h2>
          <p className="text-neutral-600 mb-8">
            Join thousands of successful farmers on AgriConnect. It's free to sign up and list your products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?role=farmer"
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors"
            >
              Create Account
            </Link>
            <a 
              href="https://wa.me/26776984827"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold transition-colors"
            >
              <MessageCircle size={20} />
              Ask Questions
            </a>
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

export default SellerGuidePage;

