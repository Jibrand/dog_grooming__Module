import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, ChevronLeft, ChevronRight, RefreshCw,
    User, Calendar, Settings, Star, Trash2, ChevronDown, X,
    ExternalLink, MapPin, Phone, Mail, Clock, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 20;

/* ── Activity type config ────────────────────────────────────────────────── */
const TYPE_META = {
    booking_received: { label: 'Booking', color: 'bg-blue-100 text-blue-600', icon: Calendar, linkable: 'appointment' },
    lead_created: { label: 'Lead Created', color: 'bg-gray-100 text-gray-600', icon: User, linkable: 'lead' },
    lead_status_changed: { label: 'Lead Status', color: 'bg-purple-100 text-purple-600', icon: User, linkable: 'lead' },
    lead_updated: { label: 'Lead Updated', color: 'bg-gray-100 text-gray-500', icon: User, linkable: 'lead' },
    lead_deleted: { label: 'Lead Deleted', color: 'bg-red-100 text-red-500', icon: Trash2, linkable: null },
    appointment_created: { label: 'Appt Created', color: 'bg-green-100 text-green-600', icon: Calendar, linkable: 'appointment' },
    appointment_status_changed: { label: 'Appt Status', color: 'bg-amber-100 text-amber-600', icon: Calendar, linkable: 'appointment' },
    appointment_updated: { label: 'Appt Updated', color: 'bg-gray-100 text-gray-500', icon: Calendar, linkable: 'appointment' },
    appointment_deleted: { label: 'Appt Deleted', color: 'bg-red-100 text-red-500', icon: Trash2, linkable: null },
    settings_updated: { label: 'Settings', color: 'bg-gray-100 text-gray-600', icon: Settings, linkable: 'settings' },
    profile_updated: { label: 'Profile', color: 'bg-gray-100 text-gray-600', icon: Settings, linkable: null },
};

const getMeta = (type) => TYPE_META[type] || { label: type, color: 'bg-gray-100 text-gray-500', icon: Activity, linkable: null };

const TypeBadge = ({ type }) => {
    const { label, color } = getMeta(type);
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${color}`}>
            {label}
        </span>
    );
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const ALL_TYPES = Object.keys(TYPE_META);

/* ── Field row helper ─────────────────────────────────────────────────────── */
const Field = ({ label, value, icon: Icon }) => (
    value ? (
        <div className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
            {Icon && <Icon size={13} className="text-gray-400 mt-0.5 shrink-0" />}
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-[13px] text-gray-800 mt-0.5 break-words">{value}</p>
            </div>
        </div>
    ) : null
);

/* ── Status badge ─────────────────────────────────────────────────────────── */
const STATUS_COLORS = {
    scheduled: 'bg-blue-50 text-blue-600',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-50 text-red-500',
    booked: 'bg-blue-50 text-blue-600',
};
const StatusPill = ({ status }) => (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
        {status?.replace('-', ' ')}
    </span>
);

/* ── Panel: Appointment detail ────────────────────────────────────────────── */
const AppointmentPanel = ({ entity }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[14px] font-bold text-gray-600 shrink-0">
                {entity.leadId?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
                <p className="text-[14px] font-semibold text-gray-900">{entity.leadId?.name || '—'}</p>
                <p className="text-[11px] text-gray-400">{entity.leadId?.email || entity.leadId?.phone || ''}</p>
            </div>
            <div className="ml-auto"><StatusPill status={entity.status} /></div>
        </div>
        <Field label="Service" value={entity.serviceType} icon={Activity} />
        <Field label="Date" value={entity.date} icon={Calendar} />
        <Field label="Time Slot" value={entity.timeSlot} icon={Clock} />
        <Field label="Urgency" value={entity.urgency} icon={AlertCircle} />
        <Field label="Address" value={[entity.address?.street, entity.address?.city, entity.address?.zip].filter(Boolean).join(', ')} icon={MapPin} />
        <Field label="Notes" value={entity.notes} />
        <Field label="Description" value={entity.description} />
        {entity.createdAt && (
            <div className="pt-2 mt-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-400">Created {new Date(entity.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        )}
    </div>
);

/* ── Panel: Lead detail ───────────────────────────────────────────────────── */
const LeadPanel = ({ entity }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[14px] font-bold text-gray-600 shrink-0">
                {entity.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
                <p className="text-[14px] font-semibold text-gray-900">{entity.name || '—'}</p>
                <p className="text-[11px] text-gray-400">{entity.source}</p>
            </div>
        </div>
        <Field label="Email" value={entity.email} icon={Mail} />
        <Field label="Phone" value={entity.phone} icon={Phone} />
        <Field label="Address" value={entity.address} icon={MapPin} />
        <Field label="Notes" value={entity.notes} />
        {entity.appointments?.length > 0 && (
            <div className="pt-3 mt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Appointment History ({entity.appointments.length})</p>
                <div className="space-y-2">
                    {entity.appointments.map(a => (
                        <div key={a._id} className="p-2.5 rounded-[10px] bg-gray-50 flex items-start justify-between gap-2">
                            <div>
                                <p className="text-[12px] font-semibold text-gray-800">{a.serviceType || '—'}</p>
                                <p className="text-[11px] text-gray-400">{a.date} {a.timeSlot ? `· ${a.timeSlot}` : ''}</p>
                            </div>
                            <StatusPill status={a.status} />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

/* ── Panel: Settings detail ───────────────────────────────────────────────── */
const SettingsPanel = ({ entity }) => (
    <div className="space-y-1">
        <Field label="Working Days" value={entity.availability?.days?.join(', ')} icon={Calendar} />
        <Field label="Hours" value={entity.availability ? `${entity.availability.startTime} – ${entity.availability.endTime}` : null} icon={Clock} />
        <Field label="Allow Overlap" value={entity.availability?.allowOverlap ? `Yes (max ${entity.availability.maxParallel || 2})` : 'No'} />
        {entity.services?.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Services ({entity.services.length})</p>
                <div className="flex flex-wrap gap-1.5">
                    {entity.services.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-[12px] text-gray-700 font-medium">{s.name}</span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Main Activities component
   ═══════════════════════════════════════════════════════════════════════════ */
const Activities = () => {
    const { apiFetch } = useAuth();
    const [activities, setActivities] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    /* Entity slide panel */
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelData, setPanelData] = useState(null);   // { type, entity, message }
    const [panelLoading, setPanelLoading] = useState(false);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: ITEMS_PER_PAGE });
            if (typeFilter) params.set('type', typeFilter);
            const res = await apiFetch(`/api/activities?${params}`);
            const data = await res.json();
            setActivities(data.activities || []);
            setTotal(data.total || 0);
        } catch {
            toast.error('Failed to load activities');
        } finally {
            setLoading(false);
        }
    }, [apiFetch, page, typeFilter]);

    useEffect(() => { fetchActivities(); }, [fetchActivities]);

    const resetFilter = () => { setTypeFilter(''); setPage(1); };

    /* ── Open entity panel ─────────────────────────────────────────────── */
    const openEntity = async (activity) => {
        const meta = getMeta(activity.type);
        const etype = meta.linkable;
        if (!etype || !activity.entityId) return;

        setPanelOpen(true);
        setPanelData(null);
        setPanelLoading(true);
        try {
            const res = await apiFetch(`/api/activities/entity/${etype}/${activity.entityId}`);
            const data = await res.json();
            if (!res.ok) { toast.error(data.message || 'Entity not found'); setPanelOpen(false); return; }
            setPanelData({ type: etype, entity: data, message: activity.message });
        } catch {
            toast.error('Failed to load entity details');
            setPanelOpen(false);
        } finally {
            setPanelLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 tracking-[-0.02em]">Activity Log</h1>
                    <p className="text-[13px] text-gray-400 mt-0.5">{total} total events recorded</p>
                </div>
                <button onClick={fetchActivities}
                    className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-black border border-black/[0.1] px-3 py-2 rounded-[10px] transition-all hover:border-black/30 self-start">
                    <RefreshCw size={12} /> Refresh
                </button>
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                    <button onClick={() => setShowFilter(f => !f)}
                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border border-black/[0.1] bg-white text-gray-600 hover:border-black/30 transition-all">
                        {typeFilter ? getMeta(typeFilter).label : 'All Types'}
                        <ChevronDown size={11} />
                    </button>
                    {showFilter && (
                        <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-black/[0.1] rounded-[12px] shadow-xl p-1.5 min-w-[180px]">
                            <button onClick={() => { resetFilter(); setShowFilter(false); }}
                                className={`w-full text-left text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-colors ${!typeFilter ? 'bg-black text-white' : 'hover:bg-gray-50'}`}>
                                All Types
                            </button>
                            {ALL_TYPES.map(t => (
                                <button key={t} onClick={() => { setTypeFilter(t); setPage(1); setShowFilter(false); }}
                                    className={`w-full text-left text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-colors ${typeFilter === t ? 'bg-black text-white' : 'hover:bg-gray-50'}`}>
                                    {getMeta(t).label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {typeFilter && (
                    <button onClick={resetFilter}
                        className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Timeline list */}
            <div className="bg-white rounded-[16px] border border-black/[0.07] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-20 text-[13px] text-gray-400">No activities recorded yet.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {activities.map(a => {
                            const { icon: Icon, linkable } = getMeta(a.type);
                            const isLinkable = linkable && a.entityId;
                            return (
                                <div key={a._id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                                    {/* Type icon */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${getMeta(a.type).color}`}>
                                        <Icon size={12} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <TypeBadge type={a.type} />
                                            <p className="text-[13px] text-gray-800 leading-snug">{a.message}</p>
                                        </div>
                                        {/* Compact meta preview */}
                                        {a.meta && Object.keys(a.meta).length > 0 && (
                                            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">
                                                {Object.entries(a.meta)
                                                    .filter(([, v]) => v !== null && v !== undefined && typeof v !== 'object')
                                                    .slice(0, 3)
                                                    .map(([k, v]) => `${k}: ${v}`)
                                                    .join(' · ')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: time + view button */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <p className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(a.createdAt)}</p>
                                        {isLinkable && (
                                            <button
                                                onClick={() => openEntity(a)}
                                                title={`View ${linkable}`}
                                                className="p-1.5 rounded-lg text-gray-300 hover:text-black hover:bg-gray-100 transition-all"
                                            >
                                                <ExternalLink size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray-400">
                    Page {page} of {Math.max(1, totalPages)} · {total} events
                </p>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="p-1.5 rounded-lg border border-black/[0.1] text-gray-500 hover:text-black disabled:opacity-30 transition-all">
                            <ChevronLeft size={14} />
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)}
                                className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${page === i + 1 ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="p-1.5 rounded-lg border border-black/[0.1] text-gray-500 hover:text-black disabled:opacity-30 transition-all">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Entity slide panel ─────────────────────────────────────────── */}
            <AnimatePresence>
                {panelOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setPanelOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
                        />
                        <motion.div
                            key="panel"
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-white shadow-2xl z-50 flex flex-col"
                        >
                            {/* Panel header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                                <div>
                                    <p className="text-[14px] font-bold text-gray-900 capitalize">
                                        {panelData?.type} Details
                                    </p>
                                    {panelData && (
                                        <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[280px]">{panelData.message}</p>
                                    )}
                                </div>
                                <button onClick={() => setPanelOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-all shrink-0">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Panel body */}
                            <div className="flex-1 overflow-y-auto p-5">
                                {panelLoading ? (
                                    <div className="flex items-center justify-center h-40">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : panelData?.entity ? (
                                    <>
                                        {panelData.type === 'appointment' && <AppointmentPanel entity={panelData.entity} />}
                                        {panelData.type === 'lead' && <LeadPanel entity={panelData.entity} />}
                                        {panelData.type === 'settings' && <SettingsPanel entity={panelData.entity} />}
                                    </>
                                ) : null}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Activities;
