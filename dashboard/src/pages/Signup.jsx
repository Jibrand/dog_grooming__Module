import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, User, Mail, Lock, Briefcase, ChevronDown, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Groomer', 'Pet Spa', 'Mobile Grooming', 'Luxury Salon'];

const Signup = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', email: '', password: '',
        businessName: '', category: ''
    });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');
    const [clinicInfo, setClinicInfo] = useState(null);

    React.useEffect(() => {
        async function fetchClinicInfo() {
            try {
                let subdomain = window.location.hostname.split('.')[0];
                if (subdomain === 'localhost' || subdomain === '127') {
                    subdomain = 'cliniclocal';
                }
                const API = 'https://dog-grooming-module-apms.vercel.app';
                const res = await fetch(`${API}/api/clinic/public/${subdomain}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setClinicInfo(data.data);
                    const name = data.data.name || 'VetCare CRM';
                    const logo = data.data.logoUrl || '/logo.png';
                    document.title = `Signup | ${name}`;
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                    }
                    link.href = logo;
                }
            } catch (err) {
                console.error('Failed to fetch clinic info', err);
            }
        }
        fetchClinicInfo();
    }, []);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.category) { setError('Please select a business category'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        try {
            await register(form);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        }
    };

    const inputCls = 'w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-black/[0.1] bg-white text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/[0.08] transition-all';
    const lbl = 'block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5';

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4 py-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    {clinicInfo?.logoUrl ? (
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-lg shadow-black/[0.05] mb-4 overflow-hidden border border-black/[0.05]">
                            <img src={clinicInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-black rounded-[14px] flex items-center justify-center shadow-lg mb-4 overflow-hidden">
                             <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    )}
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-[-0.03em] text-center">Create account for {clinicInfo?.name || 'Grooming CRM'}</h1>
                    <p className="text-[13px] text-gray-500 mt-1">Start managing your business in minutes.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[20px] border border-black/[0.07] shadow-sm shadow-black/[0.04] p-7">
                    {error && (
                        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-[10px] text-[12px] text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className={lbl}>Your Name</label>
                            <div className="relative">
                                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input required type="text" placeholder="Ali Khan" value={form.name}
                                    onChange={e => set('name', e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className={lbl}>Business Name</label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input required type="text" placeholder="Paws & Bubbles Grooming" value={form.businessName}
                                    onChange={e => set('businessName', e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className={lbl}>Business Type</label>
                            <div className="relative">
                                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select required value={form.category} onChange={e => set('category', e.target.value)}
                                    className={`${inputCls} pl-4 pr-8 appearance-none cursor-pointer`}>
                                    <option value="">Select your business type…</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={lbl}>Email</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input required type="email" autoComplete="email" placeholder="you@business.com" value={form.email}
                                    onChange={e => set('email', e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={lbl}>Password <span className="normal-case text-gray-300 font-normal">(min 6 chars)</span></label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input required type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                                    placeholder="••••••••" value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    className={`${inputCls} pr-10`} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-black text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-black/80 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <> Create Account <ArrowRight size={13} /> </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[12px] text-gray-500 mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black font-semibold hover:underline">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
