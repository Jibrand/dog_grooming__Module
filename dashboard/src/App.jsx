import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Appointments from './pages/Appointments';
import CompletedJobs from './pages/CompletedJobs';
import Settings from './pages/Settings';
import Reviews from './pages/Reviews';
import Activities from './pages/Activities';
import ReviewAutomationDemo from './pages/ReviewAutomationDemo';
import WinBackAutomationDemo from './pages/WinBackAutomationDemo';
import KnowledgeTrainingDemo from './pages/KnowledgeTrainingDemo';

/* Subtle per-page fade */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

const CRMRoutes = () => {
  const location = useLocation();
  return (
    <Layout>
      <Routes location={location}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/leads" element={<PageTransition><Leads /></PageTransition>} />
        <Route path="/appointments" element={<PageTransition><Appointments /></PageTransition>} />
        <Route path="/completed-jobs" element={<PageTransition><CompletedJobs /></PageTransition>} />
        <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/demo/review-automation" element={<PageTransition><ReviewAutomationDemo /></PageTransition>} />
        <Route path="/demo/win-back-automation" element={<PageTransition><WinBackAutomationDemo /></PageTransition>} />
        <Route path="/demo/knowledge-training" element={<PageTransition><KnowledgeTrainingDemo /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected CRM — all CRM routes nested under ProtectedRoute */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <CRMRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '13px', fontWeight: 500, padding: '10px 14px' },
          success: { iconTheme: { primary: '#000', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </Router>
);

export default App;