import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const CompletedJobs = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <CheckCircle2 size={32} className="text-[#888]" />
            </div>
            <h1 className="text-2xl tracking-tight mb-2">Completed Appointments</h1>
            <p className="text-sm text-[#555] max-w-xs">
                You haven't completed any appointments yet. Mark an appointment as finished to see it here.
            </p>
        </motion.div>
    );
};

export default CompletedJobs;
