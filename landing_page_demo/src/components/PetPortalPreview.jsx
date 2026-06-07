import { motion } from 'framer-motion';
import { Smartphone, Activity, Bell, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PetPortalPreview() {
  return (
    <section id="portal" className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[120px] -z-0 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[100px] -z-0 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-teal-400 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Modern Convenience
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]"
          >
            Your pet's styling, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">in your pocket.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 mb-8 leading-relaxed"
          >
            Access styling preferences, message your groomer directly, track loyalty rewards, and manage upcoming appointments instantly with our premium digital portal. No more waiting on hold.
          </motion.p>

          <div className="space-y-6">
            {[
              { icon: <Activity className="text-orange-400" size={24} />, title: "Style History", desc: "View past haircuts and requested styles anytime." },
              { icon: <Bell className="text-amber-400" size={24} />, title: "Smart Reminders", desc: "Never miss a scheduled grooming session." },
              { icon: <FileText className="text-rose-400" size={24} />, title: "Easy Booking", desc: "Book your next spa day right from your phone." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Link 
            to="/portal"
            className="mt-10 inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-100 transition-all group"
          >
            <Smartphone size={18} />
            Explore Pet Portal
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stunning Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring" }}
          className="relative perspective-1000"
        >
          {/* Main Dashboard Frame */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl border-[8px] border-slate-800 relative z-10 w-full max-w-md mx-auto aspect-[4/5] overflow-hidden transform-gpu group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
            {/* Header Area */}
            <div className="bg-slate-50 -m-4 mb-4 p-6 border-b border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Dog profile" className="w-full h-full object-cover"/>
                </div>
                <div className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Healthy</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Good morning,<br/>Charlie's Dad!</h3>
            </div>
            
            {/* Cards inside mockup */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Upcoming Visit</h4>
                    <p className="text-xs text-slate-500">Oct 24 • Dental Cleaning</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">View</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-4 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <FileText size={80} />
                </div>
                <h4 className="font-bold text-sm mb-1 relative z-10">Loyalty Rewards</h4>
                <p className="text-xs text-orange-50 mb-3 relative z-10">1 wash away from a free spa upgrade</p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs font-semibold px-4 py-2 rounded-lg transition-colors relative z-10">Claim Reward</button>
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-xs font-bold text-slate-900">Spa Upgrade</p>
              <p className="text-[10px] text-slate-500">Confirmed!</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

// Ensure CheckCircle2 is imported if I use it. I'll just change it to Bell or something or import it. Wait, I didn't import CheckCircle2.
// Let me update the import.
