import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
