/**
 * Success Stories Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Quote, TrendingUp, Star, MapPin } from 'lucide-react';

const SuccessStoriesPage = () => {
  const stories = [
    {
      name: 'Mpho Kgosidintsi',
      location: 'Molepolole',
      crop: 'Tomatoes & Onions',
      image: '👨‍🌾',
      story: 'Before AgriConnect, I would travel 60km to Gaborone hoping to sell my tomatoes. Half would spoil before I found buyers. Now, buyers come to me! My income has tripled in just 8 months.',
      stats: { before: 'P1,500/month', after: 'P4,500/month', increase: '200%' },
      featured: true,
    },
    {
      name: 'Keabetswe Molefe',
      location: 'Francistown',
      crop: 'Spinach & Cabbages',
      image: '👩‍🌾',
      story: 'The weather alerts saved my entire crop last season. I got warned about frost 3 days before it hit and was able to protect my vegetables. AgriConnect is a lifesaver!',
      stats: { before: 'P800/month', after: 'P2,400/month', increase: '200%' },
    },
    {
      name: 'Thabo Moilwa',
      location: 'Serowe',
      crop: 'Maize & Sorghum',
      image: '👨‍🌾',
      story: 'I used to sell to middlemen at whatever price they offered. Now I check real market prices on AgriConnect and negotiate fair deals. The crop planner also helped me diversify my farm.',
      stats: { before: 'P3,000/month', after: 'P7,500/month', increase: '150%' },
    },
    {
      name: 'Naledi Phetogo',
      location: 'Kasane',
      crop: 'Watermelons',
      image: '👩‍🌾',
      story: 'Living in the north, finding buyers was nearly impossible. AgriConnect connected me with restaurants and hotels in Kasane. Now I supply 5 lodges regularly!',
      stats: { before: 'P500/month', after: 'P3,000/month', increase: '500%' },
    },
    {
      name: 'Kagiso Rapula',
      location: 'Maun',
      crop: 'Herbs & Vegetables',
      image: '👨‍🌾',
      story: 'Started with just a small backyard garden. The AI tips helped me expand sustainably. Now I have 2 hectares and employ 3 people from my village.',
      stats: { before: 'Hobby farmer', after: 'Full-time business', increase: 'Life-changing' },
    },
    {
      name: 'Boitumelo Seretse',
      location: 'Gaborone',
      crop: 'Organic Vegetables',
      image: '👩‍🌾',
      story: 'As a young farmer, I struggled to be taken seriously. AgriConnect gave me a platform to showcase my organic produce. Now I supply to 3 restaurants and a supermarket!',
      stats: { before: 'P0 (new farmer)', after: 'P8,000/month', increase: 'New income' },
    },
  ];

  const impactStats = [
    { value: '2,500+', label: 'Farmers Empowered' },
    { value: 'P5M+', label: 'Total Earnings Generated' },
    { value: '180%', label: 'Average Income Increase' },
    { value: '95%', label: 'Farmer Satisfaction Rate' },
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
      <section className="bg-gradient-to-br from-secondary-600 to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="text-6xl mb-6 block">⭐</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Success Stories</h1>
          <p className="text-xl text-secondary-100 max-w-3xl mx-auto">
            Real farmers. Real results. Discover how AgriConnect is transforming lives across Botswana.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {stories.filter(s => s.featured).map((story, index) => (
        <section key={index} className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-white flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <span className="text-8xl block mb-4">{story.image}</span>
                    <h3 className="text-2xl font-bold">{story.name}</h3>
                    <p className="text-primary-200 flex items-center justify-center gap-1 mt-1">
                      <MapPin size={16} />
                      {story.location}
                    </p>
                    <p className="text-primary-300 text-sm mt-1">{story.crop}</p>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4 w-fit">
                    ⭐ Featured Story
                  </span>
                  <Quote className="w-10 h-10 text-primary-200 mb-4" />
                  <p className="text-lg text-neutral-700 leading-relaxed mb-6">{story.story}</p>
                  <div className="grid grid-cols-3 gap-4 bg-neutral-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-neutral-500">Before</div>
                      <div className="font-bold text-neutral-900">{story.stats.before}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-neutral-500">After</div>
                      <div className="font-bold text-primary-600">{story.stats.after}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-neutral-500">Increase</div>
                      <div className="font-bold text-green-600 flex items-center justify-center gap-1">
                        <TrendingUp size={16} />
                        {story.stats.increase}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* All Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">More Success Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.filter(s => !s.featured).map((story, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{story.image}</span>
                  <div>
                    <h3 className="font-bold text-neutral-900">{story.name}</h3>
                    <p className="text-neutral-500 text-sm flex items-center gap-1">
                      <MapPin size={12} />
                      {story.location}
                    </p>
                    <p className="text-primary-600 text-sm">{story.crop}</p>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4 leading-relaxed">{story.story}</p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div>
                    <div className="text-xs text-neutral-500">Before → After</div>
                    <div className="font-medium text-sm">
                      <span className="text-neutral-500">{story.stats.before}</span>
                      <span className="mx-2">→</span>
                      <span className="text-primary-600">{story.stats.after}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <TrendingUp size={16} />
                    {story.stats.increase}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-primary-100 mb-8">
            Join thousands of farmers who have transformed their lives with AgriConnect.
          </p>
          <Link 
            to="/register?role=farmer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors"
          >
            Start Your Journey Today
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

export default SuccessStoriesPage;


