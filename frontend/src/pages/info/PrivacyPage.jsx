/**
 * Privacy Policy Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = 'December 1, 2024';

  const dataTypes = [
    { icon: '👤', title: 'Personal Information', items: ['Name', 'Phone number', 'Email address', 'Physical address', 'ID documents (for verification)'] },
    { icon: '📍', title: 'Location Data', items: ['Farm location', 'Delivery addresses', 'Device location (with permission)'] },
    { icon: '📱', title: 'Device Information', items: ['Device type', 'Browser type', 'IP address', 'App version'] },
    { icon: '💳', title: 'Transaction Data', items: ['Purchase history', 'Payment methods', 'Transaction amounts'] },
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
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold font-display mb-4">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">Privacy at a Glance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">What We Collect</h3>
              <p className="text-neutral-600 text-sm">Only data necessary to provide our services</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">How We Protect It</h3>
              <p className="text-neutral-600 text-sm">Industry-standard encryption and security</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Database className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-neutral-900 mb-2">Your Control</h3>
              <p className="text-neutral-600 text-sm">Access, update, or delete your data anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data We Collect */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Information We Collect</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <span className="text-3xl mb-3 block">{type.icon}</span>
                <h3 className="font-bold text-neutral-900 mb-3">{type.title}</h3>
                <ul className="space-y-2">
                  {type.items.map((item, i) => (
                    <li key={i} className="text-neutral-600 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="prose prose-neutral max-w-none">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Your Information</h2>
            <p className="text-neutral-600 mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
              <li>Provide and improve our marketplace services</li>
              <li>Process transactions and payments</li>
              <li>Send important notifications about your account and orders</li>
              <li>Verify user identities and prevent fraud</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Analyze usage patterns to improve our platform</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Information Sharing</h2>
            <p className="text-neutral-600 mb-4">We share your information only:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
              <li><strong>With other users:</strong> Sellers see buyer contact info for orders; buyers see seller contact info for listings</li>
              <li><strong>With service providers:</strong> Payment processors, hosting services, and analytics tools</li>
              <li><strong>For legal compliance:</strong> When required by law or to protect our rights</li>
              <li><strong>With your consent:</strong> For any other purposes you explicitly agree to</li>
            </ul>
            <p className="text-neutral-600 mb-8 bg-green-50 p-4 rounded-lg">
              <strong>We never sell your personal data to third parties.</strong>
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Security</h2>
            <p className="text-neutral-600 mb-8">
              We implement appropriate technical and organizational measures to protect your data, 
              including encryption of data in transit and at rest, regular security audits, 
              access controls, and secure data storage practices. However, no method of transmission 
              over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights</h2>
            <p className="text-neutral-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-8 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Withdraw consent:</strong> Revoke permissions at any time</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies and Tracking</h2>
            <p className="text-neutral-600 mb-8">
              We use cookies and similar technologies to remember your preferences, understand how 
              you use our platform, and provide personalized experiences. You can control cookie 
              settings through your browser. See our <Link to="/cookies" className="text-primary-600 hover:underline">Cookie Policy</Link> for 
              more details.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h2>
            <p className="text-neutral-600 mb-8">
              We retain your personal data for as long as your account is active or as needed to 
              provide services. We may retain certain information for longer periods as required 
              by law or for legitimate business purposes (e.g., transaction records for accounting).
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children's Privacy</h2>
            <p className="text-neutral-600 mb-8">
              AgriConnect is not intended for children under 18 years of age. We do not knowingly 
              collect personal information from children.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
            <p className="text-neutral-600 mb-8">
              We may update this policy from time to time. We will notify you of significant 
              changes via email or platform notification. Your continued use of AgriConnect 
              after changes constitutes acceptance.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
            <div className="bg-neutral-100 rounded-lg p-6">
              <p className="text-neutral-600 mb-4">For privacy-related questions or requests:</p>
              <div className="flex items-center gap-3 text-neutral-700">
                <Mail className="text-primary-500" size={20} />
                <a href="mailto:privacy@agriconnect.co.bw" className="text-primary-600 hover:underline">
                  privacy@agriconnect.co.bw
                </a>
              </div>
            </div>
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

export default PrivacyPage;


