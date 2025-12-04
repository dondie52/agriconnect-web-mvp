/**
 * ChatWindow Component
 * The main chat window with messages and input
 */
import React, { useEffect, useRef } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';

const ChatWindow = ({
  messages,
  inputValue,
  isLoading,
  onInputChange,
  onSendMessage,
  onClose,
  themeColor = '#2E7D32',
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when window opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div
      className="
        chatbot-slide-up
        fixed z-50
        bg-white rounded-xl shadow-2xl border border-green-200
        flex flex-col overflow-hidden
        /* Mobile: full width bottom sheet */
        bottom-0 left-0 right-0 h-[70vh]
        /* Desktop: fixed size bottom-right */
        sm:bottom-24 sm:right-6 sm:left-auto
        sm:w-[360px] sm:h-[480px] sm:rounded-xl
      "
      role="dialog"
      aria-label="Chat with AgriConnect Assistant"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-green-100"
        style={{ backgroundColor: themeColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">AgriConnect Assistant</h3>
            <p className="text-xs text-white/80">Online • Here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-neutral-800 mb-2">Welcome! 👋</h4>
            <p className="text-sm text-neutral-500">
              I'm your AgriConnect assistant. How can I help you today?
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] px-4 py-2.5 rounded-2xl text-sm
                ${message.sender === 'user'
                  ? 'bg-green-600 text-white rounded-br-md'
                  : 'bg-white text-neutral-800 shadow-sm border border-neutral-200 rounded-bl-md'
                }
              `}
            >
              {message.text}
              {message.timestamp && (
                <span className={`block text-[10px] mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-neutral-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-neutral-800 shadow-sm border border-neutral-200 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-green-600" />
                <span className="text-sm text-neutral-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="
              flex-1 px-4 py-2.5 border border-neutral-300 rounded-full
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
              placeholder:text-neutral-400 text-sm
              disabled:bg-neutral-100 disabled:cursor-not-allowed
            "
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="
              w-10 h-10 rounded-full flex items-center justify-center
              bg-green-600 text-white
              hover:bg-green-700 transition-colors
              disabled:bg-neutral-300 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            "
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-neutral-400 text-center mt-2">
          Powered by AgriConnect 🌿
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;


