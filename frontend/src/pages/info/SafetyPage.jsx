/**
 * Safety Information Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Phone, MessageCircle } from 'lucide-react';

const SafetyPage = () => {
  const safetyTips = [
    {
      title: 'Verify Before You Buy',
      description: 'Check seller ratings, reviews, and verification badges before making purchases.',
      icon: CheckCircle,
    },
    {
      title: 'Meet in Safe Locations',
      description: 'For local pickups, choose public places or busy farm markets.',
      icon: Shield,
    },
    {
      title: 'Use Platform Payments',
      description: 'Our secure payment system protects both buyers and sellers.',
      icon: CheckCircle,
    },
    {
      title: 'Trust Your Instincts',
      description: 'If a deal seems too good to be true, it probably is.',
      icon: AlertTriangle,
    },
  ];

  const doList = [
    'Use AgriConnect messaging for all communications',
    'Verify seller credentials and farm location',
    'Inspect produce quality before completing payment',
    'Keep records of all transactions',
    'Report suspicious activity immediately',
    'Meet at designated, safe pickup points',
  ];

  const dontList = [
    'Share personal banking PINs or passwords',
    'Send money before receiving products',
    'Meet alone in isolated locations',
    'Click on suspicious links sent by other users',
    'Share your account login details',
    'Accept payments outside the platform',
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
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Safety Information</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your safety is our priority. Learn how to trade safely on AgriConnect.
          </p>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Safety Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <tip.icon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">{tip.title}</h3>
                  <p className="text-neutral-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Do's and Don'ts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-green-600" size={32} />
                <h3 className="text-2xl font-bold text-green-800">Do's</h3>
              </div>
              <ul className="space-y-4">
                {doList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="text-red-600" size={32} />
                <h3 className="text-2xl font-bold text-red-800">Don'ts</h3>
              </div>
              <ul className="space-y-4">
                {dontList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verification System */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Our Verification System</h2>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  We verify farmers through a multi-step process to ensure authenticity. 
                  Look for these badges when choosing a seller:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      ✓ ID Verified
                    </span>
                    <span className="text-neutral-600">Government ID confirmed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✓ Farm Verified
                    </span>
                    <span className="text-neutral-600">Physical farm location confirmed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ Top Seller
                    </span>
                    <span className="text-neutral-600">High ratings and consistent quality</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="text-8xl">🛡️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Issues */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold font-display mb-4">Report a Safety Issue</h2>
            <p className="text-red-100 max-w-2xl mx-auto">
              If you encounter suspicious activity, fraud, or any safety concern, report it immediately. 
              Our team investigates all reports within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+26776984827"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors"
            >
              <Phone size={20} />
              Call Emergency Line
            </a>
            <a 
              href="https://wa.me/26776984827"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition-colors border border-red-500"
            >
              <MessageCircle size={20} />
              Report via WhatsApp
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

export default SafetyPage;

