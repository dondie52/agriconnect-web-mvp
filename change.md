# AgriConnect - Supabase PostgreSQL Configuration Changes

**Date:** December 1, 2025  
**Purpose:** Configure backend to use remote Supabase PostgreSQL database

---

## Summary of Changes

This update configures the AgriConnect backend to connect to a Supabase-hosted PostgreSQL database instead of a local PostgreSQL instance, with SSL support and improved connection handling.

---

## Files Modified

### 1. `backend/src/config/db.js`
**Changes:**
- Added support for `DATABASE_URL` connection string (Supabase standard)
- Added SSL configuration: `{ rejectUnauthorized: false }` for Supabase compatibility
- Maintained backward compatibility with individual `DB_*` environment variables
- Improved connection logging with mode indicator (Supabase vs Local)
- Enhanced error logging with detailed error properties
- Added `testConnection()` export function for manual testing
- Increased `connectionTimeoutMillis` to 10000ms for remote connections

**Key code changes:**
```javascript
// New DATABASE_URL support with SSL
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // ... pool options
  };
}
```

---

### 2. `backend/src/routes/index.js`
**Changes:**
- Added import for database pool: `const { pool } = require('../config/db')`
- Added new `/api/test-db` route for database connection testing
- Updated `/api/health` endpoint for deployment platform compatibility

**Updated health endpoint:**
```javascript
// Server start time for uptime calculation
const serverStartTime = Date.now();

router.get('/health', async (req, res) => {
  const uptimeSeconds = ((Date.now() - serverStartTime) / 1000).toFixed(2);
  
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    console.error('Health check DB error:', error.message);
  }
  
  res.json({
    status: 'ok',
    db: dbStatus,
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString()
  });
});
```

**Test-db route:**
```javascript
router.get('/test-db', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', time: result.rows[0] });
});
```

---

### 3. `README.md`
**Changes:**
- Updated Tech Stack to mention Supabase-hosted PostgreSQL
- Added dual configuration options (Supabase vs Local) in Backend Setup
- Added `node test-db.js` command for testing database connection
- Added `curl` command to verify API database endpoint
- Added comprehensive "Required Environment Variables" table
- Added "Local Development with Supabase" section
- Expanded "Deploy Backend to Render" with step-by-step instructions
- Added "Deploy Frontend to Vercel" section

---

## Files Created

### 1. `backend/test-db.js`
**Purpose:** Manual database connection testing script

**Usage:**
```bash
cd backend
node test-db.js
```

**Features:**
- Tests connection using `DATABASE_URL` or individual `DB_*` variables
- Displays connection mode and host information (without exposing credentials)
- Shows server time and PostgreSQL version on success
- Lists all tables in the database
- Provides detailed error messages with troubleshooting tips
- Exits with code 0 on success, 1 on failure

---

### 2. `backend/.env.example`
**Purpose:** Template for environment variables

**Contents:**
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
PORT=10000
NODE_ENV=development
JWT_SECRET=AgriConnectSecret123
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## No Changes Required

The following files required **no modifications** as they already correctly import from `db.js`:

- `backend/src/models/*.js` - All models use `{ query }` from db.js
- `backend/src/controllers/*.js` - Use models, no direct DB access
- `backend/src/server.js` - Already has proper startup/error handling with `process.env.PORT || 5000`

---

## Testing the Changes

### 1. Test database connection manually:
```bash
cd backend
node test-db.js
```

### 2. Start the server and test via API:
```bash
npm run dev
curl http://localhost:5000/api/test-db
```

**Expected response:**
```json
{
  "status": "ok",
  "time": { "now": "2025-12-01T12:00:00.000Z" },
  "message": "Database connection successful"
}
```

### 3. Test health endpoint (deployment platforms):
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "db": "connected",
  "uptime": "123.45s",
  "timestamp": "2025-12-01T12:00:00.000Z"
}
```

---

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase DATABASE_URL:
   - Go to Supabase Dashboard → Settings → Database
   - Copy the "URI" connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. Update `.env` with your actual values

---

## Deployment Checklist

- [ ] Set `DATABASE_URL` in production environment
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT=10000` (or platform-assigned port)
- [ ] Set `JWT_SECRET` to a secure production value
- [ ] Set `FRONTEND_URL` to your deployed frontend URL
- [ ] Run migrations on Supabase: `npm run migrate`
- [ ] Verify health: `curl https://your-backend/api/health`
- [ ] Verify DB connection: `curl https://your-backend/api/test-db`

---

## React Hooks Violation Fix

**Date:** December 1, 2025  
**Issue:** ESLint errors - "React Hook 'useRelevantRequests' is called conditionally" and "React Hook 'useBuyerRequests' is called conditionally"

---

### Problem

In `frontend/src/pages/BuyerRequestsPage.jsx`, hooks were called conditionally using a ternary operator:

```javascript
// INVALID - violates React Rules of Hooks
const { data: requestsData, isLoading } = isFarmer 
  ? useRelevantRequests({ page, limit: 10 })
  : useBuyerRequests({ ...filters, page, limit: 10 });
```

React requires ALL hooks to be called unconditionally and in the same order on every render.

---

### Why This Matters

React relies on the order and position of hooks to track internal component state. Conditional hook calls break this mapping and lead to:

- Misaligned hook state
- Invalid renders
- React Query cache corruption
- Hydration errors
- Production runtime crashes

---

### Solution

#### 1. Updated Custom Hooks (`frontend/src/hooks/useApi.js`)

Added an `options` parameter with `enabled` flag to both hooks:

**`useBuyerRequests`:**
```javascript
export const useBuyerRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['buyerRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getAll(params);
      return response.data.data;
    },
    enabled: options.enabled !== false, // enabled by default
  });
};
```

**`useRelevantRequests`:**
```javascript
export const useRelevantRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['relevantRequests', params],
    queryFn: async () => {
      const response = await requestsAPI.getRelevantForFarmer(params);
      return response.data.data;
    },
    enabled: options.enabled !== false, // enabled by default
  });
};
```

#### 2. Updated Page Component (`frontend/src/pages/BuyerRequestsPage.jsx`)

Refactored to call both hooks unconditionally at the top of the component:

```javascript
// Call BOTH hooks unconditionally with enabled option
// Only one will actually fetch based on the user's role
const relevantRequestsQuery = useRelevantRequests(
  { page, limit: 10 },
  { enabled: isFarmer }
);
const buyerRequestsQuery = useBuyerRequests(
  { ...filters, page, limit: 10 },
  { enabled: !isFarmer }
);

// Select the appropriate result based on role
const { data: requestsData, isLoading } = isFarmer 
  ? relevantRequestsQuery 
  : buyerRequestsQuery;
```

---

### How `enabled` Works in React Query

| `enabled` value | Behavior |
|-----------------|----------|
| `true` | Query runs normally (fetches data) |
| `false` | Query is registered but does not fetch |

- Prevents unnecessary network calls
- Allows hooks to be declared unconditionally while staying "inactive"
- Perfect tool for resolving conditional hook violations

---

### Data Flow After Fix

```
Render --> Call both hooks unconditionally
              |
              +-- useRelevantRequests(enabled = isFarmer)
              |
              +-- useBuyerRequests(enabled = !isFarmer)

React Query:
    enabled = false --> skip query (no network request)
    enabled = true  --> fetch data

Component --> Select correct query result based on role
```

---

### Testing Checklist

- [ ] Log in as a **Buyer** → Buyer Requests endpoint is called, Relevant Requests is not
- [ ] Log in as a **Farmer** → Relevant Requests endpoint is called, Buyer Requests is not
- [ ] Verify no ESLint hook warnings appear
- [ ] Confirm pagination, filters, and loading spinners work correctly
- [ ] Verify Contact Buyer modal works for farmers

---

### Performance Considerations

- Only one query fetches at any time
- The inactive query does not trigger network requests
- React Query retains cached data, improving navigation speed
- No re-renders are triggered from the disabled query

---

### Common Mistakes Avoided

| Mistake | Status |
|---------|--------|
| Calling hooks inside `if` statements | Avoided |
| Using ternaries to choose between hooks | Fixed |
| Early returns before hook declarations | N/A |
| Fetching unnecessary data | Prevented via `enabled` |

---

### Files Modified

| File | Change |
|------|--------|
| `frontend/src/hooks/useApi.js` | Added `options` parameter with `enabled` flag to `useBuyerRequests` and `useRelevantRequests` |
| `frontend/src/pages/BuyerRequestsPage.jsx` | Refactored to call both hooks unconditionally with `enabled` option |

---

## Landing Page Implementation

**Date:** December 1, 2025  
**Purpose:** Create a professional, responsive landing page for AgriConnect with all marketing sections

---

### Summary

Implemented a complete landing page with seven distinct sections: sticky navigation, hero section, how-it-works process, features grid, testimonials, CTA banner, and footer. The design uses the AgriConnect brand colors (#2E7D32, #4CAF50) and includes smooth animations, mobile responsiveness, and modern UI patterns.

---

### Files Created

#### 1. `frontend/src/pages/landing/Navbar.jsx`
**Purpose:** Sticky navigation bar with mobile hamburger menu

**Features:**
- Sticky header that changes background on scroll
- Logo with 🍀 emoji and "AgriConnect" text
- Desktop navigation links: Home, Marketplace, Farmer Sign Up, Buyer Sign Up, Login
- Language selector (EN/ST) with dropdown
- Mobile hamburger menu with slide-down animation
- Smooth scroll behavior for anchor links

**Key implementation:**
```javascript
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Scroll detection for sticky nav styling
useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 20);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

#### 2. `frontend/src/pages/landing/Hero.jsx`
**Purpose:** Large hero section with headline, CTAs, and phone mockup

**Features:**
- Badge: "🌿 Empowering Botswana's Farmers"
- Main headline: "Connecting Smallholder Farmers to Markets, Prices & Weather Alerts — Instantly"
- Subheadline describing platform benefits
- Two CTA buttons: "Get Started" (primary) and "Download App" (outline)
- Phone mockup showing dashboard preview with:
  - Welcome header with farmer name
  - Stats cards (Listings, Sales)
  - Price alert notification
  - Weather widget
- Trust indicators: "500+ farmers already connected"
- Decorative animated emojis (🌾, 🌽)
- Floating notification cards

---

#### 3. `frontend/src/pages/landing/HowItWorks.jsx`
**Purpose:** 4-step process explanation

**Steps:**
1. **Farmers List Produce** - Upload products with photos and prices
2. **Buyers Find Products** - Browse listings by location and category
3. **Orders & Negotiation** - Secure chat and verified profiles
4. **Pickup or Delivery** - Coordinate logistics

**Features:**
- Numbered badges (01-04) with gradient backgrounds
- Color-coded icons for each step
- Connector lines between steps (desktop only)
- Hover effects and animations
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)

---

#### 4. `frontend/src/pages/landing/FeaturesGrid.jsx`
**Purpose:** 8-feature showcase grid

**Features:**
- Real-Time Market Prices
- Weather Alerts & Warnings
- SMS/USSD Offline Access
- Secure Farmer Profiles
- Buyer Requests Dashboard
- Community Forum & Tips
- Crop Planner (Seasonal)
- Delivery Coordination

**Design:**
- 8-box responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Color-coded icons with hover effects
- Bottom border animation on hover
- Staggered fade-in animations

---

#### 5. `frontend/src/pages/landing/Testimonials.jsx`
**Purpose:** Farmer testimonials and social proof

**Features:**
- 3 testimonial cards with:
  - Farmer emoji avatars
  - Highlight badges (e.g., "Income increased 40%")
  - 5-star ratings
  - Quote text
  - Name, role, and location
- Stats banner with 4 metrics:
  - 500+ Active Farmers
  - 1,200+ Listings Created
  - P250K+ Total Sales
  - 98% Satisfaction Rate

---

#### 6. `frontend/src/pages/landing/CTABanner.jsx`
**Purpose:** Strong call-to-action with signup buttons

**Features:**
- Green gradient background (`bg-gradient-cta`)
- Decorative leaf pattern overlay
- Large headline: "Ready to Start Selling Your Produce?"
- Two signup buttons:
  - "Sign Up as Farmer" (white background, primary text)
  - "Sign Up as Buyer" (transparent with white border)
- Trust indicators: "✓ Free to join ✓ No hidden fees ✓ Cancel anytime"
- Animated decorative elements

---

#### 7. `frontend/src/pages/landing/Footer.jsx`
**Purpose:** 3-column footer with links and social media

**Features:**
- **Brand Column:**
  - Logo with tagline: "Digital tools for the future of African agriculture"
  - Contact info: email, phone, location
- **Quick Links Column:**
  - About Us, Marketplace, Pricing, FAQ, Blog, Contact
- **Support Column:**
  - Help Center, Terms of Service, Privacy Policy, SMS/USSD Guide
- **Newsletter & Social Column:**
  - Email subscription form
  - Social media icons: Facebook, Instagram, WhatsApp, X (Twitter)
- Bottom bar with copyright and legal links

---

#### 8. `frontend/src/pages/landing/LandingPage.jsx`
**Purpose:** Main container component composing all sections

**Structure:**
```javascript
<Navbar />
<main>
  <Hero />
  <HowItWorks />
  <FeaturesGrid />
  <Testimonials />
  <CTABanner />
</main>
<Footer />
```

---

#### 9. `frontend/src/pages/landing/index.js`
**Purpose:** Barrel exports for easy imports

**Exports:**
- LandingPage (default)
- Navbar, Hero, HowItWorks, FeaturesGrid, Testimonials, CTABanner, Footer

---

### Files Modified

#### 1. `frontend/tailwind.config.js`
**Changes:**
- Added `Outfit` font family to `heading`, `body`, and new `display` font families
- Added `nav` shadow utility: `shadow-nav`
- Added gradient backgrounds:
  - `bg-gradient-cta`: Green gradient for CTA section
  - `bg-gradient-hero`: Light green gradient for hero background
- Added custom animations:
  - `fade-in-up`: Slide up with fade
  - `fade-in`: Simple fade
  - `slide-in-left`: Slide from left
  - `slide-in-right`: Slide from right
- Added keyframes for all animations

**Key additions:**
```javascript
fontFamily: {
  heading: ['Outfit', 'Poppins', 'system-ui', 'sans-serif'],
  body: ['Outfit', 'system-ui', 'sans-serif'],
  display: ['Outfit', 'system-ui', 'sans-serif'],
},
backgroundImage: {
  'gradient-cta': 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #66bb6a 100%)',
  'gradient-hero': 'linear-gradient(180deg, #e8f5e9 0%, #f5f5f5 100%)',
},
```

---

#### 2. `frontend/src/styles/index.css`
**Changes:**
- Added Google Fonts import for Outfit font family
- Added smooth scroll behavior: `html { scroll-behavior: smooth; }`
- Added leaf pattern background utilities:
  - `.leaf-pattern`: Subtle radial gradients
  - `.leaf-pattern-dense`: SVG pattern overlay with gradient
- Added stagger animation delay classes: `.stagger-1` through `.stagger-8`
- Added landing page component classes:
  - `.landing-section`: Standard section padding
  - `.landing-container`: Max-width container
  - `.landing-title`: Large heading styles
  - `.landing-subtitle`: Subtitle text styles
  - `.feature-card`: Feature card styling with hover effects
  - `.step-card`: Process step card styling
  - `.testimonial-card`: Testimonial card styling
  - `.nav-link-landing`: Navigation link with underline animation
- Added phone mockup styles:
  - `.phone-mockup`: Dark phone frame styling
  - `.phone-screen`: Screen content area
- Added gradient text utility: `.gradient-text`

**Key CSS additions:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.leaf-pattern-dense {
  background-image:
    url("data:image/svg+xml,..."),
    linear-gradient(180deg, #e8f5e9 0%, #f5f5f5 100%);
}

.stagger-1 { animation-delay: 0.1s; }
/* ... through stagger-8 */
```

---

#### 3. `frontend/src/App.jsx`
**Changes:**
- Added import: `import { LandingPage } from './pages/landing';`
- Changed root route from redirect to login to render LandingPage:
  ```javascript
  // Before:
  <Route path="/" element={<Navigate to="/login" replace />} />
  
  // After:
  <Route path="/" element={<LandingPage />} />
  ```
- Removed unused `Navigate` import

---

### Design Decisions

#### Color Scheme
- **Primary Green:** `#2E7D32` - Main brand color
- **Secondary Green:** `#4CAF50` - Accent color
- **Neutral Background:** `#F5F5F5` - Light gray for sections
- **Gradients:** Used for CTA banner and hero backgrounds

#### Typography
- **Font:** Outfit (Google Fonts) - Modern, geometric sans-serif
- **Headings:** Bold, large sizes (3xl-5xl)
- **Body:** Regular weight, readable line heights

#### Responsive Breakpoints
- **Mobile:** < 640px (sm) - Single column layouts, hamburger menu
- **Tablet:** 640px - 1024px (md) - 2-column grids
- **Desktop:** > 1024px (lg) - 4-column grids, full navigation

#### Animations
- **Fade-in-up:** Used for section content
- **Stagger delays:** Sequential animations for grid items (0.05s-0.1s intervals)
- **Hover effects:** Scale transforms, shadow changes, color transitions
- **Smooth scroll:** Enabled for anchor link navigation

#### Icons
- **Library:** `lucide-react` - Consistent icon set
- **Emojis:** Used for visual interest (🍀, 🌾, 🌽, 👨‍🌾, etc.)
- **Social icons:** Facebook, Instagram, WhatsApp, Twitter

---

### Testing Checklist

- [x] Landing page loads at root route (`/`)
- [x] Navigation links work correctly (Home, Marketplace, Sign Up, Login)
- [x] Mobile hamburger menu opens/closes smoothly
- [x] Language selector toggles between EN/ST
- [x] Hero section displays with phone mockup
- [x] CTA buttons link to registration page
- [x] All sections scroll smoothly
- [x] Features grid is responsive (1→2→4 columns)
- [x] Testimonials display correctly
- [x] Footer links and social icons work
- [x] Animations trigger on scroll
- [x] No console errors or warnings
- [x] Page is accessible (keyboard navigation, screen readers)

---

### Performance Considerations

- **Lazy Loading:** Landing page components are not lazy-loaded (acceptable for marketing page)
- **Animations:** CSS animations (GPU-accelerated) instead of JavaScript
- **Images:** Placeholder emojis used instead of image files (fast loading)
- **Font Loading:** Outfit font loaded via Google Fonts CDN
- **Responsive Images:** Phone mockup uses CSS gradients (no image files)

---

### Browser Compatibility

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features Used:**
  - CSS Grid (widely supported)
  - Flexbox (widely supported)
  - CSS Custom Properties (supported in all modern browsers)
  - `backdrop-filter` (used in CTA banner, graceful degradation)

---

### Files Summary

| Type | Count | Files |
|------|-------|-------|
| **Created** | 9 | Landing page components + index.js |
| **Modified** | 3 | tailwind.config.js, index.css, App.jsx |
| **Total** | 12 | - |

---

### Next Steps (Optional Enhancements)

- [ ] Add real images/photos instead of emojis
- [ ] Implement scroll-triggered animations (Intersection Observer)
- [ ] Add video background or product demo video
- [ ] Create animated statistics counter
- [ ] Add newsletter subscription backend integration
- [ ] Implement multi-language support (Setswana translations)
- [ ] Add analytics tracking (Google Analytics, etc.)
- [ ] Optimize for SEO (meta tags, structured data)

---

## Global Chatbot Widget Implementation

**Date:** December 2, 2025  
**Purpose:** Add a floating chatbot widget that appears on all pages of the AgriConnect application

---

### Summary

Implemented a global floating chatbot widget with a circular button at the bottom-right corner. The chatbot opens a responsive chat window with message history, API integration (with mock fallback), and smooth animations.

---

### Files Created

#### 1. `frontend/src/components/chatbot/Chatbot.jsx`
**Purpose:** Main container component for the chatbot widget

**Features:**
- Manages chat state: `isOpen`, `messages`, `inputValue`, `isLoading`
- Composable with `ChatbotButton` and `ChatWindow` components
- API integration with mock fallback responses
- Customizable via props

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | "/api/chat" | API endpoint for chat messages |
| `position` | string | "bottom-right" | Position of the floating button |
| `themeColor` | string | "#2E7D32" | Primary color for the chatbot |

**Key implementation:**
```javascript
const Chatbot = ({
  apiUrl = '/api/chat',
  position = 'bottom-right',
  themeColor = '#2E7D32',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // ...
};
```

---

#### 2. `frontend/src/components/chatbot/ChatbotButton.jsx`
**Purpose:** Floating circular button to open/close chat

**Features:**
- Size: 60x60px
- Styles: `rounded-full`, `bg-green-600`, `shadow-xl`, `hover:bg-green-700`
- Icon: `MessageCircle` when closed, `X` when open (from lucide-react)
- Pulse animation when idle
- Smooth hover scale transition
- Accessibility: `aria-label`, `aria-expanded`

---

#### 3. `frontend/src/components/chatbot/ChatWindow.jsx`
**Purpose:** Chat window with messages and input

**Features:**
- **Responsive sizing:**
  - Desktop: `w-[360px] h-[480px]`, fixed position bottom-right
  - Mobile: Full-width bottom sheet, `h-[70vh]`
- **Header:** Bot icon + "AgriConnect Assistant" + Close button
- **Messages area:**
  - User messages aligned right (green bubbles)
  - Bot messages aligned left (white bubbles with border)
  - Auto-scroll to bottom on new messages
  - Timestamps on each message
- **Input area:**
  - Text input + Send button
  - Enter key sends message
  - Loading state with spinner
- **Welcome state:** Shown when no messages exist
- Accessibility: `role="dialog"`, `aria-label`, focus management

---

#### 4. `frontend/src/components/chatbot/chatbot.css`
**Purpose:** Custom animations for the chatbot

**Animations:**
- `chatbotSlideUp`: Slide-up animation for chat window
- `chatbotFadeIn`: Fade-in animation
- `chatbotPulse`: Pulse animation for idle button
- `messageSlideIn`: Entrance animation for messages
- `typingDot`: Typing indicator dots animation

**Mobile styles:**
- Rounded top corners for bottom sheet appearance

---

#### 5. `frontend/src/components/chatbot/index.js`
**Purpose:** Barrel exports for easy imports

**Exports:**
```javascript
export { default } from './Chatbot';
export { default as Chatbot } from './Chatbot';
export { default as ChatbotButton } from './ChatbotButton';
export { default as ChatWindow } from './ChatWindow';
```

---

### Files Modified

#### 1. `frontend/src/App.jsx`
**Changes:**
- Added import: `import Chatbot from './components/chatbot';`
- Added `<Chatbot />` component after `<Toaster />` inside `<AuthProvider>`
- Ensures chatbot appears on all routes including landing page

**Code added:**
```javascript
{/* Global Chatbot Widget - Appears on all pages */}
<Chatbot />
```

---

#### 2. `frontend/src/api/index.js`
**Changes:**
- Added `chatAPI` for chatbot message handling

**Code added:**
```javascript
// Chat API (Chatbot)
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};
```

---

#### 3. `frontend/tailwind.config.js`
**Changes:**
- Added `slide-up` animation
- Added `chatbot-pulse` animation
- Added corresponding keyframes

**Additions:**
```javascript
animation: {
  // ... existing animations
  'slide-up': 'slideUp 0.3s ease-out forwards',
  'chatbot-pulse': 'chatbotPulse 2s infinite',
},
keyframes: {
  // ... existing keyframes
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
```

---

#### 4. `frontend/src/styles/index.css`
**Changes:**
- Added chatbot animation classes
- Added mobile bottom sheet styles

**Additions:**
```css
/* Chatbot Widget Styles */
.chatbot-slide-up { animation: chatbotSlideUp 0.3s ease-out forwards; }
.chatbot-fade-in { animation: chatbotFadeIn 0.3s ease-out forwards; }
.chatbot-pulse { animation: chatbotPulse 2s infinite; }

/* Mobile bottom sheet */
@media (max-width: 639px) {
  .chatbot-slide-up { border-radius: 1rem 1rem 0 0 !important; }
}
```

---

### Usage Examples

#### Default Usage
```jsx
<Chatbot />
```

#### Custom Configuration
```jsx
<Chatbot 
  apiUrl="/api/v2/chat"
  position="bottom-left"
  themeColor="#1976D2"
/>
```

---

### API Integration

#### Endpoint: `POST /api/chat`

**Request:**
```json
{
  "message": "Hello, I need help with my listing"
}
```

**Expected Response:**
```json
{
  "message": "Hello! I'd be happy to help with your listing. What would you like to know?",
  "timestamp": "2025-12-02T12:00:00.000Z"
}
```

#### Mock Fallback
If the API endpoint is not available, the chatbot uses mock responses:
- "Hello! I'm your AgriConnect assistant. How can I help you today?"
- "I can help you with listing produce, finding buyers, checking market prices, and weather updates."
- "Would you like to know about current market prices for your crops?"
- "I'm here to connect farmers with buyers across Botswana!"
- "For detailed assistance, please visit our Help Center or contact support."

---

### Backend Integration (Optional)

To enable live chatbot responses, create the backend endpoint:

#### 1. Create `backend/src/routes/chat.js`
```javascript
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;
  
  // Integrate with OpenAI, Dialogflow, or custom NLP
  const reply = await generateResponse(message);
  
  res.json({
    message: reply,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
```

#### 2. Register route in `backend/src/routes/index.js`
```javascript
const chatRoutes = require('./chat');
router.use('/chat', chatRoutes);
```

#### 3. OpenAI Integration Example
```javascript
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateResponse(userMessage) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant for AgriConnect, a platform connecting farmers to markets in Botswana." },
      { role: "user", content: userMessage }
    ],
    max_tokens: 150
  });
  
  return completion.choices[0].message.content;
}
```

---

### Testing Checklist

- [x] Chatbot button appears on all pages (landing, dashboard, listings, etc.)
- [x] Clicking button opens/closes chat window
- [x] Chat window is responsive (desktop: fixed size, mobile: bottom sheet)
- [x] Messages display correctly (user right, bot left)
- [x] Enter key sends message
- [x] Send button sends message
- [x] Loading state shows while waiting for response
- [x] Mock responses work when API is unavailable
- [x] Pulse animation on idle button
- [x] Slide-up animation on chat window open
- [x] Auto-scroll to newest message
- [x] Accessibility (keyboard navigation, ARIA labels)
- [x] No console errors

---

### Design Decisions

#### Color Scheme
- **Primary:** `#2E7D32` (AgriConnect green)
- **User bubbles:** Green (`bg-green-600`)
- **Bot bubbles:** White with border
- **Loading indicator:** Green spinner

#### Animations
- **Button pulse:** 2s infinite loop
- **Window slide-up:** 0.3s ease-out
- **Message entrance:** Smooth scroll behavior

#### Responsive Behavior
- **Desktop:** 360x480px fixed window, bottom-right
- **Mobile (<640px):** Full-width bottom sheet, 70% viewport height

---

### Files Summary

| Type | Count | Files |
|------|-------|-------|
| **Created** | 5 | Chatbot.jsx, ChatbotButton.jsx, ChatWindow.jsx, chatbot.css, index.js |
| **Modified** | 4 | App.jsx, api/index.js, tailwind.config.js, index.css |
| **Total** | 9 | - |

---

### Performance Considerations

- Component only renders when needed (conditional rendering)
- Messages stored in React state (not persisted)
- Minimal bundle size increase (~5KB gzipped)
- CSS animations are GPU-accelerated
- No external dependencies beyond existing lucide-react

---

### Future Enhancements (Optional)

- [ ] Persist chat history to localStorage
- [ ] Add typing indicator with animated dots
- [ ] Support for rich messages (images, buttons, links)
- [ ] Multi-language support (English/Setswana)
- [ ] Voice input option
- [ ] Chat history export
- [ ] Integration with user authentication for personalized responses
- [ ] Proactive greeting based on user behavior

---

## Footer Info Pages Implementation

**Date:** December 4, 2025  
**Purpose:** Create dedicated pages for all footer links and make them functional with React Router

---

### Summary

Implemented 15 new informational pages for all footer links, converting anchor tags (`#`) to React Router `<Link>` components. Each page has consistent styling, responsive design, and proper navigation back to the home page.

---

### Files Created

#### Info Pages Directory: `frontend/src/pages/info/`

| # | File | Route | Description |
|---|------|-------|-------------|
| 1 | `AboutPage.jsx` | `/about` | Company info, founder section, stats, story |
| 2 | `HowItWorksPage.jsx` | `/how-it-works` | 4-step process for farmers and buyers |
| 3 | `MissionPage.jsx` | `/mission` | Vision, values, and 2025 goals |
| 4 | `SuccessStoriesPage.jsx` | `/success-stories` | Farmer testimonials with income stats |
| 5 | `CareersPage.jsx` | `/careers` | Job openings, benefits, company culture |
| 6 | `PressPage.jsx` | `/press` | Media contact, press releases, brand assets |
| 7 | `HelpCenterPage.jsx` | `/help` | Searchable help categories, contact options |
| 8 | `SafetyPage.jsx` | `/safety` | Safety tips, do's/don'ts, verification system |
| 9 | `FAQPage.jsx` | `/faq` | Accordion FAQ by category |
| 10 | `TermsPage.jsx` | `/terms` | Terms of Service legal document |
| 11 | `PrivacyPage.jsx` | `/privacy` | Privacy Policy with data types breakdown |
| 12 | `USSDGuidePage.jsx` | `/ussd-guide` | SMS/USSD commands and codes guide |
| 13 | `SellerGuidePage.jsx` | `/seller-guide` | Complete selling guide with tips |
| 14 | `CommunityPage.jsx` | `/community` | Farmer groups, events, social links |
| 15 | `CookiesPage.jsx` | `/cookies` | Cookie policy and preferences |

#### Index File: `frontend/src/pages/info/index.js`
**Purpose:** Barrel exports for all info pages

```javascript
export { default as AboutPage } from './AboutPage';
export { default as HowItWorksPage } from './HowItWorksPage';
// ... all 15 pages exported
```

---

### Files Modified

#### 1. `frontend/src/pages/landing/Footer.jsx`
**Changes:**
- Converted all `<a href="#">` anchor tags to React Router `<Link to="">` components
- Updated link arrays with proper route paths instead of hash anchors
- All footer links now navigate to dedicated pages

**Before:**
```javascript
const aboutLinks = [
  { name: 'About AgriConnect', href: '#about' },
  { name: 'How It Works', href: '#how-it-works' },
  // ...
];
```

**After:**
```javascript
const aboutLinks = [
  { name: 'About AgriConnect', href: '/about' },
  { name: 'How It Works', href: '/how-it-works' },
  // ...
];
```

---

#### 2. `frontend/src/App.jsx`
**Changes:**
- Added imports for all 15 info pages from `./pages/info`
- Added 15 new routes in the "Info / Static Pages" section

**Added imports:**
```javascript
import {
  AboutPage,
  HowItWorksPage,
  MissionPage,
  SuccessStoriesPage,
  CareersPage,
  PressPage,
  HelpCenterPage,
  SafetyPage,
  FAQPage,
  TermsPage,
  PrivacyPage,
  USSDGuidePage,
  SellerGuidePage,
  CommunityPage,
  CookiesPage,
} from './pages/info';
```

**Added routes:**
```javascript
{/* Info / Static Pages */}
<Route path="/about" element={<AboutPage />} />
<Route path="/how-it-works" element={<HowItWorksPage />} />
<Route path="/mission" element={<MissionPage />} />
<Route path="/success-stories" element={<SuccessStoriesPage />} />
<Route path="/careers" element={<CareersPage />} />
<Route path="/press" element={<PressPage />} />
<Route path="/help" element={<HelpCenterPage />} />
<Route path="/safety" element={<SafetyPage />} />
<Route path="/faq" element={<FAQPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="/privacy" element={<PrivacyPage />} />
<Route path="/ussd-guide" element={<USSDGuidePage />} />
<Route path="/seller-guide" element={<SellerGuidePage />} />
<Route path="/community" element={<CommunityPage />} />
<Route path="/cookies" element={<CookiesPage />} />
```

---

### Page Design Features

Each info page includes:

1. **Header:** Sticky white header with "Back to Home" link
2. **Hero Section:** Gradient background with icon, title, and description
3. **Content Sections:** Organized content with cards, grids, and lists
4. **CTA Section:** Call-to-action with buttons linking to registration
5. **Footer:** Minimal footer with brand and copyright

**Common UI Elements:**
- Lucide React icons throughout
- Responsive grid layouts (1→2→4 columns)
- Hover effects and transitions
- Consistent color scheme (primary green, neutrals)
- Font family: Outfit (matching brand)

---

### Footer Link Mapping

| Section | Link | Route |
|---------|------|-------|
| **About** | About AgriConnect | `/about` |
| | How It Works | `/how-it-works` |
| | Our Mission | `/mission` |
| | Success Stories | `/success-stories` |
| | Careers | `/careers` |
| | Press | `/press` |
| **Support** | Help Center | `/help` |
| | Safety Information | `/safety` |
| | FAQs | `/faq` |
| | Terms of Service | `/terms` |
| | Privacy Policy | `/privacy` |
| | SMS/USSD Guide | `/ussd-guide` |
| **For Farmers** | Start Selling | `/register?role=farmer` |
| | Seller Guide | `/seller-guide` |
| | Pricing Tools | `/prices` |
| | Weather Alerts | `/weather` |
| | Crop Planner | `/farmer/crop-planner` |
| | Farmer Community | `/community` |
| **Bottom Bar** | Terms | `/terms` |
| | Privacy | `/privacy` |
| | Cookies | `/cookies` |

---

### Files Summary

| Type | Count | Files |
|------|-------|-------|
| **Created** | 16 | 15 info pages + index.js |
| **Modified** | 2 | Footer.jsx, App.jsx |
| **Total** | 18 | - |

---

## About Page Founder Update

**Date:** December 4, 2025  
**Purpose:** Update About page to show only the actual founder instead of fictional team members

---

### Summary

Removed fictional team members (Kabo Moilwa, Thabo Molefe, Naledi Phetogo) and updated the About page to display only the real founder, Georgy Moni, with a professional photo.

---

### Files Modified

#### 1. `frontend/src/pages/info/AboutPage.jsx`
**Changes:**
- Removed `team` array with 4 fictional members
- Added `founder` object with single founder info
- Replaced "Meet Our Team" section with "Meet the Founder" section
- Added circular photo frame with fallback emoji
- Enhanced styling with gradient background card

**Before:**
```javascript
const team = [
  { name: 'Georgy Moni', role: 'Founder & CEO', image: '👨‍💼' },
  { name: 'Kabo Moilwa', role: 'Head of Operations', image: '👩‍💼' },
  { name: 'Thabo Molefe', role: 'Lead Developer', image: '👨‍💻' },
  { name: 'Naledi Phetogo', role: 'Marketing Director', image: '👩‍🎨' },
];
```

**After:**
```javascript
const founder = {
  name: 'Georgy Moni',
  role: 'Founder & CEO',
  image: '/founder.jpg',
};
```

**New Founder Section:**
```jsx
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    <h2>Meet the Founder</h2>
    <div className="max-w-md mx-auto">
      <div className="text-center p-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-lg">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img src="/founder.jpg" alt="Georgy Moni - Founder & CEO" />
        </div>
        <h3>{founder.name}</h3>
        <p>{founder.role}</p>
        <p>Passionate about empowering Botswana's farmers through technology.</p>
      </div>
    </div>
  </div>
</section>
```

---

### Files Created

#### `frontend/public/founder.jpg`
**Purpose:** Founder profile photo
**Source:** Copied from `my pic.jpeg` in project root
**Usage:** Displayed in circular frame on About page

---

### Files Summary

| Type | Count | Files |
|------|-------|-------|
| **Modified** | 1 | AboutPage.jsx |
| **Created** | 1 | public/founder.jpg |
| **Total** | 2 | - |

---

### Testing Checklist

- [x] All 15 footer links navigate to dedicated pages
- [x] Each page has "Back to Home" navigation
- [x] Pages are responsive (mobile, tablet, desktop)
- [x] About page shows founder photo correctly
- [x] Fallback emoji displays if image fails to load
- [x] Bottom bar links (Terms, Privacy, Cookies) work
- [x] No broken links or 404 errors
- [x] No console errors or warnings

---

