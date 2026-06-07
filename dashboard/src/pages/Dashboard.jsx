import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    Users, Calendar, CheckCircle2, Star, TrendingUp,
    ArrowUpRight, ArrowDownRight, Zap, Award, Target, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const STATUS_COLOR = {
    scheduled: '#3b82f6',
    'in-progress': '#f59e0b',
    completed: '#22c55e',
    cancelled: '#ef4444',
};
const STATUS_LABEL = {
    scheduled: 'Scheduled', 'in-progress': 'In Progress',
    completed: 'Completed', cancelled: 'Cancelled',
};
const SOURCE_PALETTE = ['#000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6', '#fafafa', '#fff'];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = n => (n == null ? '—' : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const pct = v => {
    if (v == null) return null;
    return { pos: v >= 0, label: `${v >= 0 ? '+' : ''}${v}%` };
};
const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.42, delay: d, ease: [0.23, 1, 0.32, 1] },
});
const timeAgo = d => {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
};

/* ── KPI Card ────────────────────────────────────────────────────────────── */
const KpiCard = ({ title, value, sub, icon: Icon, badge, accent = 'bg-gray-100', iconColor = 'text-gray-600', delay = 0 }) => {
    const b = badge;
    return (
        <motion.div {...fadeUp(delay)}
            className="bg-white rounded-[20px] border border-black/[0.06] p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon size={17} className={iconColor} />
                </div>
                {b && (
                    <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${b.pos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {b.pos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {b.label}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[12px] text-gray-400 font-medium">{title}</p>
                <p className="text-[28px] font-bold text-gray-900 leading-none mt-1 tracking-tight">{fmt(value)}</p>
            </div>
            {sub && <p className="text-[11px] text-gray-400 leading-relaxed">{sub}</p>}
        </motion.div>
    );
};

/* ── Custom chart tooltip ────────────────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-black/10 rounded-[10px] px-3 py-2 shadow-xl text-[12px]">
            <p className="font-bold text-gray-600 mb-1">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

/* ── Card wrapper ────────────────────────────────────────────────────────── */
const Card = ({ children, className = '', p = 'p-5' }) => (
    <div className={`bg-white rounded-[20px] border border-black/[0.06] ${p} ${className}`}>{children}</div>
);

const CardTitle = ({ title, sub }) => (
    <div className="mb-3">
        <p className="text-[13px] font-bold text-gray-900">{title}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
);

/* ── Activity type labels ─────────────────────────────────────────────────── */
const ACT_COLOR = {
    booking_received: '#3b82f6',
    lead_created: '#6b7280',
    appointment_created: '#22c55e',
    appointment_status_changed: '#f59e0b',
    lead_status_changed: '#8b5cf6',
    settings_updated: '#9ca3af',
    profile_updated: '#9ca3af',
};
const ACT_LABEL = {
    booking_received: 'Booking',
    lead_created: 'Lead',
    appointment_created: 'Appointment',
    appointment_status_changed: 'Status Change',
    lead_status_changed: 'Lead Status',
    settings_updated: 'Settings',
    profile_updated: 'Profile',
};

/* ═══════════════════════════════════════════════════════════════════════════
   Dashboard
   ═══════════════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
    const { apiFetch, user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/dashboard');
            if (res.ok) setData(await res.json());
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [apiFetch]);

    useEffect(() => { load(); }, [load]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const kpi = data?.kpi || {};

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pb-6">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-[-0.02em]">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

            </div>

            {/* ── KPI Row 1 ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard delay={0} title="Total Leads" value={kpi.totalLeads} icon={Users} accent="bg-black" iconColor="text-white" badge={pct(kpi.leadsGrowth)} sub={`${kpi.leadsThisMonth ?? 0} new this month`} />
                <KpiCard delay={0.05} title="Appointments" value={kpi.totalAppts} icon={Calendar} accent="bg-blue-50" iconColor="text-blue-600" badge={null} sub={`${kpi.scheduled ?? 0} scheduled`} />
                <KpiCard delay={0.1} title="Completed Appts" value={kpi.totalCompleted} icon={CheckCircle2} accent="bg-green-50" iconColor="text-green-600" badge={pct(kpi.completedGrowth)} sub={`${kpi.completedThisMonth ?? 0} this month`} />
                <KpiCard delay={0.15} title="Conversion Rate" value={`${kpi.conversionRate ?? 0}%`} icon={Target} accent="bg-purple-50" iconColor="text-purple-600" badge={null} sub="Appt → completed" />
            </div>

            {/* ── KPI Row 2 ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard delay={0.2} title="Total Reviews" value={kpi.totalReviews} icon={Star} accent="bg-amber-50" iconColor="text-amber-500" badge={null} sub={`${kpi.positiveReviews ?? 0} positive`} />
                <KpiCard delay={0.25} title="Avg Rating" value={kpi.avgRating ?? '—'} icon={Award} accent="bg-amber-50" iconColor="text-amber-600" badge={null} sub="Customer satisfaction" />
                <KpiCard delay={0.3} title="Cancellation Rate" value={`${kpi.cancellationRate ?? 0}%`} icon={AlertTriangle} accent="bg-red-50" iconColor="text-red-500" badge={pct(-(kpi.cancellationRate ?? 0))} sub={`${kpi.cancelled ?? 0} cancelled`} />
                <KpiCard delay={0.35} title="In Progress" value={kpi.inProgress ?? 0} icon={Zap} accent="bg-orange-50" iconColor="text-orange-500" badge={null} sub="Active appts now" />
            </div>

            {/* ── Chart row: area + two donuts (split 2/3 + 1/3) ───────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* 30-day area chart — 2/3 width */}
                <motion.div {...fadeUp(0.2)} className="lg:col-span-2">
                    <Card>
                        <CardTitle title="Appointments — Last 30 Days" sub="Daily bookings vs completed" />
                        <ResponsiveContainer width="100%" height={210}>
                            <AreaChart data={data?.apptSeries || []} margin={{ top: 5, right: 5, bottom: 0, left: -24 }}>
                                <defs>
                                    <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.10} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={6} />
                                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTip />} />
                                <Area type="monotone" dataKey="total" name="Bookings" stroke="#000" strokeWidth={2} fill="url(#gTotal)" dot={false} activeDot={{ r: 4 }} />
                                <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2} fill="url(#gCompleted)" dot={false} activeDot={{ r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>

                {/* Status donut — 1/3 width */}
                <motion.div {...fadeUp(0.25)}>
                    <Card className="flex flex-col h-full">
                        <CardTitle title="Appointment Status" sub="All-time breakdown" />
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    {/* Cell array MUST match the same filtered array as Pie data — positional mapping */}
                                    <Pie data={data?.statusBreakdown?.filter(s => s.count > 0) || []}
                                        dataKey="count" nameKey="status"
                                        cx="50%" cy="50%" innerRadius={50} outerRadius={68}
                                        paddingAngle={3} startAngle={90} endAngle={450}>
                                        {(data?.statusBreakdown?.filter(s => s.count > 0) || []).map(s => (
                                            <Cell key={s.status} fill={STATUS_COLOR[s.status] || '#ccc'} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v, n) => [v, STATUS_LABEL[n] || n]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
                                {(data?.statusBreakdown || []).filter(s => s.count > 0).map(s => (
                                    <div key={s.status} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[s.status] }} />
                                        <span className="text-[11px] text-gray-500 capitalize whitespace-nowrap">{STATUS_LABEL[s.status]} ({s.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* ── Chart row 2: services + sources + ratings ─────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Top services — truncated labels */}
                <motion.div {...fadeUp(0.3)}>
                    <Card className="h-full">
                        <CardTitle title="Top Services" sub="Most booked" />
                        {!data?.topServices?.length ? (
                            <p className="text-[12px] text-gray-400 py-8 text-center">No bookings yet</p>
                        ) : (
                            <div className="space-y-2">
                                {data.topServices.map((s, i) => {
                                    const max = data.topServices[0]?.count || 1;
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-600 font-medium truncate w-[120px] shrink-0" title={s.name}>
                                                {s.name}
                                            </span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${(s.count / max) * 100}%`, background: i === 0 ? '#000' : `hsl(0,0%,${45 + i * 12}%)` }} />
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-600 w-5 text-right shrink-0">{s.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Lead sources donut */}
                <motion.div {...fadeUp(0.32)}>
                    <Card className="h-full flex flex-col items-center">
                        <CardTitle title="Lead Sources" sub="Where leads come from" />
                        {!data?.leadSources?.length ? (
                            <p className="text-[12px] text-gray-400 py-8 text-center">No lead data yet</p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie data={data.leadSources} dataKey="count" nameKey="source"
                                            cx="50%" cy="50%" outerRadius={60} innerRadius={36} paddingAngle={4}>
                                            {data.leadSources.map((_, i) => (
                                                <Cell key={i} fill={SOURCE_PALETTE[i % SOURCE_PALETTE.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
                                    {data.leadSources.map((s, i) => (
                                        <div key={i} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: SOURCE_PALETTE[i % SOURCE_PALETTE.length] }} />
                                            <span className="text-[11px] text-gray-500 capitalize">{s.source} ({s.count})</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Card>
                </motion.div>

                {/* Rating distribution */}
                <motion.div {...fadeUp(0.34)}>
                    <Card className="h-full">
                        <CardTitle title="Review Ratings" sub="Star distribution" />
                        {!data?.ratingDist?.some(r => r.count > 0) ? (
                            <p className="text-[12px] text-gray-400 py-8 text-center">No reviews yet</p>
                        ) : (
                            <>
                                <div className="space-y-2.5">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const r = data.ratingDist.find(d => d.star === star);
                                        const cnt = r?.count || 0;
                                        const max = Math.max(...data.ratingDist.map(d => d.count), 1);
                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-gray-600 w-3 text-right">{star}</span>
                                                <Star size={9} className="text-amber-400 fill-amber-400 shrink-0" />
                                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${(cnt / max) * 100}%`, background: star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444' }} />
                                                </div>
                                                <span className="text-[11px] text-gray-400 w-4 text-right">{cnt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center mt-4 pt-3 border-t border-gray-50">
                                    <span className="text-[24px] font-bold text-gray-900">{kpi.avgRating ?? '—'}</span>
                                    <span className="text-[12px] text-gray-400 ml-1">/ 5</span>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{kpi.totalReviews} reviews</p>
                                </div>
                            </>
                        )}
                    </Card>
                </motion.div>
            </div>

            {/* ── Bottom row: equal-height white boxes with scroll ─────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

                {/* Upcoming appointments */}
                <motion.div {...fadeUp(0.4)} className="h-full">
                    <Card p="p-0" className="flex flex-col h-full" style={{ minHeight: 400 }}>
                        <div className="px-5 pt-5 pb-3 border-b border-gray-50 shrink-0">
                            <p className="text-[13px] font-bold text-gray-900">Upcoming Appointments</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Next 7 days</p>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scroll divide-y divide-gray-50">
                            {!data?.upcomingAppts?.length ? (
                                <p className="text-[12px] text-gray-400 py-10 text-center">No upcoming appointments 🎉</p>
                            ) : (
                                data.upcomingAppts.map(a => (
                                    <div key={a._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-[13px] shrink-0">
                                            {a.leadId?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-gray-900 truncate">{a.leadId?.name || '—'}</p>
                                            <p className="text-[11px] text-gray-400 truncate">{a.serviceType || 'Service'}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[11px] font-semibold text-gray-700">{a.date}</p>
                                            <p className="text-[10px] text-gray-400">{a.timeSlot || '—'}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize shrink-0 ${a.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                                            {a.status?.replace('-', ' ')}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Recent activity */}
                <motion.div {...fadeUp(0.42)} className="h-full">
                    <Card p="p-0" className="flex flex-col h-full" style={{ minHeight: 400 }}>
                        <div className="px-5 pt-5 pb-3 border-b border-gray-50 shrink-0">
                            <p className="text-[13px] font-bold text-gray-900">Recent Activity</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Latest events across your CRM</p>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scroll divide-y divide-gray-50">
                            {!data?.recentActivities?.length ? (
                                <p className="text-[12px] text-gray-400 py-10 text-center">No activities yet</p>
                            ) : (
                                data.recentActivities.map(a => (
                                    <div key={a._id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACT_COLOR[a.type] || '#9ca3af' }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{ACT_LABEL[a.type] || a.type}</p>
                                            <p className="text-[12px] text-gray-700 truncate">{a.message}</p>
                                        </div>
                                        <p className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">{timeAgo(a.createdAt)}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* ── Value banner ──────────────────────────────────────────────── */}
            {(kpi.totalCompleted ?? 0) > 0 && (
                <motion.div {...fadeUp(0.5)}
                    className="bg-black rounded-[20px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1">Business Summary</p>
                        <p className="text-[16px] font-bold leading-snug">
                            You've completed <span className="text-green-400">{kpi.totalCompleted}</span> appointments
                            {kpi.avgRating ? ` with a ${kpi.avgRating}★ avg rating` : ''}.
                            {(kpi.conversionRate ?? 0) >= 50 ? ' Conversion rate is excellent 🏆' : ' Keep pushing! 🚀'}
                        </p>
                    </div>
                    <div className="flex gap-6 shrink-0 text-center">
                        <div>
                            <p className="text-[26px] font-bold text-green-400">{kpi.conversionRate ?? 0}%</p>
                            <p className="text-[10px] text-white/40">Conversion</p>
                        </div>
                        <div>
                            <p className="text-[26px] font-bold text-amber-400">{kpi.avgRating ?? '—'}</p>
                            <p className="text-[10px] text-white/40">Rating</p>
                        </div>
                        <div>
                            <p className="text-[26px] font-bold text-blue-400">{kpi.totalLeads}</p>
                            <p className="text-[10px] text-white/40">Leads</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Dashboard;
