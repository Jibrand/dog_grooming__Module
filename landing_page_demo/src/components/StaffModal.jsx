import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function StaffModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState('');
  const navigate = useNavigate();

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleOpenCrm = () => {
    onClose();
    // Navigate to the dashboard
    const DASHBOARD_URL = import.meta.env.PROD ? 'https://dashaboard.inboxhr.cloud' : 'http://localhost:3001';
    window.open(DASHBOARD_URL, '_blank');
  };

  let subdomain = window.location.hostname.split('.')[0];
  if (subdomain === 'localhost' || subdomain === '127') {
    subdomain = 'cliniclocal';
  }

  const demoEmail = subdomain === 'cliniclocal' ? 'cliniclocal@gmail.com' : `${subdomain}@futureframe.com`;
  const demoPass = 'Pass123';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                <Lock className="text-teal-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Clinic CRM Portal</h3>
              <p className="text-slate-400 text-sm">Secure demo access for veterinary staff</p>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-teal-800 leading-relaxed">
                  <strong>Demo Mode:</strong> Please use the following credentials to access the clinic's internal mini-CRM and management dashboard.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="font-mono text-slate-700 text-sm">{demoEmail}</span>
                    <button onClick={() => handleCopy(demoEmail, 'email')} className="text-slate-400 hover:text-teal-600 transition-colors" title="Copy Email">
                      {copied === 'email' ? <CheckCircle2 size={18} className="text-teal-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="font-mono text-slate-700 text-sm">{demoPass}</span>
                    <button onClick={() => handleCopy(demoPass, 'pass')} className="text-slate-400 hover:text-teal-600 transition-colors" title="Copy Password">
                      {copied === 'pass' ? <CheckCircle2 size={18} className="text-teal-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <button onClick={handleOpenCrm} className="w-full mt-8 bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center gap-2">
                Open CRM Dashboard
                <ExternalLink size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
