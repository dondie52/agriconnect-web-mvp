/**
 * Terms of Service Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = 'December 1, 2024';

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
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-primary-400" />
          <h1 className="text-4xl font-bold font-display mb-4">Terms of Service</h1>
          <p className="text-neutral-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 prose prose-neutral max-w-none">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 mb-6">
              By accessing and using AgriConnect ("the Platform"), you accept and agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Description of Service</h2>
            <p className="text-neutral-600 mb-6">
              AgriConnect is an online marketplace that connects farmers with buyers for agricultural 
              products in Botswana. We provide a platform for listing, discovering, and transacting 
              agricultural produce. AgriConnect does not own, produce, or sell any agricultural products 
              directly.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. User Accounts</h2>
            <p className="text-neutral-600 mb-4">To use our services, you must:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Seller Responsibilities</h2>
            <p className="text-neutral-600 mb-4">As a seller on AgriConnect, you agree to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
              <li>Provide accurate descriptions and images of products</li>
              <li>Maintain food safety and quality standards</li>
              <li>Honor listed prices and availability</li>
              <li>Fulfill orders in a timely manner</li>
              <li>Respond to buyer inquiries promptly</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Buyer Responsibilities</h2>
            <p className="text-neutral-600 mb-4">As a buyer on AgriConnect, you agree to:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
              <li>Pay for products as agreed upon</li>
              <li>Inspect products upon receipt</li>
              <li>Report issues within 24 hours of delivery</li>
              <li>Communicate respectfully with sellers</li>
              <li>Not engage in fraudulent transactions</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Fees and Payments</h2>
            <p className="text-neutral-600 mb-6">
              AgriConnect charges a 3% transaction fee on successful sales. This fee is deducted from 
              the seller's payment. Listing products and browsing the marketplace is free. Payment 
              processing fees may apply depending on the payment method chosen.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Prohibited Activities</h2>
            <p className="text-neutral-600 mb-4">Users may not:</p>
            <ul className="list-disc pl-6 text-neutral-600 mb-6 space-y-2">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Sell prohibited or illegal items</li>
              <li>Manipulate prices or reviews</li>
              <li>Harass or threaten other users</li>
              <li>Attempt to circumvent platform fees</li>
              <li>Use the platform for money laundering</li>
              <li>Scrape or harvest user data</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Dispute Resolution</h2>
            <p className="text-neutral-600 mb-6">
              We encourage buyers and sellers to resolve disputes directly. If a resolution cannot 
              be reached, AgriConnect may mediate disputes at our discretion. Our decisions on 
              disputes are final. Serious disputes may be referred to appropriate legal authorities.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-neutral-600 mb-6">
              AgriConnect is a marketplace platform and is not responsible for the quality, safety, 
              or legality of products listed. We do not guarantee that transactions will be completed 
              or disputes will be resolved in any particular way. Our liability is limited to the 
              fees paid to us.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Termination</h2>
            <p className="text-neutral-600 mb-6">
              We reserve the right to suspend or terminate accounts that violate these terms. Users 
              may also delete their accounts at any time. Upon termination, outstanding transactions 
              must be completed and any owed payments settled.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Changes to Terms</h2>
            <p className="text-neutral-600 mb-6">
              We may update these terms from time to time. Users will be notified of significant 
              changes via email or platform notification. Continued use of the platform after 
              changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Contact Information</h2>
            <p className="text-neutral-600 mb-6">
              For questions about these terms, please contact us at:
            </p>
            <div className="bg-neutral-100 rounded-lg p-4 text-neutral-600">
              <p><strong>AgriConnect Botswana</strong></p>
              <p>Email: legal@agriconnect.co.bw</p>
              <p>Phone: +267 76 984 827</p>
              <p>Address: Plot 123, Main Mall, Gaborone, Botswana</p>
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

export default TermsPage;

