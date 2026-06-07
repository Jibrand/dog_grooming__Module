import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah M. & Charlie",
    text: "The most beautiful and calm grooming salon I've ever been to. Charlie usually shakes during baths, but here he just relaxed. The haircut was perfect.",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=32"
  },
  {
    name: "James T. & Luna",
    text: "You can tell they really care. The groomers are so gentle, and Luna came out looking and smelling absolutely amazing!",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Elena R. & Max",
    text: "Max has never looked better! The staff is so compassionate and the facility feels more like a high-end spa than a grooming salon.",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=5"
  }
];

export default function Testimonials({ clinic }) {
  const activeTestimonials = clinic?.testimonials?.length > 0 ? clinic.testimonials : testimonials;
  return (
    <section id="reviews" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-3"
          >
            Client Stories
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-slate-200 mb-6"
          >
            Loved by pets.<br/>Trusted by owners.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {activeTestimonials.map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all duration-300 relative group"
            >
              <Quote className="absolute top-8 right-8 text-slate-100 w-12 h-12 -z-0 group-hover:text-orange-50 transition-colors" />
              <div className="relative z-10">
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-8">"{review.text}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={review.img || `https://i.pravatar.cc/150?img=${index + 10}`} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-sm text-slate-500">Verified Client</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
