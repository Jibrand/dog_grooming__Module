import { motion } from 'framer-motion';
import { Users, Heart, Award, Clock } from 'lucide-react';

const stats = [
  { icon: <Heart size={32} />, value: "10k+", label: "Happy Pets Treated" },
  { icon: <Users size={32} />, value: "15+", label: "Expert Specialists" },
  { icon: <Award size={32} />, value: "50+", label: "Years Combined Experience" },
  { icon: <Clock size={32} />, value: "24/7", label: "Emergency Availability" }
];

export default function Stats({ clinic }) {
  const dynamicStats = [
    { icon: <Heart size={32} />, value: clinic?.happyPetsTreated ? `${clinic.happyPetsTreated}+` : "10k+", label: "Happy Pets Treated" },
    { icon: <Users size={32} />, value: clinic?.expertSpecialists ? `${clinic.expertSpecialists}+` : "15+", label: "Certified Pet Stylists" },
    { icon: <Award size={32} />, value: clinic?.yearsExperience ? `${clinic.yearsExperience}+` : "50+", label: "Years Combined Experience" },
    { icon: <Clock size={32} />, value: "24/7", label: "Emergency Availability" }
  ];
  return (
    <section className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Parallax Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Clinic Background" 
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {dynamicStats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 shadow-xl">
                {stat.icon}
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-slate-300 font-medium uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
