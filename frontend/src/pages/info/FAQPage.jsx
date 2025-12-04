/**
 * FAQ Page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search, MessageCircle } from 'lucide-react';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" on the homepage, choose whether you\'re a farmer or buyer, and fill in your details. You\'ll need a valid phone number for verification. The process takes less than 5 minutes.'
        },
        {
          question: 'Is AgriConnect free to use?',
          answer: 'Yes! Creating an account and listing products is completely free for farmers. We only charge a small transaction fee (3%) when you successfully sell your produce.'
        },
        {
          question: 'How do I verify my farmer account?',
          answer: 'Go to Settings > Verification. You\'ll need to upload a copy of your ID and optionally photos of your farm. Our team reviews applications within 48 hours.'
        },
      ]
    },
    {
      title: 'Selling Products',
      faqs: [
        {
          question: 'How do I list my products?',
          answer: 'Go to "My Listings" and click "Add New Listing". Add clear photos, set your price, specify the quantity available, and provide a description. Your listing will be live immediately.'
        },
        {
          question: 'Can I set my own prices?',
          answer: 'Absolutely! You have full control over your prices. We provide market price guidance to help you price competitively, but the final decision is yours.'
        },
        {
          question: 'How do I handle delivery?',
          answer: 'You can offer delivery, pickup, or both. For delivery, you can set your own rates and delivery areas. Many farmers arrange pickup from their farms or local markets.'
        },
        {
          question: 'What products can I sell?',
          answer: 'You can sell vegetables, fruits, grains, livestock, poultry, dairy products, and other agricultural produce. All products must be fresh and meet food safety standards.'
        },
      ]
    },
    {
      title: 'Buying Products',
      faqs: [
        {
          question: 'How do I find products?',
          answer: 'Browse listings on the marketplace or use the search and filter features to find specific products. You can filter by location, price, and product type.'
        },
        {
          question: 'How do I contact a seller?',
          answer: 'Click on any listing to see the seller\'s profile and contact options. You can message them directly through the app or use the phone number provided.'
        },
        {
          question: 'Are the products fresh?',
          answer: 'Yes, most products are farm-fresh. Each listing shows when it was posted and the estimated harvest date. You can also see the farmer\'s ratings and reviews from previous buyers.'
        },
      ]
    },
    {
      title: 'Payments',
      faqs: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept Mobile Money (Orange Money, MyZaka), bank cards (Visa, Mastercard), EFT/bank transfers, and cash on delivery for local transactions.'
        },
        {
          question: 'When do I get paid as a seller?',
          answer: 'Payments are released to your account within 24 hours after the buyer confirms receipt of products. You can then withdraw to your mobile money or bank account.'
        },
        {
          question: 'What are the fees?',
          answer: 'Listing products is free. We charge a 3% transaction fee on successful sales. There\'s no subscription or monthly fees. Withdrawal fees depend on your bank or mobile money provider.'
        },
      ]
    },
    {
      title: 'Account & Security',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your phone number or email. You\'ll receive a verification code to reset your password.'
        },
        {
          question: 'Is my information secure?',
          answer: 'Yes, we use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, go to Settings > Account > Delete Account. Note that this action is permanent and you\'ll lose your listing history and reviews.'
        },
      ]
    },
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

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
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-primary-100 mb-8">
            Find answers to common questions about AgriConnect
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={24} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-4 rounded-xl text-neutral-900 focus:outline-none focus:ring-4 focus:ring-primary-300"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold font-display text-neutral-900 mb-6 pb-3 border-b border-neutral-200">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const key = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={faqIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <span className="font-medium text-neutral-900 pr-4">{faq.question}</span>
                        <ChevronDown 
                          className={`text-neutral-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                          size={20} 
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Still Have Questions?</h2>
          <p className="text-primary-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/help"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              Visit Help Center
            </Link>
            <a 
              href="https://wa.me/26776984827"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors border border-primary-500"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
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

export default FAQPage;

