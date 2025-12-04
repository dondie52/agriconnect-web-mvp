/**
 * Our Mission Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Users, Globe, Leaf, TrendingUp, Shield, Lightbulb } from 'lucide-react';

const MissionPage = () => {
  const values = [
    { icon: Heart, title: 'Farmer First', description: 'Everything we build starts with asking: how does this help farmers succeed?' },
    { icon: Shield, title: 'Trust & Transparency', description: 'No hidden fees, no data selling. We earn trust through honest practices.' },
    { icon: Users, title: 'Community', description: 'We believe in the power of farmers helping farmers succeed together.' },
    { icon: Lightbulb, title: 'Innovation', description: 'Using technology to solve real problems faced by smallholder farmers.' },
    { icon: Globe, title: 'Accessibility', description: 'Our platform works on any device, with or without internet access.' },
    { icon: Leaf, title: 'Sustainability', description: 'Promoting sustainable farming practices for a greener Botswana.' },
  ];

  const goals = [
    { metric: '10,000', label: 'Farmers Connected by 2025' },
    { metric: '100%', label: 'Districts Coverage' },
    { metric: 'P50M+', label: 'Annual Transaction Value' },
    { metric: '50%', label: 'Income Increase for Farmers' },
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
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Target className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Our Mission</h1>
          <p className="text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
            "To empower every smallholder farmer in Botswana with the tools, connections, 
            and knowledge they need to thrive in the modern agricultural economy."
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Our Vision</h2>
              <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                We envision a Botswana where no farmer struggles to sell their produce, where 
                fair prices are the norm, and where technology bridges the gap between rural 
                farms and urban markets.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                By 2030, we aim to be the backbone of agricultural trade in Southern Africa, 
                having transformed how millions of farmers connect with buyers, access 
                information, and grow their businesses.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Economic Empowerment</h3>
                    <p className="text-neutral-600 text-sm">Increasing farmer incomes by cutting out middlemen and providing market intelligence.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Digital Inclusion</h3>
                    <p className="text-neutral-600 text-sm">Ensuring every farmer can participate, regardless of their technology access.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">Sustainable Agriculture</h3>
                    <p className="text-neutral-600 text-sm">Promoting practices that protect our environment for future generations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                  <value.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Our 2025 Goals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <div key={index} className="text-center bg-primary-700 rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{goal.metric}</div>
                <div className="text-primary-200">{goal.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Be Part of the Change</h2>
          <p className="text-neutral-600 mb-8">
            Join thousands of farmers and buyers who are already transforming agriculture in Botswana.
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors"
          >
            Get Started Today
          </Link>
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

export default MissionPage;

