/**
 * Community Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Calendar, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

const CommunityPage = () => {
  const communityGroups = [
    { name: 'Gaborone Farmers Network', members: 450, category: 'Regional', active: true },
    { name: 'Organic Growers Botswana', members: 280, category: 'Specialty', active: true },
    { name: 'Poultry Farmers Unite', members: 320, category: 'Livestock', active: true },
    { name: 'Young Farmers Association', members: 190, category: 'Youth', active: true },
    { name: 'Cattle Farmers Network', members: 410, category: 'Livestock', active: true },
    { name: 'Vegetable Growers Guild', members: 380, category: 'Crops', active: true },
  ];

  const upcomingEvents = [
    {
      title: 'Farmers Market Day',
      date: 'Dec 15, 2024',
      location: 'Main Mall, Gaborone',
      type: 'Market',
    },
    {
      title: 'Organic Farming Workshop',
      date: 'Dec 20, 2024',
      location: 'Online (Zoom)',
      type: 'Workshop',
    },
    {
      title: 'AgriConnect Annual Meetup',
      date: 'Jan 10, 2025',
      location: 'GICC, Gaborone',
      type: 'Meetup',
    },
    {
      title: 'Crop Planning Seminar',
      date: 'Jan 15, 2025',
      location: 'Francistown Community Hall',
      type: 'Seminar',
    },
  ];

  const socialLinks = [
    { name: 'Facebook Group', icon: Facebook, members: '3.2K members', url: 'https://facebook.com/groups/agriconnect', color: 'bg-blue-100 text-blue-600' },
    { name: 'WhatsApp Community', icon: MessageCircle, members: '1.5K members', url: 'https://wa.me/26776984827', color: 'bg-green-100 text-green-600' },
    { name: 'Instagram', icon: Instagram, members: '2.1K followers', url: 'https://instagram.com/agriconnect', color: 'bg-pink-100 text-pink-600' },
    { name: 'Twitter/X', icon: Twitter, members: '890 followers', url: 'https://twitter.com/agriconnect', color: 'bg-neutral-100 text-neutral-600' },
  ];

  const benefits = [
    { title: 'Share Knowledge', description: 'Learn from experienced farmers and share your own tips', icon: '📚' },
    { title: 'Find Buyers', description: 'Connect with buyers looking for your products', icon: '🤝' },
    { title: 'Group Buying', description: 'Save on seeds, fertilizers through bulk orders', icon: '💰' },
    { title: 'Get Support', description: 'Ask questions and get help from fellow farmers', icon: '💬' },
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
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Farmer Community</h1>
          <p className="text-xl text-secondary-100 max-w-3xl mx-auto">
            Join a vibrant community of farmers across Botswana. Share knowledge, 
            find opportunities, and grow together.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <span className="text-4xl block mb-3">{benefit.icon}</span>
                <h3 className="font-bold text-neutral-900 mb-1">{benefit.title}</h3>
                <p className="text-neutral-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Socials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-12">Join Our Social Communities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center group"
              >
                <div className={`w-14 h-14 ${social.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <social.icon size={28} />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">{social.name}</h3>
                <p className="text-neutral-600 text-sm">{social.members}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community Groups */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-4">Farmer Groups</h2>
          <p className="text-neutral-600 text-center mb-12">Connect with farmers in your area or specialty</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityGroups.map((group, index) => (
              <div key={index} className="bg-neutral-50 rounded-xl p-6 hover:bg-primary-50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium mb-2">
                      {group.category}
                    </span>
                    <h3 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mt-1">
                      <Users className="inline-block mr-1" size={14} />
                      {group.members} members
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-primary-600 font-medium hover:text-primary-700">
              View All Groups →
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-display text-neutral-900 text-center mb-4">Upcoming Events</h2>
          <p className="text-neutral-600 text-center mb-12">Meet fellow farmers and learn new skills</p>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex gap-4">
                <div className="bg-primary-100 rounded-xl p-4 text-center shrink-0">
                  <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-xs text-primary-700 font-medium">{event.date}</div>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-medium text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded">
                    {event.type}
                  </span>
                  <h3 className="font-bold text-neutral-900 mt-2">{event.title}</h3>
                  <p className="text-neutral-600 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {event.location}
                  </p>
                </div>
                <button className="px-4 py-2 bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-lg text-sm font-medium transition-colors self-center">
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-primary-200" />
          <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
            "Through the AgriConnect community, I found bulk buyers for my tomatoes and learned 
            organic farming techniques that doubled my yield. The support from fellow farmers 
            is invaluable."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">👩‍🌾</span>
            <div className="text-left">
              <p className="font-bold">Keabetswe Molefe</p>
              <p className="text-primary-200">Vegetable Farmer, Francistown</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold font-display text-neutral-900 mb-6">Join the Community Today</h2>
          <p className="text-neutral-600 mb-8">
            Connect with farmers across Botswana. Share knowledge, find opportunities, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/26776984827"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
            >
              <MessageCircle size={20} />
              Join WhatsApp
            </a>
            <a 
              href="https://facebook.com/groups/agriconnect"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
            >
              <Facebook size={20} />
              Join Facebook
            </a>
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

export default CommunityPage;


