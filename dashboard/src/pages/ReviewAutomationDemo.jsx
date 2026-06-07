import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronRight, Mail, Clock, CheckCircle2, Star, MessageSquare, Play } from 'lucide-react';

const ReviewAutomationDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [previewEmail, setPreviewEmail] = useState(null);

  // Sample data for demo
  const demoJobs = [
    {
      id: 1,
      customer: 'John Smith',
      service: 'Bathroom Plumbing',
      completedDate: 'Mar 15, 2026',
      amount: '$450',
      status: 'completed',
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      service: 'Kitchen Installation',
      completedDate: 'Mar 18, 2026',
      amount: '$1,200',
      status: 'completed',
    },
    {
      id: 3,
      customer: 'Mike Davis',
      service: 'Water Heater Repair',
      completedDate: 'Mar 20, 2026',
      amount: '$280',
      status: 'completed',
    },
  ];

  const steps = [
    { id: 1, label: 'Job Completed', description: 'Service finished and marked complete' },
    { id: 2, label: 'Review Request Sent', description: 'Automated email/SMS sent to customer' },
    { id: 3, label: 'Customer Response', description: 'Customer submits review & rating' },
    { id: 4, label: 'Follow-up Action', description: 'Smart follow-up based on rating' },
  ];

  const handlePlayDemo = async () => {
    setIsRunning(true);
    setCompletedSteps([]);

    // Simulate each step
    for (let i = 1; i <= 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCompletedSteps((prev) => [...prev, i]);

      switch (i) {
        case 2:
          toast.success('Review request sent to john@email.com', {
            duration: 3000,
            icon: <Mail size={16} />,
          });
          break;
        case 3:
          toast.success('⭐ John rated 5 stars!', {
            duration: 3000,
            icon: <Star size={16} />,
          });
          break;
        case 4:
          toast.success('Follow-up: Thank you message queued', {
            duration: 3000,
            icon: <CheckCircle2 size={16} />,
          });
          break;
        default:
          break;
      }
    }

    setIsRunning(false);
  };

  const reviewResponses = [
    {
      name: 'John Smith',
      rating: 5,
      comment: '"Excellent work! Very professional and on time."',
      status: 'responded',
    },
    {
      name: 'Sarah Johnson',
      rating: 4,
      comment: '"Good service but took longer than expected."',
      status: 'responded',
    },
    {
      name: 'Mike Davis',
      rating: 0,
      comment: 'Pending response...',
      status: 'pending',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-28px font-bold text-black mb-2">Review Automation Demo</h1>
          <p className="text-14px text-gray-600">
            See how reviews are automatically collected from customers after job completion
          </p>
        </div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-[16px] border border-black/[0.06] bg-white"
        >
          <button
            onClick={handlePlayDemo}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-3 rounded-[10px] bg-black text-white font-600 text-14px disabled:opacity-60 hover:bg-gray-900 transition-all"
          >
            <Play size={16} fill="white" />
            {isRunning ? 'Running Demo...' : 'Start Demo (John Smith)'}
          </button>
          <p className="text-12px text-gray-600 mt-3">
            Click to simulate the automation flow for a completed job. Watch as the system automatically sends reviews and collects feedback.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-10">
          <h2 className="text-16px font-bold text-black mb-5">Automation Steps</h2>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-[12px] border transition-all ${
                  completedSteps.includes(step.id)
                    ? 'border-green-400 bg-green-50'
                    : 'border-black/[0.06] bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-13px transition-all ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {completedSteps.includes(step.id) ? '✓' : step.id}
                  </div>
                  <div className="flex-1">
                    <p className="font-600 text-14px text-black">{step.label}</p>
                    <p className="text-12px text-gray-600">{step.description}</p>
                  </div>
                  {completedSteps.includes(step.id) && (
                    <CheckCircle2 size={20} className="text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        {completedSteps.includes(2) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-[16px] border border-black/[0.06] bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-16px font-bold text-black">Email Preview</h2>
              <span className="text-12px px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-500">
                Sent at Step 2
              </span>
            </div>

            <div className="bg-gray-50 p-5 rounded-[12px] border border-black/[0.05] font-400">
              <div className="space-y-3 text-13px">
                <div>
                  <span className="text-gray-600">From: </span>
                  <span className="text-black font-500">support@bluecollarautomation.com</span>
                </div>
                <div>
                  <span className="text-gray-600">To: </span>
                  <span className="text-black font-500">john@email.com</span>
                </div>
                <div>
                  <span className="text-gray-600">Subject: </span>
                  <span className="text-black font-500">How was your experience with John's Plumbing?</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-black/[0.05] space-y-3 text-13px leading-relaxed">
                <p className="text-gray-700">Hi John,</p>
                <p className="text-gray-700">
                  Thank you for choosing us for your bathroom plumbing work on <strong>March 15, 2026</strong>. We would
                  love to hear about your experience!
                </p>
                <p className="text-gray-700">
                  Would you mind taking 30 seconds to rate us? Your feedback helps us improve our services.
                </p>

                <div className="flex gap-2 mt-4 pt-2">
                  <button className="px-4 py-2 rounded-[8px] bg-black text-white text-12px font-600 hover:bg-gray-900">
                    Rate Your Experience
                  </button>
                </div>

                <p className="text-gray-600 mt-4">
                  Best regards,
                  <br />
                  John's Plumbing Team
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Responses */}
        {completedSteps.includes(3) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-16px font-bold text-black mb-4">Customer Responses</h2>
            <div className="space-y-3">
              {reviewResponses.map((response, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="p-4 rounded-[12px] border border-black/[0.06] bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-600 text-14px text-black">{response.name}</p>
                    {response.status === 'responded' && (
                      <span className="flex items-center gap-1 text-12px text-green-700 bg-green-50 px-2 py-1 rounded-[6px]">
                        <CheckCircle2 size={12} /> Responded
                      </span>
                    )}
                    {response.status === 'pending' && (
                      <span className="flex items-center gap-1 text-12px text-gray-600 bg-gray-100 px-2 py-1 rounded-[6px]">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>

                  {response.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < response.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-12px font-600 text-gray-700 ml-2">{response.rating}/5</span>
                    </div>
                  )}

                  <p className="text-13px text-gray-700 italic">{response.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Metrics */}
        {completedSteps.includes(4) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <MetricCard label="Reviews Collected" value="3" subtext="This week" color="blue" />
            <MetricCard label="Avg Rating" value="4.7" subtext="out of 5" color="green" />
            <MetricCard label="Response Rate" value="66%" subtext="2 out of 3" color="purple" />
            <MetricCard label="Pending Responses" value="1" subtext="Follow-up queued" color="gray" />
          </motion.div>
        )}

        {/* Always visible jobs list */}
        <div className="mt-12 pt-8 border-t border-black/[0.05]">
          <h2 className="text-16px font-bold text-black mb-4">Jobs Ready for Review Automation</h2>
          <div className="space-y-3">
            {demoJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-[12px] border border-black/[0.06] bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-600 text-14px text-black">{job.customer}</p>
                    <p className="text-12px text-gray-600">
                      {job.service} • Completed {job.completedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-600 text-14px text-black">{job.amount}</p>
                    <span className="text-11px px-2 py-1 rounded-[6px] bg-green-50 text-green-700 font-500">
                      Review Pending
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, subtext, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-[12px] ${colorClasses[color]}`}
    >
      <p className="text-12px font-500 opacity-80">{label}</p>
      <p className="text-20px font-bold mt-1">{value}</p>
      <p className="text-11px opacity-70 mt-1">{subtext}</p>
    </motion.div>
  );
};

export default ReviewAutomationDemo;
