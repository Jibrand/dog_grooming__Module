import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
  MessageSquare,
  Zap,
  Target,
} from 'lucide-react';

const WinBackAutomationDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [customerResponses, setCustomerResponses] = useState([]);

  const steps = [
    { id: 1, label: 'Scan for Inactive Customers', description: 'Find customers with no jobs in 60+ days' },
    { id: 2, label: 'Send Win-Back Message', description: 'Personalized email/SMS with special offer' },
    { id: 3, label: 'Track Engagement', description: 'Monitor opens, clicks, replies' },
    { id: 4, label: 'Auto Follow-ups', description: 'Second message if no response' },
    { id: 5, label: 'Conversion Result', description: 'New appointment booked' },
  ];

  const demoCustomers = [
    {
      id: 1,
      name: 'David Wilson',
      lastJob: '85 days ago',
      lastService: 'Roof Inspection',
      spent: '$2,400',
    },
    {
      id: 2,
      name: 'Emma Brown',
      lastJob: '72 days ago',
      lastService: 'Plumbing Repair',
      spent: '$850',
    },
    {
      id: 3,
      name: 'Robert Garcia',
      lastJob: '95 days ago',
      lastService: 'HVAC Service',
      spent: '$1,650',
    },
    {
      id: 4,
      name: 'Lisa Martinez',
      lastJob: '68 days ago',
      lastService: 'Electrical Work',
      spent: '$1,200',
    },
    {
      id: 5,
      name: 'James Anderson',
      lastJob: '110 days ago',
      lastService: 'Flooring Installation',
      spent: '$3,500',
    },
  ];

  const handlePlayDemo = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setCustomerResponses([]);

    // Simulate each step
    for (let i = 1; i <= 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setCompletedSteps((prev) => [...prev, i]);

      switch (i) {
        case 1:
          toast.success('Found 5 inactive customers', {
            duration: 3000,
            icon: <Target size={16} />,
          });
          break;
        case 2:
          toast.success('Win-back campaigns sent to 5 customers', {
            duration: 3000,
            icon: <Mail size={16} />,
          });
          break;
        case 3:
          toast.success('Engagement tracked: 80% opened email', {
            duration: 3000,
            icon: <TrendingUp size={16} />,
          });
          setCustomerResponses([
            { name: 'David Wilson', status: 'clicked', action: 'Clicked offer link' },
            { name: 'Emma Brown', status: 'opened', action: 'Opened email' },
            { name: 'Robert Garcia', status: 'opened', action: 'Opened email' },
          ]);
          break;
        case 4:
          toast.success('Follow-up messages sent to non-responders', {
            duration: 3000,
            icon: <Zap size={16} />,
          });
          setCustomerResponses((prev) => [
            ...prev,
            { name: 'Lisa Martinez', status: 'replied', action: 'Replied: Interested in quote' },
          ]);
          break;
        case 5:
          toast.success('🎉 David Wilson booked new appointment!', {
            duration: 3000,
            icon: <CheckCircle2 size={16} />,
          });
          setCustomerResponses((prev) => [
            ...prev,
            { name: 'James Anderson', status: 'converted', action: 'Scheduled for Mar 28' },
          ]);
          break;
        default:
          break;
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-28px font-bold text-black mb-2">Win-Back Automation Demo</h1>
          <p className="text-14px text-gray-600">
            Automatically identify and re-engage inactive customers with personalized campaigns
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
            {isRunning ? 'Running Campaign...' : 'Start Win-Back Campaign'}
          </button>
          <p className="text-12px text-gray-600 mt-3">
            Click to simulate the complete win-back automation flow. Watch customers progress from inactive to re-engaged.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="mb-10">
          <h2 className="text-16px font-bold text-black mb-5">Campaign Steps</h2>
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

        {/* Customer Identification */}
        {completedSteps.includes(1) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-[16px] border border-black/[0.06] bg-white"
          >
            <h2 className="text-16px font-bold text-black mb-4">Inactive Customers Identified</h2>
            <div className="space-y-3">
              {demoCustomers.map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: customer.id * 0.1 }}
                  className="p-4 rounded-[12px] border border-black/[0.06] bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-600 text-14px text-black">{customer.name}</p>
                      <p className="text-12px text-gray-600">
                        Last service: {customer.lastService} • {customer.lastJob}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-13px font-600 text-gray-700">{customer.spent} total spent</p>
                      <span className="text-11px px-2 py-1 rounded-[6px] bg-red-50 text-red-700 font-500 inline-block mt-1">
                        Inactive
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message Preview */}
        {completedSteps.includes(2) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-16px font-bold text-black mb-4">Win-Back Message Campaign</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Email Template */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-[12px] border border-black/[0.06] bg-white"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={16} className="text-blue-600" />
                  <span className="font-600 text-13px text-black">Email Template</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-[10px] border border-black/[0.05] space-y-3 text-12px">
                  <p className="text-gray-700">
                    <strong>Subject:</strong> We miss you! 20% off your next service ☺️
                  </p>
                  <div className="border-t border-black/[0.05] pt-3">
                    <p className="text-gray-700 leading-relaxed">
                      Hi David, it's been a while since we worked together. We'd love to help with your next project!
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-2">
                      To thank you for being a valued customer, here's a special offer just for you:
                    </p>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-[8px] font-600 text-11px w-full hover:bg-blue-700">
                      Claim Your 20% Discount
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* SMS Template */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-[12px] border border-black/[0.06] bg-white"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={16} className="text-green-600" />
                  <span className="font-600 text-13px text-black">SMS Template</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-[10px] border border-black/[0.05] space-y-2">
                  <div className="bg-blue-100 p-3 rounded-[8px] text-12px text-gray-800">
                    Hi David! We miss you & want to help with your next project. Get 20% off this month!
                    [Link]
                  </div>
                  <p className="text-11px text-gray-600">
                    SMS sent automatically after 36 hours if email not opened
                  </p>
                </div>
              </motion.div> */}
            </div>
          </motion.div>
        )}

        {/* Engagement Tracking */}
        {completedSteps.includes(3) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-[16px] border border-black/[0.06] bg-white"
          >
            <h2 className="text-16px font-bold text-black mb-4">Real-Time Engagement</h2>
            <div className="space-y-3">
              {customerResponses.map((response, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="p-4 rounded-[12px] border border-black/[0.06] bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-600 text-14px text-black">{response.name}</p>
                      <p className="text-13px text-gray-700">{response.action}</p>
                    </div>
                    <StatusBadge status={response.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results & Metrics */}
        {completedSteps.includes(5) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-16px font-bold text-black mb-4">Campaign Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
              <MetricCard label="Campaigns Sent" value="5" subtext="customers" color="blue" />
              <MetricCard label="Opened" value="80%" subtext="4 customers" color="purple" />
              <MetricCard label="Clicked" value="40%" subtext="2 customers" color="yellow" />
              <MetricCard label="Replied" value="20%" subtext="1 customer" color="green" />
              <MetricCard label="Converted" value="1" subtext="appointment booked" color="green" />
            </div>

            <div className="p-6 rounded-[16px] border border-green-200 bg-green-50">
              <h3 className="text-14px font-bold text-green-900 mb-3">Conversion Summary</h3>
              <div className="space-y-2">
                <p className="text-13px text-green-900">
                  ✓ <strong>David Wilson</strong> - Booked for "Roof Inspection" on Mar 28, 2026 @ 2:00 PM
                </p>
                <p className="text-13px text-green-800">
                  Revenue Impact: Estimated $2,400 (based on his average service cost)
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ROI Information */}
        <div className="mt-12 pt-8 border-t border-black/[0.05]">
          <h2 className="text-16px font-bold text-black mb-4">Why Win-Back Automation Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon="📊"
              title="Recover Lost Revenue"
              description="Inactive customers are easy wins. Many just forgot about you!"
            />
            <InfoCard
              icon="⏰"
              title="Save Time"
              description="Fully automated. Personalized messages sent at perfect times."
            />
            <InfoCard
              icon="🎯"
              title="Measurable Results"
              description="Track opens, clicks, replies, and bookings in real-time."
            />
          </div>
        </div>

        {/* Note about implementation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-[12px] bg-blue-50 border border-blue-200"
        >
          <p className="text-12px text-blue-900">
            <strong>Note:</strong> This automation runs entirely on the backend. Customers will not have a toggle
            button to control it. You maintain and manage all campaigns from your side, with monthly subscription
            pricing for this feature.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    opened: { bg: 'bg-blue-50', text: 'text-blue-700', label: '📧 Opened' },
    clicked: { bg: 'bg-purple-50', text: 'text-purple-700', label: '🔗 Clicked' },
    replied: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: '💬 Replied' },
    converted: { bg: 'bg-green-50', text: 'text-green-700', label: '✓ Booked' },
  };

  const style = statusStyles[status] || statusStyles.opened;

  return (
    <span className={`text-11px font-600 px-3 py-1.5 rounded-[6px] ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

const MetricCard = ({ label, value, subtext, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-[12px] ${colorClasses[color]}`}
    >
      <p className="text-11px font-500 opacity-80">{label}</p>
      <p className="text-20px font-bold mt-1">{value}</p>
      <p className="text-11px opacity-70 mt-1">{subtext}</p>
    </motion.div>
  );
};

const InfoCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 rounded-[12px] border border-black/[0.06] bg-white text-center"
  >
    <p className="text-24px mb-2">{icon}</p>
    <p className="font-600 text-14px text-black mb-2">{title}</p>
    <p className="text-12px text-gray-600">{description}</p>
  </motion.div>
);

export default WinBackAutomationDemo;
