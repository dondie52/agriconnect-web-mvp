/**
 * AI Controller for AgriConnect
 * Provides AI-powered farming tips using OpenAI, Groq, or Anthropic
 * Auto-detects provider based on available API keys
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
 * Build farming tips prompt for Botswana context
 */
const buildFarmingPrompt = ({ weather, forecast, location, cropType }) => {
  const forecastSummary = forecast?.slice(0, 7).map((day, i) => {
    const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return `${date}: ${day.highTemp}°/${day.lowTemp}°C, ${day.precipitationChance}% rain, ${day.description}`;
  }).join('\n') || 'No forecast data available';

  return `You are an expert agricultural advisor specializing in Botswana's farming conditions. Generate 3-5 practical, actionable farming tips based on the current weather and forecast.

LOCATION: ${location}, Botswana

CURRENT CONDITIONS:
- Temperature: ${weather.temperature}°C
- High/Low Today: ${weather.highTemp}°/${weather.lowTemp}°C
- Weather: ${weather.description}
- Wind Speed: ${weather.windspeed} km/h
- Rain Probability: ${weather.precipitationChance}%

7-DAY FORECAST:
${forecastSummary}

${cropType ? `CROP FOCUS: ${cropType}` : 'GENERAL FARMING ADVICE'}

IMPORTANT CONTEXT:
- Botswana has a semi-arid climate with distinct wet (Nov-Mar) and dry (Apr-Oct) seasons
- Water conservation is critical
- Most farmers are smallholders growing maize, sorghum, millet, beans, and vegetables
- Consider local practices and accessible resources

Respond with ONLY a JSON array of 3-5 tip strings. Each tip should be:
- Specific and actionable
- Relevant to the current weather conditions
- Practical for Botswana farmers
- 1-2 sentences maximum

Example format:
["Tip 1 here.", "Tip 2 here.", "Tip 3 here."]`;
};

const aiController = {
  /**
   * Generate AI-powered farming tips
   * POST /api/ai/farming-tips
   */
  async getFarmingTips(req, res) {
    try {
      const { weather, forecast, location, cropType } = req.body;

      // Validate required fields
      if (!weather || !location) {
        return res.status(400).json({
          success: false,
          message: 'Weather data and location are required'
        });
      }

      // Get AI client
      const aiConfig = getAIClient();
      
      if (!aiConfig) {
        // Fallback to static tips if no AI provider configured
        console.warn('No AI provider configured. Returning static tips.');
        return res.json({
          success: true,
          tips: getStaticTips(weather),
          source: 'static'
        });
      }

      const { client, model, provider } = aiConfig;
      const prompt = buildFarmingPrompt({ weather, forecast, location, cropType });

      // Call AI API
      const completion = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful agricultural advisor for Botswana farmers. Always respond with valid JSON arrays only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      
      // Parse JSON response
      let tips;
      try {
        // Handle potential markdown code blocks in response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          tips = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        // Fallback: split by newlines if JSON parsing fails
        tips = responseText
          .split('\n')
          .filter(line => line.trim().length > 10)
          .slice(0, 5)
          .map(line => line.replace(/^[\d\-\*\.]+\s*/, '').trim());
      }

      // Ensure we have valid tips
      if (!Array.isArray(tips) || tips.length === 0) {
        return res.json({
          success: true,
          tips: getStaticTips(weather),
          source: 'static'
        });
      }

      res.json({
        success: true,
        tips: tips.slice(0, 5), // Limit to 5 tips max
        source: provider
      });

    } catch (error) {
      console.error('AI farming tips error:', error);
      
      // Return static tips on error
      const weather = req.body?.weather || {};
      res.json({
        success: true,
        tips: getStaticTips(weather),
        source: 'static',
        error: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }
  }
};

/**
 * Static fallback tips based on weather conditions
 */
function getStaticTips(weather) {
  const tips = [];
  
  // Temperature-based tips
  if (weather.temperature > 30) {
    tips.push('High temperatures expected - irrigate early morning or late evening to reduce water evaporation.');
  } else if (weather.temperature > 25) {
    tips.push('Warm conditions are ideal for most crops - ensure consistent watering schedules.');
  } else if (weather.temperature < 15) {
    tips.push('Cool temperatures - protect frost-sensitive crops with covers overnight.');
  } else {
    tips.push('Moderate temperatures are favorable for field work and crop growth.');
  }
  
  // Precipitation-based tips
  if (weather.precipitationChance > 50) {
    tips.push('Rain expected - excellent time for planting. Delay pesticide application until after rainfall.');
  } else if (weather.precipitationChance > 30) {
    tips.push('Moderate rain chance - plan outdoor activities with flexibility and have covers ready.');
  } else if (weather.precipitationChance < 20) {
    tips.push('Low rain probability - monitor soil moisture levels closely and consider irrigation.');
  }
  
  // Wind-based tips
  if (weather.windspeed > 20) {
    tips.push('Strong winds expected - secure any loose coverings, stakes, and protect young seedlings.');
  } else if (weather.windspeed > 10) {
    tips.push('Moderate winds provide good natural ventilation for crops and can help dry wet foliage.');
  }
  
  // General Botswana-specific tips
  const generalTips = [
    'Check soil moisture before watering - Botswana soils often retain moisture longer than expected.',
    'Consider mulching around plants to conserve water in the semi-arid climate.',
    'Plan irrigation during cooler parts of the day to minimize evaporation losses.',
    'Monitor your crops for signs of heat stress during the dry season.'
  ];
  
  // Add general tips if we need more
  while (tips.length < 4 && generalTips.length > 0) {
    tips.push(generalTips.shift());
  }
  
  return tips.slice(0, 5);
}

module.exports = aiController;

