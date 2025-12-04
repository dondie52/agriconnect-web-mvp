/**
 * How It Works Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, UserPlus, Package, ShoppingCart, Truck, CheckCircle, Smartphone } from 'lucide-react';

const HowItWorksPage = () => {
  const farmerSteps = [
    { icon: UserPlus, title: 'Create Account', description: 'Sign up for free and verify your farming credentials. Takes less than 5 minutes.' },
    { icon: Package, title: 'List Products', description: 'Add your produce with photos, prices, and available quantities. Set your own prices.' },
    { icon: ShoppingCart, title: 'Receive Orders', description: 'Get notified when buyers want your products. Accept or negotiate orders.' },
    { icon: Truck, title: 'Deliver & Get Paid', description: 'Arrange delivery or pickup. Receive secure payment directly to your account.' },
  ];

  const buyerSteps = [
    { icon: UserPlus, title: 'Sign Up', description: 'Create your buyer account for free. Individual or business accounts available.' },
    { icon: Package, title: 'Browse Products', description: 'Explore fresh produce from verified local farmers. Filter by location, price, and type.' },
    { icon: ShoppingCart, title: 'Place Orders', description: 'Order directly from farmers. Message sellers for bulk deals or special requests.' },
    { icon: CheckCircle, title: 'Receive Fresh Produce', description: 'Get farm-fresh products delivered or arrange pickup at your convenience.' },
  ];

  const features = [
    { title: 'No Middlemen', description: 'Direct farmer-to-buyer transactions mean better prices for everyone.' },
    { title: 'Verified Sellers', description: 'All farmers go through a verification process to ensure legitimacy.' },
    { title: 'Secure Payments', description: 'Multiple payment options including mobile money, card, and EFT.' },
    { title: 'Real-time Updates', description: 'Track your orders, get weather alerts, and market price notifications.' },
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
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">How AgriConnect Works</h1>
          <p className="text-xl text-secondary-100 max-w-3xl mx-auto">
            A simple, transparent process that connects farmers directly with buyers. 
            No complicated steps, no hidden fees.
          </p>
        </div>
      </section>

      {/* For Farmers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              For Farmers
            </span>
            <h2 className="text-3xl font-bold font-display text-neutral-900">Start Selling in 4 Easy Steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {farmerSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600 text-sm">{step.description}</p>
                </div>
                {index < farmerSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 text-primary-300" size={24} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/register?role=farmer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Start Selling Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-4">
              For Buyers
            </span>
            <h2 className="text-3xl font-bold font-display text-neutral-900">Get Fresh Produce in 4 Steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {buyerSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-secondary-50 rounded-xl p-6 hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600 text-sm">{step.description}</p>
                </div>
                {index < buyerSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 text-secondary-300" size={24} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/register?role=buyer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-medium transition-colors"
            >
              Start Buying Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Why Choose AgriConnect?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMS/USSD Info */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Smartphone className="w-12 h-12 mb-4" />
              <h2 className="text-3xl font-bold font-display mb-4">No Smartphone? No Problem!</h2>
              <p className="text-primary-100 mb-6">
                AgriConnect works on any phone! Use our SMS and USSD services to list products, 
                check prices, and receive orders - all without internet.
              </p>
              <Link 
                to="/ussd-guide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                Learn About SMS/USSD
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-primary-700 rounded-xl p-6">
              <div className="font-mono text-sm space-y-2">
                <p className="text-primary-300">Dial *123*456# to:</p>
                <p>1. List a product</p>
                <p>2. Check market prices</p>
                <p>3. View your orders</p>
                <p>4. Get weather alerts</p>
                <p>5. Contact support</p>
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

export default HowItWorksPage;

