import { motion } from 'framer-motion';

const images = [
  "/gallery_1.png",
  "/gallery_2.png",
  "/gallery_3.png",
  "/gallery_4.png",
  "/gallery_5.png"
];

export default function Gallery() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-3"
            >
              Take a Tour
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-bold text-slate-900"
            >
              A salon designed <br className="hidden md:block"/> for pampering.
            </motion.h2>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors hidden md:block"
          >
            View full gallery &rarr;
          </motion.button>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium-hover transition-shadow duration-500 relative group aspect-square md:aspect-auto md:h-full"
          >
            <img src={images[0]} alt="Salon Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
              <h3 className="text-white text-xl font-bold">Premium Grooming Station</h3>
            </div>
          </motion.div>

          {images.slice(1).map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-shadow duration-500 relative group aspect-square"
            >
              <img src={img} alt={`Gallery image ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
