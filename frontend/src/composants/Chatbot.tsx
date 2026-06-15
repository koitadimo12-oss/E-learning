import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../services/apiClient';
import { IoSend, IoClose, IoPerson, IoSchool, IoChatbubbleEllipses } from 'react-icons/io5';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Bonjour ! Je suis IA Kaay Niou Diang. Je peux vous expliquer des concepts, résumer vos cours ou vous donner des conseils d'apprentissage. Comment puis-je vous aider ?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    sessionStorage.setItem('chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, lang: 'fr' }),
      });

      if (!response.ok) throw new Error('Erreur serveur');

      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || "Désolé, je n'ai pas pu répondre.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError("Oups ! Une erreur s'est produite. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div 
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right mb-1 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
        } bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[90vw] sm:w-[380px] overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl`}
        style={{ height: '500px', maxHeight: '65vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-5 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-white rotate-12 blur-3xl"></div>
          </div>
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">IA Kaay Niou Diang</h3>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-[11px] text-blue-50 font-medium">En ligne • IA Gemini</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all relative z-10"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%]`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600'
                }`}>
                    {msg.sender === 'user' ? <IoPerson size={14} /> : <span className="text-sm">🤖</span>}
                </div>
                
                <div 
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 rounded-bl-none'
                    }`}
                >
                    <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                    <span className={`text-[9px] mt-1.5 block font-bold uppercase tracking-wider ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-sm opacity-50">🤖</span>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs text-center">
                {error}
                <button onClick={() => sendMessage()} className="ml-2 underline font-bold">Réessayer</button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative">
                <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
                placeholder="Posez votre question..."
                className="w-full max-h-32 min-h-[48px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none border-none placeholder-slate-400 transition-all shadow-inner"
                rows={1}
                />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center shrink-0 active:scale-95"
            >
              <IoSend size={18} />
            </button>
          </form>
          <p className="text-center mt-3 text-[10px] text-slate-400 font-medium">
            L'IA peut faire des erreurs. Vérifiez les concepts importants.
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-3xl transition-all duration-300 shadow-2xl ${
            isOpen ? 'bg-slate-800 rotate-90 scale-90' : 'bg-gradient-to-tr from-indigo-600 to-blue-600 hover:scale-110 hover:shadow-indigo-300/50'
        } text-white`}
        aria-label="Ouvrir le chat avec l'IA"
      >
        {isOpen ? <IoClose size={32} /> : <span className="text-3xl">🤖</span>}
        
        {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900 animate-bounce"></span>
        )}
      </button>
    </div>
  );
}
