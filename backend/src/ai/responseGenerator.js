/**
 * AI Smart Response Generator for AgriConnect
 * Main orchestrator that routes messages to appropriate handlers
 */

const weatherTips = require('./weatherTips');
const cropAdvisor = require('./cropAdvisor');
const { classifyIntent } = require('./intents');
const systemPrompt = require('./systemPrompt');
const { callLLM } = require('./llmHelper');

/**
 * Generate AI response based on user message and context
 * @param {string} userMessage - The user's message
 * @param {Object} context - Optional context (e.g., weather data)
 * @returns {Promise<string>} - The AI response
 */
module.exports = async function generateAIResponse(userMessage, context = {}) {
  const intent = classifyIntent(userMessage);

  switch (intent) {
    case 'BUY_PRODUCT':
      return "I can help you find sellers. What crop and which region are you looking in?";

    case 'SELL_PRODUCT':
      return "You can post your product on AgriConnect. Should I guide you to the Create Listing page?";

    case 'FARMING_ADVICE':
      return cropAdvisor(userMessage);

    case 'WEATHER_ADVICE':
      return weatherTips(context.weather);

    case 'MARKET_PRICES':
      return "You can check current market prices in the Market Prices section. Want me to summarise top crops today?";

    case 'PLATFORM_HELP':
      return "I can help you with your AgriConnect account, listings, or orders. What do you need help with?";

    default:
      // Fallback → send to LLM for natural conversation
      return callLLM(systemPrompt, userMessage);
  }
};


