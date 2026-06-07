import { motion } from 'framer-motion';
import { Calendar, Phone, ArrowRight, Star } from 'lucide-react';

export default function Hero({ clinic }) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-orange-100 to-amber-50 rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        
        {/* Text Content */}
        <div className="max-w-xl lg:max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-sm font-semibold mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Accepting New Furry Friends
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6"
          >
            Premium grooming for your <br className="hidden lg:block"/>
            <span className="text-gradient">best friend.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg"
          >
            Experience a modern grooming salon designed around comfort, style, and the highest standard of pet care.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#contact" className="bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold shadow-premium hover:shadow-premium-hover transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <Calendar size={18} />
              Book Grooming
            </a>
            <a href={`tel:${clinic?.phone?.replace(/\D/g, '') || '5551234567'}`} className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
              <Phone size={18} className="text-orange-600" />
              Call Salon
              <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-slate-400" />
            </a>
          </motion.div>
        </div>

        {/* Image & Floating Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[500px] xl:h-[600px] flex items-center justify-center w-full mt-10 lg:mt-0"
        >
          {/* Main Image placeholder */}
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-full max-h-[600px] bg-slate-200 rounded-[2rem] overflow-hidden shadow-premium">
             <img 
               src="/hero_image.png" 
               alt="Luxury dog grooming salon"
               className="w-full h-full object-cover object-center"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Floating UI Card - Appointment */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -left-6 lg:-left-12 bottom-20 glass-card p-5 rounded-2xl flex items-center gap-4 animate-[bounce_5s_infinite_alternate]"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Available Today</p>
              <p className="text-sm font-bold text-slate-900">2:30 PM Full Grooming</p>
            </div>
          </motion.div>

          {/* Floating UI Card - Rating */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -right-4 lg:-right-8 top-32 glass-card p-4 rounded-2xl flex items-center gap-3 animate-[bounce_6s_infinite_alternate-reverse]"
          >
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                 </div>
               ))}
            </div>
            <div>
              <div className="flex text-amber-400 mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="text-xs font-bold text-slate-900">4.9/5 from {clinic?.testimonials?.length || '500'}+ reviews</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
