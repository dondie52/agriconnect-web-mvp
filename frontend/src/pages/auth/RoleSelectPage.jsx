/**
 * Role Select Page for AgriConnect
 * Allows users to choose whether to login as a Farmer or Buyer
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tractor, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const RoleSelectPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'farmer',
      title: 'Login as Farmer',
      description: 'Access your farm dashboard, post products, manage listings, and track your sales.',
      icon: Tractor,
      gradient: 'from-primary-500 to-primary-700',
      hoverGradient: 'hover:from-primary-600 hover:to-primary-800',
      features: ['Post & manage products', 'Track sales & analytics', 'Weather alerts', 'Crop planner'],
      link: '/login?role=farmer',
    },
    {
      id: 'buyer',
      title: 'Login as Buyer',
      description: 'Browse fresh produce, connect with farmers, and purchase directly from the source.',
      icon: ShoppingBag,
      gradient: 'from-secondary-500 to-orange-600',
      hoverGradient: 'hover:from-secondary-600 hover:to-orange-700',
      features: ['Browse marketplace', 'Direct from farmers', 'Post buy requests', 'Track orders'],
      link: '/login?role=buyer',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🍀</span>
            <span className="text-xl md:text-2xl font-bold text-primary-500 font-display">
              AgriConnect
            </span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-4xl w-full">
          {/* Title Section */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 
                          text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              Welcome Back
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 font-display mb-4">
              How would you like to{' '}
              <span className="text-primary-500">continue?</span>
            </h1>
            <p className="text-neutral-600 text-lg max-w-xl mx-auto">
              Select your account type to access the right dashboard and features for you.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {roles.map((role, index) => (
              <Link
                key={role.id}
                to={role.link}
                className={`group relative bg-gradient-to-br ${role.gradient} ${role.hoverGradient}
                          rounded-2xl p-6 md:p-8 text-white overflow-hidden transition-all duration-300 
                          hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-4 border-white" />
                  <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full border-4 border-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center 
                                justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <role.icon size={32} className="text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 font-display">
                    {role.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/85 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-white/90">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="font-semibold">Continue</span>
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center
                                  group-hover:bg-white/30 transition-colors">
                      <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Register Link */}
          <div className="text-center mt-10">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 font-semibold hover:underline">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} AgriConnect Botswana. All rights reserved.
      </footer>
    </div>
  );
};

export default RoleSelectPage;



