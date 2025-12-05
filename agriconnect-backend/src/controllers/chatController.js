/**
 * Chat Controller for AgriConnect
 * AI-powered chatbot assistant for Botswana farmers and buyers
 * Provides contextual help for platform features, farming advice, and marketplace guidance
 */
const OpenAI = require('openai');

/**
 * Get AI client configuration based on available API keys
 * Priority: OpenAI > Groq > Anthropic
 */
const getAIClient = () => {
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      provider: 'openai'
    };
  }
  
  if (process.env.GROQ_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
      }),
      model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
      provider: 'groq'
    };
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.ANTHROPIC_API_KEY,
        baseURL: 'https://api.anthropic.com/v1'
      }),
      model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
      provider: 'anthropic'
    };
  }
  
  return null;
};

/**
 * System prompt for AgriConnect Assistant
 * Defines personality, capabilities, and Botswana-specific context
 */
const SYSTEM_PROMPT = `You are **AgriConnect Assistant**, an AI agent built for the AgriConnect platform in Botswana.

Your job is to help farmers and buyers with REAL platform features — not generic support answers.

Always answer using Botswana context, common crops, regions, and local agricultural behavior.

## 🎯 Your MAIN GOALS:

1. **Help buyers find produce**
   - If user says "I want to buy cotton", respond:
     "I can help you find cotton. Would you like nearby sellers or all available listings?"
   - Ask follow-up questions (crop, quantity, region).

2. **Help farmers sell produce**
   - If user says "I want to sell tomatoes", respond:
     "Great! You can create a listing at /farmer/create-listing. Want me to walk you through it?"

3. **Give real farming assistance**
   - Provide weather-based tips (direct them to /weather for detailed forecasts).
   - Provide planting suggestions based on season/month.
   - Suggest common Botswana crops (maize, sorghum, tomatoes, spinach, beans, groundnuts, etc.)
   - Guide farmers to the Crop Planner for seasonal planning.

4. **Guide users inside the platform**
   - If user asks about prices → tell them to check Market Prices (/prices).
   - If user asks "how do I post?" → guide them to Create Listing (/farmer/create-listing).
   - If user says "where is help center?" → give AgriConnect-style helpful guidance, NOT a generic call-center answer.

5. **NEVER say generic things like "visit help center", "contact support" unless explicitly asked for official support.
   You are a proactive assistant — always provide real value.**

## 🔍 Role Detection:
- If user mentions "sell", "my crops", "my farm", "my harvest" → likely a FARMER
- If user mentions "buy", "looking for", "need", "purchase" → likely a BUYER
- When unclear, ask: "Are you looking to buy or sell?"
- Tailor navigation guidance based on detected role

## 🚫 Forbidden Responses:
- "Visit our help center"
- "Contact support"
- "I am here to connect farmers" (generic)
- "I cannot help with that" → Instead ask clarifying questions.
- Do NOT hallucinate phone numbers or official contacts.

## ✔ If user asks for help center:
Say:
"I can help you right here! Whether it's account settings, listings, buying, or selling — just tell me what you need and I'll guide you step-by-step."

## 🌿 Platform Features You Can Guide Users To:

### For Farmers:
- **Farmer Dashboard** (/farmer/dashboard): Overview, weather widget, quick actions
- **Create Listing** (/farmer/create-listing): Post produce for sale
- **My Listings** (/farmer/my-listings): View and manage your listings
- **Crop Planner** (/farmer/crop-planner): Plan your growing season
- **Analytics** (/farmer/analytics): Track your sales performance

### For Buyers:
- **Browse Listings** (/buyer/dashboard or /listings): Find available produce
- **Create Request** (/buyer/create-request): Post what produce you need

### Shared Pages:
- **Market Prices** (/prices): Current crop prices by region
- **Buyer Requests** (/buyer-requests): See what buyers are looking for (farmers can respond!)
- **Weather** (/weather): Detailed weather forecasts for your region
- **Notifications** (/notifications): Alerts and updates

## 📅 Botswana Agricultural Calendar:
- **Oct-Nov**: Land preparation, early planting if rains arrive
- **Nov-Jan**: Main planting season (maize, sorghum, millet, groundnuts)
- **Feb-Mar**: Weeding, pest control, late planting possible
- **Apr-Jun**: Harvest season for rain-fed crops
- **Jul-Sep**: Dry season — irrigated vegetables, land clearing, planning

## 🗺 Regional Considerations:
- **Northern (Chobe, Ngamiland, Maun, Kasane)**: Higher rainfall, more diverse crops possible
- **Central (Serowe, Palapye, Mahalapye)**: Cattle country, millet and sorghum do well
- **Southern (Gaborone, Lobatse, Kanye, Molepolole)**: Peri-urban areas, vegetables popular
- **Western (Ghanzi, Kgalagadi)**: Very dry, limited to drought-hardy crops

## 🌾 Botswana Agricultural Context:
- **Regions**: Gaborone, Francistown, Maun, Kasane, Serowe, Palapye, Mahalapye, Lobatse, Selebi-Phikwe, Jwaneng, Orapa, Letlhakane, Mochudi, Kanye, Molepolole, Ramotswa
- **Common Crops**: Maize, sorghum, millet, beans, groundnuts, cowpeas, sunflower, cotton, vegetables (tomatoes, spinach, cabbage, onions, peppers)
- **Climate**: Semi-arid, water conservation is critical
- **Currency**: Botswana Pula (BWP)
- **Units**: Hectares for land, kg for produce

## 🗣 Setswana Phrases (use sparingly to connect):
- Dumela (Hello)
- Ke a leboga (Thank you)
- Go siame (It's fine / Okay)
- Le kae? (How are you?)

Always respond in English, but recognize and acknowledge Setswana greetings warmly.

## 📝 Response Format:
- Keep answers to 2-4 sentences for simple questions
- Use bullet points only for lists of 3+ items
- End with ONE actionable suggestion or question
- Avoid walls of text — this is a chat widget, not documentation
- Be warm but efficient

## 🍀 Personality:
Friendly, knowledgeable, helpful. Uses simple language farmers understand.
No technical jargon unless user asks. No corporate tone.
You're like a helpful neighbor who knows farming and technology.`;

/**
 * Detect user intent and provide appropriate static fallback response
 */
const getStaticResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  const crops = ['maize', 'sorghum', 'tomatoes', 'spinach', 'beans', 'groundnuts', 'cotton', 'millet', 'cabbage', 'onions', 'cowpeas', 'sunflower', 'peppers'];
  const mentionedCrop = crops.find(crop => lowerMessage.includes(crop));
  
  // Buying intent
  if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('looking for') || lowerMessage.includes('need')) {
    if (mentionedCrop) {
      return `I can help you find ${mentionedCrop}! Browse available listings at /listings or go to /buyer/create-request to post what you need. Which region are you in?`;
    }
    return "I can help you find produce! Head to /listings to browse, or tell me what crop you're looking for — maize, sorghum, tomatoes, beans, groundnuts?";
  }
  
  // Selling intent
  if (lowerMessage.includes('sell') || lowerMessage.includes('post') || lowerMessage.includes('list my') || lowerMessage.includes('my crop') || lowerMessage.includes('my harvest')) {
    if (mentionedCrop) {
      return `Great! To sell your ${mentionedCrop}, go to /farmer/create-listing. Add your quantity (kg), price (Pula), and photos. Want me to explain the process?`;
    }
    return "You can post your produce at /farmer/create-listing! Add crop type, quantity, price, and photos. Also check /buyer-requests to see what buyers are looking for. What would you like to sell?";
  }
  
  // Buyer requests
  if (lowerMessage.includes('request') || lowerMessage.includes('what buyers want') || lowerMessage.includes('buyer looking')) {
    return "Check /buyer-requests to see what buyers are actively looking for. As a farmer, you can respond to these requests directly. As a buyer, post your needs at /buyer/create-request.";
  }
  
  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('pula')) {
    return "Check Market Prices at /prices to see current rates for crops across Botswana regions. Prices are in Pula per kg. Is there a specific crop you want to check?";
  }
  
  // Crop planner
  if (lowerMessage.includes('plan') || lowerMessage.includes('planner') || lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
    return "The Crop Planner at /farmer/crop-planner helps you plan your growing season. It shows optimal planting times based on Botswana's climate. Want tips for what to plant this month?";
  }
  
  // Analytics / performance
  if (lowerMessage.includes('analytics') || lowerMessage.includes('performance') || lowerMessage.includes('stats') || lowerMessage.includes('sales report')) {
    return "Track your sales performance at /farmer/analytics! See your listing views, sales trends, and top-performing crops. Great for planning what to grow next season.";
  }
  
  // Planting/farming advice
  if (lowerMessage.includes('plant') || lowerMessage.includes('grow') || lowerMessage.includes('farm') || lowerMessage.includes('crop') || lowerMessage.includes('season')) {
    const currentMonth = new Date().getMonth();
    // Oct-Nov: preparation, Nov-Jan: main planting, Feb-Mar: weeding, Apr-Jun: harvest, Jul-Sep: dry
    if (currentMonth >= 10 || currentMonth === 0) { // Nov-Jan
      return "It's main planting season! Maize, sorghum, millet, and groundnuts do well now. Plant early in the rains for best results. Check the Crop Planner at /farmer/crop-planner for detailed guidance.";
    } else if (currentMonth >= 1 && currentMonth <= 2) { // Feb-Mar
      return "Focus on weeding and pest control now. Late planting is still possible for quick-maturing crops. Keep an eye on your fields — this is a critical growth period.";
    } else if (currentMonth >= 3 && currentMonth <= 5) { // Apr-Jun
      return "Harvest season for rain-fed crops! Start selling your produce on AgriConnect. Create listings at /farmer/create-listing. Also consider what buyers are requesting at /buyer-requests.";
    }
    // Jul-Sep (dry season)
    return "Dry season — focus on irrigated vegetables like tomatoes, spinach, and cabbage. Also a good time to prepare land and plan for the wet season (starts November). Check /farmer/crop-planner.";
  }
  
  // Weather questions
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('forecast') || lowerMessage.includes('temperature')) {
    return "Check the Weather page at /weather for detailed forecasts for your region. Your Dashboard also shows a weather widget with farming recommendations. Which district are you in?";
  }
  
  // Dashboard
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview') || lowerMessage.includes('home')) {
    return "Your Dashboard shows an overview of your activity, weather updates, and quick actions. Farmers: /farmer/dashboard. Buyers: /buyer/dashboard. Are you a farmer or buyer?";
  }
  
  // Listings management
  if (lowerMessage.includes('my listing') || lowerMessage.includes('edit listing') || lowerMessage.includes('manage listing') || lowerMessage.includes('delete listing')) {
    return "Manage all your listings at /farmer/my-listings. You can edit prices, update quantities, or remove listings. Need help with a specific listing?";
  }
  
  // Notifications
  if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('update')) {
    return "Check /notifications for all your alerts — new orders, messages from buyers, price updates, and more. You'll also see a bell icon in the menu when you have new notifications.";
  }
  
  // Help center / support
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact') || lowerMessage.includes('how do i')) {
    return "I can help you right here! Whether it's creating listings, finding produce, checking prices, or using the Crop Planner — just tell me what you need. What would you like to do?";
  }
  
  // Orders / transactions
  if (lowerMessage.includes('order') || lowerMessage.includes('transaction') || lowerMessage.includes('delivery')) {
    return "Track orders from your Dashboard. Farmers see incoming orders there, buyers can track purchases. Need help with a specific order?";
  }
  
  // Account / profile
  if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('settings') || lowerMessage.includes('region')) {
    return "Update your account details in your Profile settings. You can change your region, contact info, and preferences. Is there something specific you'd like to update?";
  }
  
  // Greetings (including Setswana)
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening|dumela|dumelang|le kae|o kae)/)) {
    return "Dumela! 👋 Welcome to AgriConnect. I'm here to help you buy or sell produce, get farming tips, or navigate the platform. Are you looking to buy or sell today?";
  }
  
  // Thank you (including Setswana)
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('leboga') || lowerMessage.includes('ke a leboga')) {
    return "Ke a leboga! 🌿 Feel free to ask if you need anything else. Happy farming!";
  }
  
  // Goodbye
  if (lowerMessage.match(/^(bye|goodbye|go siame|sala sentle)/)) {
    return "Go siame! 👋 Come back anytime you need help with AgriConnect. Happy farming!";
  }
  
  // Default helpful response
  return "I'm here to help! I can assist you with:\n• Finding produce to buy (/listings)\n• Creating listings to sell (/farmer/create-listing)\n• Checking market prices (/prices)\n• Planning your crops (/farmer/crop-planner)\n• Weather forecasts (/weather)\n\nAre you a farmer or buyer?";
};

const chatController = {
  /**
   * Handle chat message
   * POST /api/chat
   */
  async sendMessage(req, res) {
    try {
      const { message } = req.body;

      // Validate message
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      const trimmedMessage = message.trim();

      // Get AI client
      const aiConfig = getAIClient();
      
      if (!aiConfig) {
        // Fallback to static responses if no AI provider configured
        console.warn('No AI provider configured. Using static responses.');
        return res.json({
          success: true,
          reply: getStaticResponse(trimmedMessage),
          source: 'static'
        });
      }

      const { client, model, provider } = aiConfig;

      // Call AI API
      const completion = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: trimmedMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const reply = completion.choices[0]?.message?.content?.trim();

      if (!reply) {
        // Fallback if AI returns empty response
        return res.json({
          success: true,
          reply: getStaticResponse(trimmedMessage),
          source: 'static'
        });
      }

      res.json({
        success: true,
        reply,
        source: provider
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Return static response on error
      const message = req.body?.message || '';
      res.json({
        success: true,
        reply: getStaticResponse(message),
        source: 'static',
        error: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }
  }
};

module.exports = chatController;

