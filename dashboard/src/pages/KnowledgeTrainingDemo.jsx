import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Play, Copy, Check, BookOpen, MessageSquare, Zap } from 'lucide-react';

const KnowledgeTrainingDemo = () => {
  const [knowledgeBase, setKnowledgeBase] = useState(`Company: Elite Plumbing Services
Phone: (555) 123-4567
Email: info@eliteplumbing.com
Address: 123 Main St, Your City, State

Service Areas: 10-mile radius from downtown

Pricing:
- Service call fee: $79 (waived with repair)
- Hourly rate: $95-$150 depending on complexity
- Emergency surcharge: 25% after hours

Response Time: 24-48 hours for standard, 2 hours for emergencies

Warranty: All work guaranteed for 1 year

Payment Methods: Cash, Credit Card, Check

Unique Features:
- Same-day turnaround on most repairs
- Military & senior discounts (10%)
- Free estimates for all projects`);

  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    { question: 'Do you offer emergency services?', expectedAnswer: 'Yes, we offer 24/7 emergency plumbing repairs with a 2-hour response time and 25% emergency surcharge.' },
    { question: 'What is your service call fee?', expectedAnswer: 'Our service call fee is $79, but it\'s waived if you proceed with the repair.' },
    { question: 'Are there warranties on your work?', expectedAnswer: 'Yes, all work is guaranteed for 1 year from completion.' },
    { question: 'Do you offer military discounts?', expectedAnswer: 'Yes, we offer 10% discounts for military personnel and seniors.' },
  ];

  const steps = [
    { id: 1, label: 'Knowledge Ingested', description: 'Business information loaded into AI' },
    { id: 2, label: 'AI Training Complete', description: 'System learns from knowledge base' },
    { id: 3, label: 'Customer Query', description: 'Customer asks a question' },
    { id: 4, label: 'Smart Response', description: 'AI answers using trained knowledge' },
  ];

  const handlePlayDemo = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setChatMessages([]);

    // Step 1: Knowledge ingested
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCompletedSteps([1]);
    toast.success('Knowledge base loaded!', { duration: 2000, icon: <BookOpen size={16} /> });

    // Step 2: AI Training
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCompletedSteps([1, 2]);
    toast.success('AI trained on knowledge base!', { duration: 2000, icon: <Zap size={16} /> });

    // Step 3: Sample query
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCompletedSteps([1, 2, 3]);
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    setChatMessages([
      { type: 'customer', text: randomQuery.question, delay: 0 },
    ]);
    toast.success('Customer question received!', { duration: 2000, icon: <MessageSquare size={16} /> });

    // Step 4: AI Response
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCompletedSteps([1, 2, 3, 4]);
    setChatMessages((prev) => [
      ...prev,
      { type: 'ai', text: randomQuery.expectedAnswer, delay: 1 },
    ]);
    toast.success('AI generated response!', { duration: 2000, icon: <Check size={16} /> });

    setIsRunning(false);
  };

  const handleCopyKnowledge = () => {
    navigator.clipboard.writeText(knowledgeBase);
    setCopied(true);
    toast.success('Knowledge base copied!', { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">🤖 AI Knowledge Training</h1>
          <p className="text-base text-gray-600">
            Train the AI chatbot with your business information so it can answer customer queries automatically
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Knowledge Base Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-black/[0.06] bg-white overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-black/[0.05]">
              <h2 className="text-lg font-bold text-black">Business Information</h2>
              <p className="text-sm text-gray-500 mt-1">This data trains the AI chatbot</p>
            </div>

            <div className="p-6 space-y-3">
              <textarea
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                className="w-full h-96 p-4 rounded-[12px] border border-black/[0.1] bg-gray-50 text-sm font-mono text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                placeholder="Add your business information here..."
              />

              <button
                onClick={handleCopyKnowledge}
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] border border-black/[0.1] text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium w-full justify-center"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Knowledge Base
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Demo & Chat */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Demo Controls */}
            <div className="rounded-[16px] border border-black/[0.06] bg-white p-6 shadow-sm">
              <button
                onClick={handlePlayDemo}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm disabled:opacity-60 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all w-full justify-center"
              >
                <Play size={16} fill="white" />
                {isRunning ? 'Training in Progress...' : 'Start Training Demo'}
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Watch the AI learn from your knowledge base and respond to customer queries intelligently
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="rounded-[16px] border border-black/[0.06] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-black/[0.05]">
                <h3 className="font-bold text-black text-sm">Training Flow</h3>
              </div>
              <div className="p-6 space-y-2">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-[10px] border text-sm transition-all ${completedSteps.includes(step.id)
                        ? 'border-green-400 bg-green-50 text-green-900'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedSteps.includes(step.id) ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                      )}
                      <span className="font-semibold">{step.label}</span>
                    </div>
                    <p className="text-xs opacity-70 ml-6 mt-1">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chat Demo */}
        <AnimatePresence>
          {chatMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 rounded-[16px] border border-black/[0.06] bg-white overflow-hidden shadow-sm"
            >
              <div className="p-6 border-b border-black/[0.05]">
                <h3 className="font-bold text-black text-base flex items-center gap-2">
                  <MessageSquare size={18} /> Live Chat Demo
                </h3>
              </div>

              <div className="p-6 space-y-4 h-64 overflow-y-auto bg-gray-50">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: msg.delay || 0 }}
                    className={`flex ${msg.type === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-[12px] text-sm ${msg.type === 'customer'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-black/[0.1] text-gray-900 rounded-tl-none'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sample Queries Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-[16px] border border-blue-200 bg-blue-50 p-6"
        >
          <h3 className="font-bold text-blue-900 mb-4">Sample Customer Queries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleQueries.map((query, idx) => (
              <div key={idx} className="bg-white rounded-[10px] p-4 border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-2">👤 "{query.question}"</p>
                <p className="text-xs text-gray-600">
                  💬 <span className="font-medium text-gray-700">{query.expectedAnswer}</span>
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[16px] border border-blue-200"
        >
          <h4 className="font-bold text-blue-950 mb-2">💡 How It Works</h4>
          <ul className="text-sm text-blue-900 space-y-2">
            <li>✓ We will upload your business info, services, pricing, policies to the knowledge base</li>
            <li>✓ The AI learns from this data using advanced NLP (Natural Language Processing)</li>
            <li>✓ When customers ask questions, the AI searches the knowledge base for relevant answers</li>
            <li>✓ Responses are generated based on your business information in real-time</li>
            <li>✓ The chatbot gets smarter as you add more detailed information</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowledgeTrainingDemo;
