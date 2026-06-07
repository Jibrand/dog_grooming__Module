import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function QuickAppointment({ clinic }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    setFetchingSlots(true);
    let subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'localhost' || subdomain === '127') {
      subdomain = 'cliniclocal';
    }

    try {
      const API = 'https://dog-grooming-module-apms.vercel.app';
      const res = await fetch(`${API}/api/appointments/available-slots?date=${date}&subdomain=${subdomain}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAvailableSlots(data.availableSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    let subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'localhost' || subdomain === '127') {
      subdomain = 'cliniclocal';
    }

    try {
      const API = 'https://dog-grooming-module-apms.vercel.app';
      const res = await fetch(`${API}/api/appointments/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, subdomain })
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        e.target.reset();
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white relative z-10">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 shadow-premium border border-slate-100 overflow-hidden relative">
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative z-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">Request Appointment</h3>
                    <p className="text-slate-500 text-sm">We'll confirm your slot shortly.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                    <input required name="userName" type="text" minLength="2" maxLength="50" pattern="[A-Za-z\s]+" title="Name should only contain letters and spaces" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input required name="userPhone" type="tel" pattern="[0-9]{10,14}" title="Please enter a valid phone number (10 to 14 digits)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="5550000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pet's Name</label>
                    <input required name="petName" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="Max, Bella, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Breed & Size</label>
                    <input required name="species" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="e.g. Golden Retriever, Large" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Needed</label>
                    <select name="reason" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none">
                      {clinic?.services?.map((svc, idx) => (
                        <option key={idx} value={svc.name}>{svc.name}</option>
                      ))}
                      {(!clinic?.services || clinic.services.length === 0) && (
                        <>
                          <option value="Full Groom">Full Groom</option>
                          <option value="Bath & Brush">Bath & Brush</option>
                          <option value="Nail Trimming">Nail Trimming</option>
                          <option value="Other">Other</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <input 
                        required 
                        name="appointmentDate" 
                        type="date" 
                        min={(() => {
                          const now = new Date();
                          // If it's past 5:00 PM (17:00), today is no longer an option. Start from tomorrow.
                          if (now.getHours() >= 17) {
                            now.setDate(now.getDate() + 1);
                          }
                          return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                        })()} 
                        onChange={handleDateChange} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                      <select required name="appointmentTime" disabled={fetchingSlots || availableSlots.length === 0} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none">
                        <option value="">
                          {fetchingSlots 
                            ? 'Loading slots...' 
                            : (availableSlots.length > 0 
                                ? 'Select a time' 
                                : (document.querySelector('input[name="appointmentDate"]')?.value ? 'No slots available' : 'Pick a date first')
                              )
                          }
                        </option>
                        {availableSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white rounded-xl px-4 py-4 font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      {loading ? 'Submitting...' : 'Request Appointment'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500 max-w-sm">We've received your appointment request and will text you shortly to confirm the exact time.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
