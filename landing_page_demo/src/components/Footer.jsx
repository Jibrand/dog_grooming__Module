import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import StaffModal from './StaffModal';

export default function Footer({ clinic }) {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-premium overflow-hidden">
              {clinic?.logoUrl ? (
                <img src={clinic.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <img src="/logo.png" alt="Paws & Bubbles Logo" className="w-full h-full object-cover" />
              )}
            </div>
              <span className="text-xl font-bold tracking-tight">
                {clinic?.name || <>Paws & <span className="text-orange-400">Bubbles</span></>}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Premium dog grooming designed around the comfort and style of your beloved pets.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-400 shrink-0" />
                <span>{clinic?.location || '123 Luxury Pet Blvd, Suite 100\nSan Francisco, CA 94107'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>{clinic?.phone || '(555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-400 shrink-0" />
                <span>{clinic?.email || 'hello@pawsandbubbles.com'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Hours</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Mon - Fri</span>
                <span className="text-white">8:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span>Saturday</span>
                <span className="text-white">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between items-center pb-2">
                <span>Sunday</span>
                <span className="text-white">Closed</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#services" className="hover:text-orange-400 transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#reviews" className="hover:text-orange-400 transition-colors">Client Reviews</a></li>
              <li><a href="#portal" className="hover:text-orange-400 transition-colors">Pet Portal Login</a></li>
              <li><button onClick={() => setIsStaffModalOpen(true)} className="hover:text-orange-400 transition-colors">Staff Portal</button></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {clinic?.name || 'Paws & Bubbles'}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
      
      <StaffModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} />
    </footer>
  );
}
