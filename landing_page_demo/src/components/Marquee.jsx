import { motion } from 'framer-motion';

const brands = [
  "Fear Free Certified",
  "AAHA Accredited",
  "Royal Canin",
  "Hill's Science Diet",
  "Zoetis",
  "Merck Animal Health",
  "Boehringer Ingelheim",
  "Elanco"
];

export default function Marquee() {
  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center gap-8">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden md:block">
          Trusted Partners
        </p>
        <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
        
        {/* Marquee Container */}
        <div className="relative flex overflow-hidden flex-1 mask-image-gradient">
          <motion.div
            className="flex whitespace-nowrap gap-16 items-center"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-xl md:text-2xl font-bold text-slate-300">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Add standard mask-image in global css later or inline here */}
      <style>{`
        .mask-image-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
}
