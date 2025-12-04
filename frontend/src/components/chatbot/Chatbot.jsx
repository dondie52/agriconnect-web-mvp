/**
 * Chatbot Component
 * Main container for the floating chatbot widget
 * 
 * Props:
 * - apiUrl: API endpoint for chat (default: "/api/chat")
 * - position: Position of the chatbot button (default: "bottom-right")
 * - themeColor: Primary color for the chatbot (default: "#2E7D32")
 */
import React, { useState, useCallback } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatWindow from './ChatWindow';
import { chatAPI } from '../../api';
import './chatbot.css';

const Chatbot = ({
  apiUrl = '/api/chat',
  position = 'bottom-right',
  themeColor = '#2E7D32',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Position styles based on prop
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((value) => {
    setInputValue(value);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      text: trimmedMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try to call the API
      const response = await chatAPI.sendMessage(trimmedMessage);
      const botReply = response.data?.message || response.data?.reply || 
        "I received your message. How can I assist you further?";

      const botMessage = {
        sender: 'bot',
        text: botReply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log('Chat API not available, using fallback response');
      
      // Context-aware fallback responses
      const lowerMessage = trimmedMessage.toLowerCase();
      let fallbackResponse;
      
      if (lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        fallbackResponse = "I can help you find produce! Check the Listings page to browse available crops, or tell me what you're looking for.";
      } else if (lowerMessage.includes('sell') || lowerMessage.includes('post') || lowerMessage.includes('list')) {
        fallbackResponse = "To sell your produce, go to Create Listing from the menu. You'll add details like crop type, quantity, and price. Would you like guidance?";
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        fallbackResponse = "Check the Market Prices page to see current prices for crops across Botswana regions.";
      } else if (lowerMessage.includes('plant') || lowerMessage.includes('grow') || lowerMessage.includes('farm')) {
        fallbackResponse = "For farming in Botswana: wet season (Nov-Mar) is best for maize, sorghum, and millet. Dry season suits irrigated vegetables like tomatoes and spinach.";
      } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        fallbackResponse = "I can help you with finding produce, creating listings, checking prices, or navigating AgriConnect. What do you need?";
      } else if (lowerMessage.match(/^(hi|hello|hey|dumela)/)) {
        fallbackResponse = "Dumela! 👋 Welcome to AgriConnect. I can help you buy or sell produce, get farming tips, or navigate the platform. What can I help with?";
      } else {
        fallbackResponse = "I'm here to help! I can assist with:\n• Finding produce to buy\n• Creating listings to sell\n• Checking market prices\n• Farming tips for Botswana\n\nWhat would you like help with?";
      }
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const botMessage = {
        sender: 'bot',
        text: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSendMessage={sendMessage}
          onClose={toggleChat}
          themeColor={themeColor}
        />
      )}

      {/* Floating Button */}
      <div className={`fixed z-50 ${positionStyles[position] || positionStyles['bottom-right']}`}>
        <ChatbotButton
          isOpen={isOpen}
          onClick={toggleChat}
          themeColor={themeColor}
        />
      </div>
    </>
  );
};

export default Chatbot;



