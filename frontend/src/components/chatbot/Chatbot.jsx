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
      console.log('Chat API not available, using mock response');
      
      // Mock response fallback
      const mockResponses = [
        "Hello! I'm your AgriConnect assistant. How can I help you today?",
        "I can help you with listing produce, finding buyers, checking market prices, and weather updates.",
        "Would you like to know about current market prices for your crops?",
        "I'm here to connect farmers with buyers across Botswana!",
        "For detailed assistance, please visit our Help Center or contact support.",
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const botMessage = {
        sender: 'bot',
        text: randomResponse,
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


