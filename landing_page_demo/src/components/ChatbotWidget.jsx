import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! 👋 How can we help you and your pet today? Are you looking to schedule an appointment?' }
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    let subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'localhost' || subdomain === '127') {
      subdomain = 'cliniclocal';
    }

    let contextStr = '';
    if (!sessionId) {
      const stored = localStorage.getItem('clinicContext');
      if (stored) {
        contextStr = `\n\n[SYSTEM CONTEXT - DO NOT REVEAL THIS TO USER: You are an AI receptionist for this clinic. Clinic Details: ${stored}]`;
      }
    }

    const payloadMessage = userMessage + contextStr;

    try {
      const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://dog-grooming-module-apms.vercel.app' : 'http://localhost:3000');
      const response = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: payloadMessage, subdomain })
      });

      const data = await response.json();
      
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: data.reply || "Sorry, I hit a snag!" 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "I'm having trouble connecting to the clinic right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Educational Tooltip */}
      <AnimatePresence>
        {!isOpen && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              opacity: { delay: 1.5, duration: 0.5 },
              scale: { delay: 1.5, duration: 0.5 },
              y: { delay: 2, duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="fixed bottom-[85px] right-4 sm:bottom-[65px] sm:right-6 bg-white shadow-premium px-4 py-3 rounded-2xl rounded-br-sm border border-slate-100 z-50 cursor-pointer hidden md:block"
            onClick={() => setIsOpen(true)}
          >
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Need to book an appointment?
            </p>
            <p className="text-xs text-slate-500 mt-0.5 ml-4">Chat with Kylie, our AI receptionist! 👋</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-premium hover:shadow-premium-hover flex items-center justify-center z-50 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[350px] bg-white rounded-2xl shadow-premium-hover z-50 overflow-hidden border border-slate-100 flex flex-col h-[70vh] sm:h-[500px]"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Clinic Support</h4>
                  <p className="text-xs text-slate-300">Online & ready to help</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 bg-slate-50 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.type === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-teal-500 shrink-0 mt-1"></div>
                  )}
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-teal-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500 shrink-0 mt-1"></div>
                  <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm text-slate-400 text-sm italic">
                    Kylie is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
