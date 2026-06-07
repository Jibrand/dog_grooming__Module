import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  let subdomain = window.location.hostname.split('.')[0];
  if (subdomain === 'localhost' || subdomain === '127') {
    subdomain = 'cliniclocal';
  }
  const clinicName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  useEffect(() => {
    // Simulate a high-end application boot sequence
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Premium apple-style easing
          className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
        >

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold tracking-widest text-slate-900 uppercase">{clinicName}</h2>
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
                className="h-full bg-gradient-to-r from-sky-400 to-teal-400"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
