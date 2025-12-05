/**
 * LLM Helper for AgriConnect
 * Provides AI client configuration and LLM calling functionality
 */

const OpenAI = require('openai');

/**
 * Get AI client configuration based on available API keys
 * Priority: OpenAI > Groq > Anthropic
 */
function getAIClient() {
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
}

/**
 * Call LLM with system prompt and user message
 * @param {string} systemPrompt - The system prompt for the AI
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The AI response
 */
async function callLLM(systemPrompt, userMessage) {
  const aiConfig = getAIClient();
  
  if (!aiConfig) {
    // No AI provider configured, return a helpful fallback
    return "I'm here to help! I can assist you with finding produce to buy, creating listings to sell, checking market prices, farming tips for Botswana, and navigating AgriConnect. What would you like help with?";
  }

  const { client, model } = aiConfig;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    
    if (!reply) {
      return "I'm here to help! What would you like to know about AgriConnect or farming in Botswana?";
    }

    return reply;
  } catch (error) {
    console.error('LLM call error:', error);
    return "I'm here to help! I can assist you with finding produce to buy, creating listings to sell, checking market prices, farming tips for Botswana, and navigating AgriConnect. What would you like help with?";
  }
}

module.exports = {
  getAIClient,
  callLLM
};


