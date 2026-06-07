import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
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
                const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://veterinary-clinics-futureframe-back.vercel.app' : 'http://localhost:3000');
                const res = await fetch(`${API}/api/clinic/public/${subdomain}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setClinicInfo(data.data);
                    const name = data.data.name || 'VetCare CRM';
                    const logo = data.data.logoUrl || '/logo.png';
                    document.title = `Login | ${name}`;
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
        try {
            await login(form);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message);
        }
    };

    const inputCls = 'w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-black/[0.1] bg-white text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black -500 focus:ring-2 focus:ring-black -500/10 transition-all';

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-[-0.03em] text-center">
                        Sign in to {clinicInfo?.name || 'Your CRM'}
                    </h1>
                    <p className="text-[13px] text-gray-500 mt-1">Welcome back, your CRM is waiting.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[20px] border border-black/[0.07] shadow-sm shadow-black/[0.04] p-7">
                    {error && (
                        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-[10px] text-[12px] text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="email" required autoComplete="email"
                                    placeholder="you@business.com"
                                    value={form.email}
                                    onChange={e => set('email', e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em]">Password</label>
                            </div>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPwd ? 'text' : 'password'} required autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => set('password', e.target.value)}
                                    className={`${inputCls} pr-10`}
                                />
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
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-black -600 text-white text-[13px] font-semibold py-2.5 rounded-full hover:bg-black -700 active:scale-[0.98] transition-all shadow-md shadow-black -200 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <> Sign In <ArrowRight size={13} /> </>
                            )}
                        </button>
                    </form>
                </div>
{/* 
                <p className="text-center text-[12px] text-gray-500 mt-5">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-black -600 font-semibold hover:underline">
                        Create one
                    </Link>
                </p> */}
            </motion.div>
        </div>
    );
};

export default Login;
