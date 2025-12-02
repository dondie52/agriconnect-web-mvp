/**
 * Footer Section Component
 * 4-column footer: About, Support, Farmers, Contact
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { name: 'About AgriConnect', href: '#about' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Our Mission', href: '#mission' },
    { name: 'Success Stories', href: '#testimonials' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press', href: '#press' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#help' },
    { name: 'Safety Information', href: '#safety' },
    { name: 'FAQs', href: '#faq' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'SMS/USSD Guide', href: '#ussd' },
  ];

  const farmerLinks = [
    { name: 'Start Selling', href: '/register?role=farmer', isRoute: true },
    { name: 'Seller Guide', href: '#seller-guide' },
    { name: 'Pricing Tools', href: '/prices', isRoute: true },
    { name: 'Weather Alerts', href: '/weather', isRoute: true },
    { name: 'Crop Planner', href: '/crop-planner', isRoute: true },
    { name: 'Farmer Community', href: '#community' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/agriconnect', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/agriconnect', color: 'hover:bg-pink-600' },
    { name: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/26712345678', color: 'hover:bg-green-600' },
    { name: 'X (Twitter)', icon: Twitter, href: 'https://twitter.com/agriconnect', color: 'hover:bg-neutral-600' },
  ];

  const paymentMethods = ['Visa', 'Mastercard', 'Mobile Money', 'EFT'];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1 font-display">Stay Updated</h3>
              <p className="text-neutral-400 text-sm">
                Get farming tips, market updates, and exclusive deals
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 bg-neutral-800 border border-neutral-700 
                         rounded-lg text-white placeholder:text-neutral-500
                         focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg 
                         font-medium transition-colors flex items-center gap-2 shrink-0"
              >
                Subscribe
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* About Column */}
          <div>
            <h4 className="text-lg font-bold mb-5 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              About
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm
                             hover:translate-x-1 inline-flex items-center gap-1"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-lg font-bold mb-5 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmers Column */}
          <div>
            <h4 className="text-lg font-bold mb-5 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              For Farmers
            </h4>
            <ul className="space-y-3">
              {farmerLinks.map((link) => (
                <li key={link.name}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm
                               inline-flex items-center gap-1"
                    >
                      {link.name}
                      {link.href.startsWith('/register') && (
                        <span className="text-xs bg-primary-500 text-white px-1.5 py-0.5 rounded">
                          Free
                        </span>
                      )}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold mb-5 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full" />
              Contact
            </h4>
            <div className="space-y-4">
              <a 
                href="mailto:hello@agriconnect.bw" 
                className="flex items-start gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Mail size={18} className="shrink-0 mt-0.5" />
                <span className="text-sm">hello@agriconnect.bw</span>
              </a>
              <a 
                href="tel:+26712345678" 
                className="flex items-start gap-3 text-neutral-400 hover:text-white transition-colors"
              >
                <Phone size={18} className="shrink-0 mt-0.5" />
                <span className="text-sm">+267 123 4567</span>
              </a>
              <div className="flex items-start gap-3 text-neutral-400">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span className="text-sm">
                  Plot 123, Main Mall<br />
                  Gaborone, Botswana
                </span>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-sm text-neutral-500 mb-3">Follow us</p>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-neutral-800 rounded-lg flex items-center 
                                justify-center text-neutral-400 hover:text-white ${social.color} 
                                transition-all`}
                      aria-label={social.name}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Download & Brand */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="text-4xl group-hover:scale-110 transition-transform">🍀</span>
                <span className="text-2xl font-bold font-display">AgriConnect</span>
              </Link>
              <div className="h-8 w-px bg-neutral-700 hidden sm:block" />
              <p className="text-neutral-500 text-sm hidden sm:block">
                Connecting farmers to markets
              </p>
            </div>

            {/* App Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-neutral-500 text-sm hidden md:block">Coming Soon:</span>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg 
                               border border-neutral-700 hover:border-neutral-600 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.707 10.708L16.293 9.294 13 12.587V2h-2v10.587l-3.293-3.293-1.414 1.414L12 16.414l5.707-5.706z"/>
                  <path d="M18 18H6v-2H4v4h16v-4h-2z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-neutral-400">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg 
                               border border-neutral-700 hover:border-neutral-600 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-neutral-400">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              © {currentYear} AgriConnect Botswana. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-neutral-600 text-xs">We accept:</span>
              <div className="flex items-center gap-2">
                {paymentMethods.map((method) => (
                  <span 
                    key={method}
                    className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
