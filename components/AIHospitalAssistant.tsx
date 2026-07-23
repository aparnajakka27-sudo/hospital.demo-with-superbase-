"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Minus, Bot, User, AlertCircle } from "lucide-react";

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isEmergency?: boolean;
};

export default function AIHospitalAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Hospital Assistant. How can I help you today? I can help with finding departments, booking appointments, or hospital timings.'
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response,
        isEmergency: data.isEmergency
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm sorry, I'm having trouble connecting right now. Please call the hospital directly."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Very basic markdown bold parsing for **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          <br />
        </span>
      );
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 left-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-xl transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={28} />
        <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold py-2 px-4 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Need help? Chat with AI
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed left-6 z-50 transition-all duration-300 ease-in-out ${isMinimized ? 'bottom-6 w-72' : 'bottom-6 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh]'}`}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between text-white rounded-t-2xl shrink-0 cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-400/30">
              <Bot size={20} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">AI Hospital Assistant</h3>
              <p className="text-[10px] text-emerald-200 font-medium">Online • Reception & Info</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Minimize chat">
              <Minus size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Area (Hidden if minimized) */}
        {!isMinimized && (
          <>
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className="shrink-0 mt-1">
                      {msg.sender === 'ai' ? (
                        <div className={`p-1.5 rounded-full ${msg.isEmergency ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {msg.isEmergency ? <AlertCircle size={16} /> : <Bot size={16} />}
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-gray-200 text-gray-600">
                          <User size={16} />
                        </div>
                      )}
                    </div>

                    <div className={`px-4 py-3 text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm' 
                        : msg.isEmergency 
                          ? 'bg-red-50 border border-red-200 text-red-900 rounded-2xl rounded-tl-sm font-medium'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.sender === 'ai' ? renderFormattedText(msg.text) : msg.text}
                    </div>
                    
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 max-w-[80%] flex-row">
                    <div className="shrink-0 mt-1">
                      <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600">
                        <Bot size={16} />
                      </div>
                    </div>
                    <div className="px-5 py-3.5 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about departments, doctors, timings..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-800 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors shadow-sm"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[9px] text-gray-400">AI Assistant can make mistakes. Not for medical diagnosis.</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
