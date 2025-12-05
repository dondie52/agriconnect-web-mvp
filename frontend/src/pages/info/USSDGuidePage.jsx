/**
 * SMS/USSD Guide Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, MessageSquare, Hash, CheckCircle, ArrowRight } from 'lucide-react';

const USSDGuidePage = () => {
  const ussdCommands = [
    { code: '*123*456#', action: 'Main Menu', description: 'Access the AgriConnect USSD menu' },
    { code: '*123*456*1#', action: 'List Product', description: 'Add a new product listing' },
    { code: '*123*456*2#', action: 'View Prices', description: 'Check current market prices' },
    { code: '*123*456*3#', action: 'My Orders', description: 'View your pending orders' },
    { code: '*123*456*4#', action: 'Weather', description: 'Get weather alerts for your area' },
    { code: '*123*456*5#', action: 'Account', description: 'Manage your account settings' },
    { code: '*123*456*0#', action: 'Help', description: 'Get help and support' },
  ];

  const smsCommands = [
    { keyword: 'LIST', format: 'LIST [Product] [Price] [Quantity]', example: 'LIST Tomatoes 25 100kg', description: 'Add a new product listing' },
    { keyword: 'PRICE', format: 'PRICE [Product]', example: 'PRICE Maize', description: 'Get current market price for a product' },
    { keyword: 'ORDERS', format: 'ORDERS', example: 'ORDERS', description: 'Get your pending orders via SMS' },
    { keyword: 'WEATHER', format: 'WEATHER [Location]', example: 'WEATHER Gaborone', description: 'Get weather forecast for your area' },
    { keyword: 'BALANCE', format: 'BALANCE', example: 'BALANCE', description: 'Check your AgriConnect wallet balance' },
    { keyword: 'HELP', format: 'HELP', example: 'HELP', description: 'Get list of all SMS commands' },
  ];

  const steps = [
    { step: 1, title: 'Dial the USSD Code', description: 'Dial *123*456# from any mobile phone' },
    { step: 2, title: 'Choose an Option', description: 'Select from the menu using number keys' },
    { step: 3, title: 'Follow Prompts', description: 'Enter requested information step by step' },
    { step: 4, title: 'Confirm', description: 'Review and confirm your action' },
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
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">SMS & USSD Guide</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Use AgriConnect on any phone — no smartphone or internet required. 
            Access all features via SMS or USSD codes.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{item.step}</span>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 text-primary-300" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USSD Codes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Hash className="w-8 h-8 text-primary-500" />
            <h2 className="text-3xl font-bold font-display text-neutral-900">USSD Codes</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-neutral-100 px-6 py-3 font-medium text-neutral-700">
              <div>Code</div>
              <div>Action</div>
              <div>Description</div>
            </div>
            {ussdCommands.map((cmd, index) => (
              <div key={index} className={`grid grid-cols-3 px-6 py-4 ${index !== ussdCommands.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                <div className="font-mono text-primary-600 font-medium">{cmd.code}</div>
                <div className="font-medium text-neutral-900">{cmd.action}</div>
                <div className="text-neutral-600 text-sm">{cmd.description}</div>
              </div>
            ))}
          </div>

          {/* USSD Demo */}
          <div className="mt-8 bg-neutral-900 rounded-2xl p-8 text-white max-w-md mx-auto">
            <div className="text-center text-neutral-400 text-sm mb-4">USSD Preview</div>
            <div className="bg-neutral-800 rounded-lg p-4 font-mono text-sm">
              <p className="text-green-400 mb-3">AgriConnect Menu</p>
              <p>1. List Product</p>
              <p>2. View Prices</p>
              <p>3. My Orders</p>
              <p>4. Weather Alerts</p>
              <p>5. My Account</p>
              <p>0. Help</p>
              <p className="mt-3 text-neutral-500">Reply with option number</p>
            </div>
          </div>
        </div>
      </section>

      {/* SMS Commands */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="w-8 h-8 text-secondary-500" />
            <h2 className="text-3xl font-bold font-display text-neutral-900">SMS Commands</h2>
          </div>
          <p className="text-neutral-600 mb-8">
            Send SMS to <span className="font-mono font-bold text-primary-600">+267 76 984 827</span>
          </p>
          
          <div className="space-y-4">
            {smsCommands.map((cmd, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-mono font-bold mb-3">
                      {cmd.keyword}
                    </span>
                    <h3 className="font-medium text-neutral-900 mb-1">{cmd.description}</h3>
                    <p className="text-neutral-500 text-sm">Format: <code className="bg-neutral-200 px-2 py-0.5 rounded">{cmd.format}</code></p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-neutral-200">
                    <p className="text-xs text-neutral-500 mb-1">Example:</p>
                    <p className="font-mono text-sm text-primary-600">{cmd.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Tips for Best Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Save the Number</h3>
              <p className="text-neutral-600 text-sm">Save our SMS number for quick access</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Keep it Simple</h3>
              <p className="text-neutral-600 text-sm">Use short, clear messages without special characters</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Check Airtime</h3>
              <p className="text-neutral-600 text-sm">Ensure you have airtime for SMS responses</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Use HELP</h3>
              <p className="text-neutral-600 text-sm">Send HELP anytime to get command reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Need Help?</h2>
          <p className="text-primary-100 mb-8">
            Our support team can help you set up and use SMS/USSD features. 
            Call us or send HELP via SMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+26776984827"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              Call Support
            </a>
            <Link 
              to="/help"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors border border-primary-500"
            >
              Help Center
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

export default USSDGuidePage;


