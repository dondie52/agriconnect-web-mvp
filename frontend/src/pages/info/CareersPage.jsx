/**
 * Careers Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Heart, Coffee, Laptop, Users, Zap } from 'lucide-react';

const CareersPage = () => {
  const openings = [
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Gaborone / Remote',
      type: 'Full-time',
      description: 'Build features that empower thousands of farmers. React, Node.js, PostgreSQL experience required.',
    },
    {
      title: 'Agricultural Extension Officer',
      department: 'Operations',
      location: 'Multiple Locations',
      type: 'Full-time',
      description: 'Help onboard and train farmers in using AgriConnect. Agriculture background preferred.',
    },
    {
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Gaborone',
      type: 'Full-time',
      description: 'Ensure our farmers and buyers have the best experience. Excellent communication skills required.',
    },
    {
      title: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Gaborone',
      type: 'Full-time',
      description: 'Help spread the word about AgriConnect across Botswana. Social media and content creation skills needed.',
    },
    {
      title: 'Data Analyst',
      department: 'Product',
      location: 'Gaborone / Remote',
      type: 'Full-time',
      description: 'Analyze market trends and user behavior to improve our platform. SQL and Python experience required.',
    },
  ];

  const benefits = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical aid for you and your family' },
    { icon: Coffee, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: Laptop, title: 'Remote Options', description: 'Work from anywhere for most roles' },
    { icon: Users, title: 'Team Events', description: 'Regular team bonding activities and retreats' },
    { icon: Zap, title: 'Growth Budget', description: 'Annual learning and development allowance' },
    { icon: Briefcase, title: 'Equity', description: 'Share in the company\'s success with stock options' },
  ];

  const values = [
    'Impact-driven work that transforms lives',
    'Collaborative, supportive team environment',
    'Opportunity to shape the future of agriculture',
    'Competitive compensation packages',
    'Work-life balance we actually practice',
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
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="text-6xl mb-6 block">🚀</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Join Our Team</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Help us build the future of agriculture in Botswana. We're looking for passionate 
            people who want to make a real difference.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Why Work at AgriConnect?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <ul className="space-y-4">
                {values.map((value, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center shrink-0 text-sm">✓</span>
                    <span className="text-neutral-700">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
              <span className="text-6xl block mb-4">🌾</span>
              <p className="text-lg text-neutral-700 font-medium">
                "Working at AgriConnect means waking up every day knowing your work helps real 
                farmers feed their families and grow their businesses."
              </p>
              <p className="text-primary-600 mt-4 font-medium">- Our Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <benefit.icon className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-neutral-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-4">Open Positions</h2>
          <p className="text-neutral-600 text-center mb-12">Find your next opportunity to make an impact</p>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-6 hover:bg-primary-50 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-lg group-hover:text-primary-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {job.type}
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-3">{job.description}</p>
                  </div>
                  <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shrink-0">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Don't See Your Role?</h2>
          <p className="text-primary-100 mb-8">
            We're always looking for talented people. Send us your CV and let us know how you 
            can contribute to our mission.
          </p>
          <a 
            href="mailto:careers@agriconnect.co.bw"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
          >
            Send Your CV
          </a>
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

export default CareersPage;

