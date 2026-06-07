import { motion } from 'framer-motion';
import { Shield, Heart, Clock, Award } from 'lucide-react';

const features = [
  {
    icon: <Shield size={28} className="text-teal-600" />,
    title: "Fear-Free Certified",
    desc: "A stress-free environment for pets.",
    bg: "bg-teal-50"
  },
  {
    icon: <Heart size={28} className="text-sky-600" />,
    title: "Compassionate Care",
    desc: "Treating your pets like our own family.",
    bg: "bg-sky-50"
  },
  {
    icon: <Clock size={28} className="text-emerald-600" />,
    title: "24/7 Emergency",
    desc: "Always here when you need us most.",
    bg: "bg-emerald-50"
  },
  {
    icon: <Award size={28} className="text-indigo-600" />,
    title: "Expert Team",
    desc: "Certified master pet groomers.",
    bg: "bg-indigo-50"
  }
];

export default function TrustIndicators() {
  return (
    <section className="py-12 bg-white relative z-20 -mt-10 lg:-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="glass-card rounded-[2rem] p-8 lg:p-12 shadow-premium grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
