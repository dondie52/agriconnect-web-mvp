/**
 * ChatbotButton Component
 * Floating circular button that opens the chat window
 */
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatbotButton = ({ isOpen, onClick, themeColor = '#2E7D32' }) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      aria-expanded={isOpen}
      className={`
        w-[60px] h-[60px] rounded-full shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300
        ${isOpen ? 'bg-neutral-700 hover:bg-neutral-800' : 'chatbot-pulse'}
      `}
      style={{ 
        backgroundColor: isOpen ? undefined : themeColor,
      }}
    >
      {isOpen ? (
        <X size={28} className="text-white" />
      ) : (
        <MessageCircle size={28} className="text-white" />
      )}
    </button>
  );
};

export default ChatbotButton;



