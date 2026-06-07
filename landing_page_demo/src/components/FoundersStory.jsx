import { motion } from 'framer-motion';

export default function FoundersStory() {
  return (
    <section className="py-24 lg:py-32 bg-amber-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] max-w-sm lg:max-w-md mx-auto lg:mx-0 rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl relative z-10 border-[6px] lg:border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1625316708582-7c38734be31d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Clinic Founder" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Quote Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -right-6 lg:-right-12 bottom-12 bg-white p-6 rounded-2xl shadow-xl max-w-xs z-20"
            >
              <p className="text-slate-600 font-medium italic mb-4">"We treat every pet exactly how we would want our own family to be treated."</p>
              <p className="font-bold text-slate-900">— Dr. Amanda Sterling</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-4">
              Our Personal Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              Built on a promise of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-400">unconditional love.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-serif">
              <p>
                When I lost my golden retriever, Max, I realized that dog grooming was missing something critical: <span className="font-bold text-slate-900">A stress-free luxury experience.</span>
              </p>
              <p>
                The clinical smells, the cold stainless steel, the rushed appointments—it didn't feel right for the animals that give us so much joy. I wanted to create a place that felt like an extension of your living room, where pets pull you <em className="italic">toward</em> the door instead of running away.
              </p>
              <p>
                Every detail of our salon, from the gentle training of our stylists to the warmth of our lighting, was born out of a deeply personal desire to elevate the standard of grooming. Because to us, they aren't just pets. They're family.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-amber-200/50">
              <h3 className="text-xl font-bold text-slate-900">Dr. Sarah Jenkins</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Founder & Master Stylist</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
