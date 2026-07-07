import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Derrick, your Palm Bay land assistant. I can help you with questions about available lots, pricing, financing options, and more. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reset session when chat is opened fresh
  const resetChat = () => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm Derrick, your Palm Bay land assistant. I can help you with questions about available lots, pricing, financing options, and more. What would you like to know?"
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Use a unique request ID for each message to avoid caching
      const requestId = `${sessionId}_${Date.now()}`;
      
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: requestId
      });

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please call Vahid directly at 321-333-7230 for immediate assistance."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-amber-600 hover:bg-amber-700 text-white pl-4 pr-5 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 font-semibold"
          aria-label="Ask Derrick — chat with our land assistant"
          data-testid="chat-open-btn"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Questions? Ask Derrick</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200" style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Chat with Derrick</h3>
                <p className="text-xs text-slate-300">Ask about lots, pricing & more</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-xs"
                aria-label="New chat"
                title="Start new chat"
              >
                New Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close chat"
                data-testid="chat-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-amber-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-md'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span className="text-sm text-slate-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about lots, pricing, financing..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                disabled={isLoading}
                data-testid="chat-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="chat-send-btn"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              For immediate help, call <a href="tel:3213337230" className="text-amber-600 font-medium">321-333-7230</a>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
