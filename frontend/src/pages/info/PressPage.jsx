/**
 * Press Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, ExternalLink, Calendar, Newspaper } from 'lucide-react';

const PressPage = () => {
  const pressReleases = [
    {
      date: 'November 2024',
      title: 'AgriConnect Platform Continues to Grow',
      excerpt: 'The platform continues to grow as more Batswana farmers embrace digital agriculture solutions.',
    },
    {
      date: 'October 2024',
      title: 'Partnership with Ministry of Agriculture Announced',
      excerpt: 'AgriConnect to provide market access tools to farmers under government extension programs.',
    },
    {
      date: 'September 2024',
      title: 'Launch of AI-Powered Crop Planning Feature',
      excerpt: 'New feature helps farmers make data-driven decisions about what and when to plant.',
    },
    {
      date: 'August 2024',
      title: 'AgriConnect Secures Seed Funding',
      excerpt: 'Local and international investors back the platform\'s mission to transform agriculture.',
    },
  ];

  const mediaFeatures = [
    { outlet: 'Botswana Daily News', title: 'Tech Startup Connects Farmers to Markets', date: 'Nov 2024' },
    { outlet: 'Weekend Post', title: 'Young Entrepreneur Revolutionizing Agriculture', date: 'Oct 2024' },
    { outlet: 'Mmegi', title: 'AgriConnect: A Digital Solution for Botswana\'s Farmers', date: 'Sep 2024' },
    { outlet: 'The Voice', title: 'From Farm to Market: How Technology is Helping Farmers', date: 'Aug 2024' },
  ];

  const brandAssets = [
    { name: 'Logo Package', description: 'Full color, monochrome, and reversed versions', format: 'ZIP' },
    { name: 'Brand Guidelines', description: 'Colors, typography, and usage rules', format: 'PDF' },
    { name: 'Product Screenshots', description: 'High-resolution app and web screenshots', format: 'ZIP' },
    { name: 'Founder Photos', description: 'Professional headshots of leadership team', format: 'ZIP' },
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
      <section className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-6 text-primary-400" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Press & Media</h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Resources for journalists and media professionals covering AgriConnect.
          </p>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold font-display mb-2">Media Inquiries</h2>
              <p className="text-primary-100">For press inquiries, interviews, or media requests</p>
            </div>
            <a 
              href="mailto:press@agriconnect.co.bw"
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
            >
              <Mail size={20} />
              press@agriconnect.co.bw
            </a>
          </div>
        </div>
      </section>

      {/* About Boilerplate */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">About AgriConnect</h2>
          <div className="bg-neutral-50 rounded-xl p-6 md:p-8">
            <p className="text-neutral-700 leading-relaxed mb-4">
              <strong>AgriConnect</strong> is Botswana's leading digital agricultural marketplace, 
              connecting smallholder farmers directly with buyers. Founded in 2024, the platform 
              serves farmers across all districts of Botswana.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              The platform provides farmers with direct market access, real-time pricing information, 
              weather alerts, AI-powered crop planning, and SMS/USSD access for those without smartphones. 
              AgriConnect's mission is to empower every farmer in Botswana with the tools they need 
              to succeed in the modern agricultural economy.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Headquartered in Gaborone, AgriConnect is backed by local and international investors 
              and works in partnership with the Ministry of Agriculture and various farmer cooperatives.
            </p>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-8">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-primary-600 shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-neutral-500">{release.date}</span>
                    <h3 className="font-bold text-neutral-900 text-lg mt-1">{release.title}</h3>
                    <p className="text-neutral-600 mt-2">{release.excerpt}</p>
                    <button className="text-primary-600 font-medium mt-3 hover:text-primary-700 flex items-center gap-1">
                      Read Full Release <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-8">In the Media</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaFeatures.map((feature, index) => (
              <div key={index} className="border border-neutral-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                <span className="text-sm text-neutral-500">{feature.date}</span>
                <h3 className="font-bold text-neutral-900 mt-1">{feature.title}</h3>
                <p className="text-primary-600 mt-2 text-sm font-medium">{feature.outlet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-8">Brand Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {brandAssets.map((asset, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900">{asset.name}</h3>
                  <p className="text-neutral-600 text-sm mt-1">{asset.description}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-medium transition-colors">
                  <Download size={18} />
                  {asset.format}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Key Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">2024</div>
              <div className="text-neutral-400">Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">-</div>
              <div className="text-neutral-400">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">-</div>
              <div className="text-neutral-400">Transaction Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">10</div>
              <div className="text-neutral-400">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8 border-t border-neutral-800">
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

export default PressPage;


