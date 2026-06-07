import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import PortalDashboard from './pages/PortalDashboard';
import CrmDashboard from './pages/CrmDashboard';
import GlobalLoader from './components/GlobalLoader';
import PageWrapper from './components/PageWrapper';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      <GlobalLoader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/portal" element={<PageWrapper><PortalDashboard /></PageWrapper>} />
          <Route path="/crm" element={<PageWrapper><CrmDashboard /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <ChatbotWidget />
    </div>
  );
}

export default App;
