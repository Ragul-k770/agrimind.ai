import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Leaf } from 'lucide-react';

const ChatUI = ({ isOffline }) => {
  const [messages, setMessages] = useState(() => {
    const cached = localStorage.getItem('agrimind_chat');
    return cached ? JSON.parse(cached) : [
      { role: 'assistant', content: "Hello! I am AgriMind AI, your expert farming assistant. What crop issue can I help with today?", timestamp: new Date().toISOString() }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Cache messages
    localStorage.setItem('agrimind_chat', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isOffline) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Connect to the Express Backend AI API (Mock or HuggingFace depending on the backend .env)
      const response = await fetch(`http://${window.location.hostname}:5000/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Sorry, I could not reach the server. Are you offline?", timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl border-white/5 bg-black/40 overflow-hidden relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            
            <div className={`flex max-w-[80%] md:max-w-2xl gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-agrimind-600' : 'bg-gradient-to-br from-agrimind-700 to-agrimind-900 border border-agrimind-500/50'
              }`}>
                {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={22} className="text-agrimind-400" />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-agrimind-600/90 text-white rounded-tr-none' 
                  : 'bg-black/60 border border-white/10 text-gray-200 rounded-tl-none shadow-lg'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="mb-2 pb-2 border-b border-white/5 font-semibold text-agrimind-500 flex items-center gap-2 text-xs">
                    <Leaf size={12}/> AgriMind AI
                  </div>
                )}
                {/* Basic Markdown rendering fix simulation */}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="mt-2 text-xs opacity-40 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex bg-black/60 border border-white/10 rounded-2xl rounded-tl-none p-4 space-x-2">
              <div className="w-2 h-2 bg-agrimind-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-agrimind-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-agrimind-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/60 border-t border-white/5 backdrop-blur-md relative z-10">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isOffline || isTyping}
            placeholder={isOffline ? "You are offline..." : "Ask me about your crops..."}
            className="w-full bg-white/5 border border-white/10 focus:border-agrimind-500 rounded-full py-4 pl-6 pr-16 outline-none text-white placeholder-gray-500 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isOffline || isTyping}
            className="absolute right-2 p-2.5 bg-gradient-to-r from-agrimind-600 to-agrimind-500 hover:from-agrimind-500 hover:to-agrimind-400 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,176,110,0.5)]"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-2 font-poppins">AgriMind AI may produce inaccurate information occasionally.</p>
      </div>
      
    </div>
  );
};

export default ChatUI;
