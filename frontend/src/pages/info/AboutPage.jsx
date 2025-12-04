/**
 * About AgriConnect Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Globe, Award, Sprout, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Active Farmers', value: '2,500+', icon: Users },
    { label: 'Markets Connected', value: '50+', icon: Globe },
    { label: 'Products Listed', value: '10,000+', icon: Sprout },
    { label: 'Transactions', value: 'P5M+', icon: TrendingUp },
  ];

  // Founder info
  const founder = {
    name: 'Georgy Moni',
    role: 'Founder & CEO',
    image: '/founder.jpg', // Add your photo to public folder
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="text-6xl mb-6 block">🍀</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">About AgriConnect</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to transform agriculture in Botswana by connecting farmers directly 
            with buyers, eliminating middlemen, and ensuring fair prices for everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-neutral-50 rounded-xl">
                <stat.icon className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  AgriConnect was born in 2024 from a simple observation: smallholder farmers in 
                  Botswana were struggling to reach markets while buyers couldn't find quality 
                  local produce.
                </p>
                <p>
                  Our founder, Georgy Moni, grew up in a farming community and witnessed firsthand 
                  how middlemen took the lion's share of profits, leaving farmers with barely 
                  enough to sustain their operations.
                </p>
                <p>
                  Today, AgriConnect serves thousands of farmers across Botswana, providing them 
                  with direct market access, real-time pricing information, weather alerts, and 
                  AI-powered crop planning tools.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <span className="text-8xl block mb-4">🌾</span>
                <p className="text-primary-700 font-medium">Empowering Botswana's Farmers Since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Meet the Founder</h2>
          <div className="max-w-md mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-lg">
              <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="/founder.jpg" 
                  alt="Georgy Moni - Founder & CEO"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-primary-100 items-center justify-center text-6xl hidden">
                  👨‍💼
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 text-2xl mb-1">{founder.name}</h3>
              <p className="text-primary-600 font-medium mb-4">{founder.role}</p>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Passionate about empowering Botswana's farmers through technology. 
                Building AgriConnect to bridge the gap between farms and markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Join the Agricultural Revolution</h2>
          <p className="text-primary-100 mb-8">
            Whether you're a farmer looking to expand your market reach or a buyer seeking 
            fresh, local produce, AgriConnect is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?role=farmer"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              Start Selling
            </Link>
            <Link 
              to="/register?role=buyer"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 transition-colors border border-primary-500"
            >
              Start Buying
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

export default AboutPage;

