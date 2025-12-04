/**
 * AI Routes for AgriConnect
 * Endpoints for AI-powered features
 */
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * POST /api/ai/farming-tips
 * Generate AI-powered farming tips based on weather data
 * 
 * Body: {
 *   weather: { temperature, highTemp, lowTemp, description, windspeed, precipitationChance },
 *   forecast: [{ date, highTemp, lowTemp, precipitationChance, description }],
 *   location: string (region name),
 *   cropType?: string (optional crop focus)
 * }
 * 
 * Response: {
 *   success: boolean,
 *   tips: string[],
 *   source: 'openai' | 'groq' | 'anthropic' | 'static'
 * }
 */
router.post('/farming-tips', aiController.getFarmingTips);

module.exports = router;



