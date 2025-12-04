/**
 * Intent Classifier for AgriConnect Chatbot
 * Detects user intent from message content
 */

module.exports = {
  classifyIntent(message) {
    const text = message.toLowerCase();

    if (text.includes('buy') || text.includes('looking for') || text.includes('purchase') || text.includes('find')) {
      return 'BUY_PRODUCT';
    }
    
    if (text.includes('sell') || text.includes('post product') || text.includes('list my') || text.includes('create listing')) {
      return 'SELL_PRODUCT';
    }
    
    if (text.includes('plant') || text.includes('grow') || text.includes('crop') || text.includes('harvest') || text.includes('farm')) {
      return 'FARMING_ADVICE';
    }
    
    if (text.includes('weather') || text.includes('rain') || text.includes('temperature') || text.includes('forecast')) {
      return 'WEATHER_ADVICE';
    }
    
    if (text.includes('price') || text.includes('market') || text.includes('cost') || text.includes('how much')) {
      return 'MARKET_PRICES';
    }
    
    if (text.includes('help') || text.includes('support') || text.includes('how do i') || text.includes('guide')) {
      return 'PLATFORM_HELP';
    }

    return 'GENERAL';
  }
};

