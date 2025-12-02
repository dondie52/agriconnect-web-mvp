/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // AgriConnect Brand Colors
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2E7D32', // Primary Green
          600: '#2e7d32',
          700: '#388e3c',
          800: '#1b5e20',
          900: '#1b5e20',
        },
        secondary: {
          50: '#fffde7',
          100: '#fff9c4',
          200: '#fff59d',
          300: '#fff176',
          400: '#ffee58',
          500: '#F9A825', // Secondary Yellow
          600: '#fdd835',
          700: '#f9a825',
          800: '#f57f17',
          900: '#e65100',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5', // Neutral Gray background
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242', // Dark Gray text
          900: '#212121',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Poppins', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'nav': '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #66bb6a 100%)',
        'gradient-hero': 'linear-gradient(180deg, #e8f5e9 0%, #f5f5f5 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'chatbot-pulse': 'chatbotPulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chatbotPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)' },
          '70%': { boxShadow: '0 0 0 12px rgba(46, 125, 50, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(46, 125, 50, 0)' },
        },
      },
    },
  },
  plugins: [],
}
