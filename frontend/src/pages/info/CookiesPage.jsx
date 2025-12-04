/**
 * Cookies Policy Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, BarChart, Shield, CheckCircle } from 'lucide-react';

const CookiesPage = () => {
  const lastUpdated = 'December 1, 2024';

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. Cannot be disabled.',
      examples: ['Session management', 'Security tokens', 'User preferences'],
      required: true,
    },
    {
      icon: BarChart,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      examples: ['Page views', 'User journey', 'Performance metrics'],
      required: false,
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Location settings', 'Saved searches'],
      required: false,
    },
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
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <Cookie className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold font-display mb-4">Cookie Policy</h1>
          <p className="text-amber-100">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">What Are Cookies?</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Cookies are small text files that are stored on your device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information 
            to website owners.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            AgriConnect uses cookies to improve your browsing experience, remember your preferences, 
            and understand how you use our platform so we can make it better.
          </p>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Types of Cookies We Use</h2>
          <div className="space-y-6">
            {cookieTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <type.icon className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-neutral-900 text-lg">{type.title}</h3>
                      {type.required && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 mb-4">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Managing Your Cookie Preferences</h2>
          
          <div className="space-y-6">
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="font-bold text-neutral-900 mb-3">Browser Settings</h3>
              <p className="text-neutral-600 mb-4">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-neutral-600">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  See what cookies are stored and delete them individually
                </li>
                <li className="flex items-start gap-2 text-neutral-600">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  Block third-party cookies
                </li>
                <li className="flex items-start gap-2 text-neutral-600">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  Block all cookies from being set
                </li>
                <li className="flex items-start gap-2 text-neutral-600">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  Delete all cookies when you close your browser
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="font-bold text-amber-800 mb-3">⚠️ Important Note</h3>
              <p className="text-neutral-700">
                Disabling cookies may affect the functionality of AgriConnect. Some features like 
                staying logged in, remembering your preferences, and secure transactions require 
                cookies to work properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third Party Cookies */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Third-Party Cookies</h2>
          <p className="text-neutral-600 mb-6">
            We use services from third parties that may set cookies on your device:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <h4 className="font-medium text-neutral-900 mb-1">Google Analytics</h4>
              <p className="text-neutral-600 text-sm">Website usage analytics</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <h4 className="font-medium text-neutral-900 mb-1">Payment Processors</h4>
              <p className="text-neutral-600 text-sm">Secure payment processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Updates to This Policy</h2>
          <p className="text-neutral-600 mb-6">
            We may update this Cookie Policy from time to time to reflect changes in our practices 
            or for operational, legal, or regulatory reasons. We encourage you to review this page 
            periodically.
          </p>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 mt-12">Contact Us</h2>
          <p className="text-neutral-600 mb-4">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="bg-neutral-50 rounded-lg p-4">
            <p className="text-neutral-700">
              <strong>Email:</strong> privacy@agriconnect.co.bw<br />
              <strong>Phone:</strong> +267 76 984 827
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-neutral-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h3 className="font-bold text-neutral-900 mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy →
            </Link>
            <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service →
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

export default CookiesPage;

