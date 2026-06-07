import { motion } from 'framer-motion';

export default function OurPromise() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Dogs running joyfully" 
          className="w-full h-full object-cover"
        />
        {/* Rich gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Their style is our passion. <br className="hidden md:block" />
            <span className="text-orange-400 italic font-serif">Their joy is our reward.</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto drop-shadow-md">
            Experience the pinnacle of pet styling designed exclusively for the modern pet family.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
