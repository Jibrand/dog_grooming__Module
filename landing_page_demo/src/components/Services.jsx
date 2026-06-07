import { motion } from 'framer-motion';
import { Scissors, Droplets, Sparkles, Heart, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: <Scissors size={32} className="text-orange-600" />,
    title: 'Full Groom',
    desc: 'A complete makeover including bath, brush, haircut, nail trim, and ear cleaning.',
    bg: 'bg-orange-50'
  },
  {
    icon: <Droplets size={32} className="text-sky-600" />,
    title: 'Bath & Brush',
    desc: 'Perfect for maintaining a clean coat between full grooms. Includes bath, blow-dry, and brush out.',
    bg: 'bg-sky-50'
  },
  {
    icon: <Sparkles size={32} className="text-amber-600" />,
    title: 'Spa Treatments',
    desc: 'Luxury add-ons like blueberry facials, paw balm, and deep conditioning treatments.',
    bg: 'bg-amber-50'
  },
  {
    icon: <Heart size={32} className="text-rose-600" />,
    title: 'Puppy First Groom',
    desc: 'A gentle introduction to grooming for puppies under 6 months to get them comfortable.',
    bg: 'bg-rose-50'
  }
];

export default function Services({ clinic }) {
  const activeServices = clinic?.services?.length > 0 ? clinic.services.map((svc, i) => ({
    title: svc.name,
    desc: svc.description,
    // Cycle through the default styles
    icon: services[i % services.length].icon,
    bg: services[i % services.length].bg
  })) : services;
  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Our Services
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Premium grooming packages for your best friend
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {activeServices.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all duration-300 border border-slate-100 group cursor-pointer flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className={`shrink-0 w-16 h-16 ${service.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{service.desc}</p>
                <div className="flex items-center gap-2 text-orange-600 font-medium text-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                  Learn more <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
