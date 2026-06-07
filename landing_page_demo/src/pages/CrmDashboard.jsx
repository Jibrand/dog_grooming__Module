import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Users, Activity, Settings, 
  Search, Bell, Plus, ChevronDown, CheckCircle2, Clock, FileText, Menu, X, ActivitySquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CrmDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const upcomingAppointments = [
    { id: 1, pet: "Luna", type: "Cat", owner: "Sarah Jenkins", time: "09:00 AM", reason: "Annual Vaccination", status: "Arrived", avatar: "11" },
    { id: 2, pet: "Max", type: "Dog", owner: "Michael Chen", time: "10:30 AM", reason: "Dental Checkup", status: "Waiting", avatar: "12" },
    { id: 3, pet: "Bella", type: "Dog", owner: "Emma Wilson", time: "11:45 AM", reason: "Skin Consultation", status: "Confirmed", avatar: "13" },
    { id: 4, pet: "Oliver", type: "Cat", owner: "James Taylor", time: "02:00 PM", reason: "Post-op Follow up", status: "Confirmed", avatar: "14" }
  ];

  const statCards = [
    { label: "Today's Appointments", value: "24", trend: "+3", color: "sky" },
    { label: "Active Patients", value: "1,248", trend: "+12", color: "teal" },
    { label: "Pending Lab Results", value: "7", trend: "-2", color: "orange" },
    { label: "Weekly Revenue", value: "$18.4k", trend: "+8.4%", color: "indigo" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 h-screen w-72 bg-slate-900 text-white z-50 flex flex-col border-r border-slate-800 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 pb-2 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all overflow-hidden">
              <img src="/logo.png" alt="PremiumVet Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                PremiumVet
              </h1>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Admin CRM</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'calendar', icon: Calendar, label: 'Appointments', badge: '5' },
            { id: 'patients', icon: Activity, label: 'Patient Records' },
            { id: 'clients', icon: Users, label: 'Client Directory' },
            { id: 'invoices', icon: FileText, label: 'Billing & Invoices' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/20 text-sky-400 border border-sky-500/30 font-medium' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={activeTab === item.id ? 'text-sky-400' : 'text-slate-500'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            <Settings size={20} />
            Settings
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30 relative">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-slate-600 p-2" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center relative w-full max-w-md">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patients, clients, or appointments..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
              <div className="absolute right-2 px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400">⌘K</div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">Dr. Sterling</p>
                <p className="text-xs text-slate-500">Lead Veterinarian</p>
              </div>
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 group-hover:border-sky-200 transition-colors" />
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Welcome Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
              <p className="text-slate-500 mt-1">Here is what's happening at the clinic today.</p>
            </div>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <Plus size={18} />
              New Appointment
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0`}></div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-slate-500 mb-2">{stat.label}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                    <span className={`text-sm font-semibold mb-1 ${stat.trend.startsWith('+') ? 'text-teal-600' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Upcoming Appointments Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Today's Schedule</h3>
                <button className="text-sm font-semibold text-sky-600 hover:text-sky-700">View Calendar</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {upcomingAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-slate-900">{apt.time}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img src={`https://i.pravatar.cc/150?img=${apt.avatar}`} alt={apt.owner} className="w-8 h-8 rounded-full border border-slate-200" />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{apt.pet} <span className="text-xs font-normal text-slate-500">({apt.type})</span></p>
                              <p className="text-xs text-slate-500">{apt.owner}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{apt.reason}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                            ${apt.status === 'Arrived' ? 'bg-teal-50 text-teal-700 border border-teal-100' : ''}
                            ${apt.status === 'Waiting' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                            ${apt.status === 'Confirmed' ? 'bg-sky-50 text-sky-700 border border-sky-100' : ''}
                          `}>
                            {apt.status === 'Arrived' && <CheckCircle2 size={12} />}
                            {apt.status === 'Waiting' && <Clock size={12} />}
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-sm font-medium text-slate-400 hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-all">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl"></div>
                <h3 className="text-white font-bold mb-2">Need a quick action?</h3>
                <p className="text-slate-400 text-sm mb-6">Create new records instantly.</p>
                
                <div className="space-y-3 relative z-10">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium py-3 rounded-xl transition-all text-left px-4 flex items-center justify-between">
                    Register New Patient <Plus size={16} />
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium py-3 rounded-xl transition-all text-left px-4 flex items-center justify-between">
                    Create Invoice <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  
                  {[
                    { title: "Lab results received", desc: "Bloodwork for Max is ready to review.", time: "10 min ago", color: "sky" },
                    { title: "Invoice Paid", desc: "Emma Wilson paid $145.00", time: "1 hour ago", color: "teal" },
                    { title: "Appointment Cancelled", desc: "Oliver's checkup was cancelled.", time: "2 hours ago", color: "red" }
                  ].map((activity, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-${activity.color}-500 shrink-0 relative z-10 shadow-sm`}></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 bg-slate-50 rounded-xl border border-slate-100 ml-4 md:ml-0 md:mr-0 group-odd:md:mr-4 group-even:md:ml-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{activity.title}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">{activity.time}</span>
                        </div>
                        <p className="text-xs text-slate-500">{activity.desc}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
