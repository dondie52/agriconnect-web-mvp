/**
 * Chat Routes for AgriConnect
 * Endpoints for AI-powered chatbot assistant
 */
const express = require('express');
const router = express.Router();
const generateAIResponse = require('../ai/responseGenerator');

/**
 * POST /api/chat
 * Send a message to the AgriConnect Assistant
 * 
 * Body: {
 *   message: string (the user's message),
 *   context?: { weather?: { temperature, rainChance, windSpeed } }
 * }
 * 
 * Response: {
 *   success: boolean,
 *   reply: string (the assistant's response)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const reply = await generateAIResponse(message.trim(), context || {});
    
    res.json({ 
      success: true,
      reply 
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ 
      success: false,
      reply: "Something went wrong, try again." 
    });
  }
});

module.exports = router;
