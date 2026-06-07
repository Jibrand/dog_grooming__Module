import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Scissors, Coffee, Heart } from 'lucide-react';

const features = [
  {
    icon: <Scissors size={32} className="text-orange-600" />,
    title: "Premium Quality Products",
    desc: "We use only the finest hypoallergenic shampoos, conditioners, and styling products tailored specifically to your dog's unique coat type and skin sensitivity.",
    img: "/wcu_1.png"
  },
  {
    icon: <Coffee size={32} className="text-amber-600" />,
    title: "A Calming Environment",
    desc: "No sterile, scary waiting rooms. We designed our space with cage-free drying, relaxing music, and warm lighting to reduce anxiety.",
    img: "/wcu_2.png"
  },
  {
    icon: <Heart size={32} className="text-rose-600" />,
    title: "Passionate Groomers",
    desc: "Our certified groomers treat every dog as if they were their own. Gentle handling and personalized attention are our top priorities.",
    img: "/wcu_3.png"
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <motion.div style={{ y: y1 }} className="absolute -left-20 top-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-60 -z-10"></motion.div>
      <motion.div style={{ y: y2 }} className="absolute -right-20 bottom-20 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 -z-10"></motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            The Premium Difference
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1]"
          >
            Dog grooming, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">completely reimagined.</span>
          </motion.h2>
        </div>

        <div className="space-y-32">
          {features.map((feature, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 lg:max-w-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{feature.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">{feature.desc}</p>
                <button className="text-slate-900 font-bold border-b-2 border-orange-500 pb-1 hover:text-orange-600 transition-colors">
                  Discover How
                </button>
              </motion.div>

              {/* Image Side with Parallax */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 w-full"
              >
                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    src={feature.img} 
                    alt={feature.title} 
                    className="w-full h-full object-cover"
                  />
                  {/* Decorative corner accent */}
                  <div className={`absolute w-32 h-32 rounded-full blur-2xl opacity-40 mix-blend-multiply ${i % 2 === 0 ? 'top-0 right-0 bg-orange-400' : 'bottom-0 left-0 bg-amber-400'}`}></div>
                </div>
              </motion.div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
