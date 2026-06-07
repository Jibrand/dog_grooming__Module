import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ clinic }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          {clinic?.logoUrl ? (
            <div className="h-10 md:h-12 flex items-center justify-center shrink-0">
              <img src={clinic.logoUrl} alt="Logo" className="h-full w-auto object-contain drop-shadow-sm" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-premium overflow-hidden shrink-0">
              <img src="/logo.png" alt="Paws & Bubbles Logo" className="w-full h-full object-cover" />
            </div>
          )}
          <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`}>
            {clinic?.name || <>Paws & <span className="text-orange-600">Bubbles</span></>}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <a href="#services" className="hover:text-orange-600 transition-colors">Services</a>
          <a href="#about" className="hover:text-orange-600 transition-colors">About Us</a>
          <a href="#reviews" className="hover:text-orange-600 transition-colors">Reviews</a>
          <Link to="/portal" className="hover:text-orange-600 transition-colors">Pet Portal</Link>
          <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-6">
          <a href={`tel:${clinic?.phone?.replace(/\D/g, '') || '5551234567'}`} className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium">
            <Phone size={18} />
            <span className="text-sm">Call Us: {clinic?.phone || '(555) 123-4567'}</span>
          </a>
          <a 
            href="#contact"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-premium hover:shadow-premium-hover transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Calendar size={16} />
            Book Grooming
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden"
        >
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-50">Services</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-50">About Us</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-50">Reviews</a>
          <Link to="/portal" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-50">Pet Portal</Link>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 border-b border-slate-50">Contact</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="bg-slate-900 text-white w-full py-3 rounded-full text-sm font-semibold mt-4 flex items-center justify-center gap-2">
            <Calendar size={16} />
            Book Grooming
          </a>
        </motion.div>
      )}
    </header>
  );
}
