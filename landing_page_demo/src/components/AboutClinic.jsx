import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function AboutClinic() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-premium relative z-10">
              <img 
                src="/about_image.png" 
                alt="Luxury dog grooming salon" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background blob */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-stone-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-3">
              About Our Salon
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-[1.1]">
              Setting a new standard in dog grooming.
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We believe that grooming shouldn't be stressful for you or your pet. That's why we completely redesigned the salon experience. From our calming, cage-free environment to our gentle handling techniques, every detail is crafted with your pet's comfort in mind.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Certified, experienced groomers",
                "Premium, hypoallergenic products",
                "Cage-free drying available",
                "Stress-free, gentle handling"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-orange-500" size={20} />
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-slate-800 transition-colors">
              Learn More About Us
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
