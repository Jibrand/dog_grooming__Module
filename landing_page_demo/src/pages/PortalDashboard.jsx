import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Image, MessageSquare, FileText, Bell, Search, Settings, LogOut, Activity, Menu, X, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'pets', icon: <FileText size={20} />, label: 'My Pets' },
    { id: 'appointments', icon: <Calendar size={20} />, label: 'Bookings' },
    { id: 'gallery', icon: <Image size={20} />, label: 'Style Gallery' },
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold text-center py-1.5 z-50 shadow-sm flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        Interactive UI Demo — Backend Integration Ready
      </div>

      {/* Mobile Header */}
      <div className="md:hidden mt-6 bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-slate-900 font-bold">P&B</div>
          <span className="font-bold text-lg">Paws &amp; <span className="text-orange-500">Bubbles</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40 top-0 pt-8 md:pt-0 ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="p-6 hidden md:block mt-6">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-slate-900 font-bold text-lg">
                  P&B
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Paws &amp; <span className="text-orange-400">Bubbles</span>
                </span>
              </Link>
            </div>

            <nav className="flex-1 px-4 mt-6 md:mt-2 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-white/10 text-orange-400 shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-4 mt-auto">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
                <Settings size={20} />
                Settings
              </button>
              <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-all mt-1">
                <LogOut size={20} />
                Sign Out
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 bg-slate-50 min-h-screen w-full">
        <main className="p-4 md:p-8 pt-16 md:pt-20 max-w-7xl mx-auto w-full">
          
          {/* Topbar */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab === 'dashboard' ? 'Good morning, Sarah!' : activeTab.replace('-', ' ')}</h1>
            <p className="text-slate-500 mt-1">Here is the latest update on your account.</p>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 self-end md:self-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
              />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors shrink-0 bg-white rounded-full border border-slate-100 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src="https://i.pravatar.cc/150?img=32" alt="User Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid lg:grid-cols-3 gap-6 md:gap-8">
              
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* Pet Card */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start hover:shadow-premium transition-shadow">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 shadow-inner relative group cursor-pointer">
                    <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Charlie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">Edit Photo</div>
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900">Charlie</h2>
                        <p className="text-slate-500">Golden Retriever • 3 Years Old</p>
                      </div>
                      <div className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold border border-orange-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>Ready
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-6">
                      <div className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 text-center hover:bg-orange-50 hover:border-orange-100 transition-colors cursor-pointer">
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Coat Type</p>
                        <p className="text-base md:text-lg font-bold text-slate-900">Double</p>
                      </div>
                      <div className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 text-center hover:bg-orange-50 hover:border-orange-100 transition-colors cursor-pointer">
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Size</p>
                        <p className="text-base md:text-lg font-bold text-slate-900">Large</p>
                      </div>
                      <div className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 text-center hover:bg-orange-50 hover:border-orange-100 transition-colors cursor-pointer">
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Temperament</p>
                        <p className="text-base md:text-lg font-bold text-slate-900 text-truncate">Friendly</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Medical Records */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Recent Records</h3>
                    <button onClick={() => setActiveTab('pets')} className="text-orange-600 text-sm font-bold hover:text-orange-700">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { date: "Oct 12, 2026", title: "Full Groom & Spa", doctor: "Master Stylist Amanda", status: "Completed" },
                      { date: "Aug 12, 2026", title: "Bath & Brush", doctor: "Stylist Rachel", status: "Completed" },
                      { date: "Mar 05, 2026", title: "Nail Trim & Grind", doctor: "Stylist Michael", status: "Completed" }
                    ].map((record, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors cursor-pointer group gap-4 sm:gap-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:text-orange-500 transition-colors shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{record.title}</h4>
                            <p className="text-xs text-slate-500">{record.date} • {record.doctor}</p>
                          </div>
                        </div>
                        <div className="text-xs font-bold px-3 py-1.5 bg-white rounded-full text-slate-600 border border-slate-200 shadow-sm text-center sm:text-right w-full sm:w-auto">
                          {record.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                {/* Upcoming Appointment */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-orange-400" />
                    Upcoming Visit
                  </h3>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 relative z-10">
                    <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-1">Nov 15, 2026 • 2:30 PM</p>
                    <h4 className="text-xl font-bold mb-1">Premium Grooming Session</h4>
                    <p className="text-sm text-slate-300 mb-6">with Master Stylist Emily</p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">Reschedule</button>
                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-bold transition-colors border border-white/5">Check In</button>
                    </div>
                  </div>
                </div>

                {/* Reminders */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-rose-500" />
                    Reminders
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 shrink-0 animate-pulse"></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-rose-900">Next Recommended Groom</h4>
                        <p className="text-xs text-rose-700/70 mt-0.5 mb-3">Due in 2 days (Nov 1)</p>
                        <button className="w-full text-xs font-bold text-white bg-rose-500 px-3 py-2 rounded-xl hover:bg-rose-600 transition-colors shadow-sm">Book Now</button>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-sm text-amber-900">Nail Trim Due</h4>
                        <p className="text-xs text-amber-700/70 mt-0.5">Recommended every 4 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-900">All Bookings</h2>
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-premium">
                  <Plus size={16} /> Book New Visit
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-slate-100 rounded-2xl p-5 hover:border-orange-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">Premium Grooming Session</h4>
                      <p className="text-sm text-slate-500">Master Stylist Emily • Nov 15, 2026 at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors border border-slate-200">Cancel</button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-sm font-bold transition-colors border border-orange-200">Reschedule</button>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-60">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">Full Groom & Spa</h4>
                      <p className="text-sm text-slate-500">Master Stylist Amanda • Oct 12, 2026</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl text-center md:text-left">
                    Completed
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PETS TAB */}
          {activeTab === 'pets' && (
            <motion.div key="pets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-premium transition-shadow cursor-pointer relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-8">
                  <p className="text-white font-bold">View Full Styling History &rarr;</p>
                </div>
                <div className="flex justify-between items-start mb-6 relative z-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm">
                    <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Charlie" className="w-full h-full object-cover" />
                  </div>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Settings size={20}/></button>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Charlie</h2>
                <p className="text-slate-500 mb-6">Golden Retriever • 3 Years</p>
                <div className="flex gap-2">
                  <span className="bg-stone-50 text-stone-700 px-3 py-1 rounded-full text-xs font-bold border border-stone-200">Deshedded</span>
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">Spa Member</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-orange-300 transition-colors cursor-pointer min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Add Another Pet</h3>
                <p className="text-slate-500 text-center text-sm">Register a new family member to manage their grooming records.</p>
              </div>
            </motion.div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {['gallery', 'messages'].includes(activeTab) && (
            <motion.div key="fallback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-16 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'gallery' ? <Image size={40} /> : <MessageSquare size={40} />}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{activeTab} coming soon</h2>
              <p className="text-slate-500 max-w-md mx-auto">This section of the portal is currently under development for the demo. Backend connection pending.</p>
            </motion.div>
          )}

        </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
