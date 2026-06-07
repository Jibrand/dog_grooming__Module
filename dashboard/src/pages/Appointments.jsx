import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, ChevronLeft, ChevronRight,
    RefreshCw, Calendar, Clock, MapPin, ChevronDown, User, Eye, Filter, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApptDetailPanel, LeadDetailPanel } from '../components/DetailPanels';
import toast from 'react-hot-toast';

/* ── Status config ────────────────────────────────────────────────────────── */
const STATUSES = ['scheduled', 'in-progress', 'completed', 'cancelled'];
const STATUS_STYLE = {
    scheduled: 'bg-blue-50 text-blue-600 border border-blue-100',
    'in-progress': 'bg-amber-100 text-amber-700 border border-amber-200',
    completed: 'bg-green-100 text-green-700 border border-green-200',
    cancelled: 'bg-red-50 text-red-500 border border-red-100',
};
const URGENCY_STYLE = {
    normal: 'text-gray-400',
    urgent: 'bg-amber-100 text-amber-700',
    emergency: 'bg-red-100 text-red-600',
};

const Badge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLE[status] || 'bg-gray-100 text-gray-500'}`}>
        {status}
    </span>
);

const ITEMS_PER_PAGE = 10;

/* ── Appointment row ──────────────────────────────────────────────────────── */
const ApptRow = ({ appt, index, totalInPage, isOpen, onToggle, onStatusChange, onDelete, onView, onViewLead }) => {
    const leadName = appt.leadId?.name || '—';

    // Dropup logic: trigger for last 2 rows, but only if they aren't the first 2 rows (safety for header)
    const isLastRows = index >= totalInPage - 2 && index > 1;

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
            {/* Customer */}
            <td className="px-4 py-3">
                <button onClick={() => onViewLead(appt.leadId)}
                    className="flex items-center gap-2 text-left hover:opacity-75 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User size={12} className="text-gray-400" />
                    </div>
                    <p className="text-[13px] font-semibold text-gray-900 underline-offset-2 hover:underline tracking-tight">{leadName}</p>
                </button>
            </td>

            {/* Created */}
            <td className="py-3 px-4 text-[13px] text-gray-500 font-medium whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                    {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '-'}
                </div>
            </td>

            {/* Service */}
            <td className="px-4 py-3 hidden sm:table-cell">
                <p className="text-[12px] font-medium text-gray-700 truncate max-w-[120px]">{appt.serviceType || '—'}</p>
            </td>

            {/* Date */}
            <td className="px-4 py-3 hidden md:table-cell">
                <p className="text-[12px] text-gray-700 flex items-center gap-1 whitespace-nowrap">
                    <Calendar size={11} className="text-gray-400" />
                    {appt.date ? new Date(`${appt.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                </p>
            </td>

            {/* Time */}
            <td className="px-4 py-3 hidden lg:table-cell">
                <p className="text-[12px] text-gray-600 flex items-center gap-1 whitespace-nowrap">
                    <Clock size={11} className="text-gray-400" />
                    {appt.timeSlot || '—'}
                </p>
            </td>

            {/* Urgency */}
            <td className="px-4 py-3 hidden 2xl:table-cell">
                {appt.urgency && appt.urgency !== 'normal'
                    ? <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${URGENCY_STYLE[appt.urgency]}`}>{appt.urgency}</span>
                    : <span className="text-[12px] text-gray-300">Normal</span>
                }
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <div className="relative dropdown-container">
                    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="flex items-center gap-1 group/status">
                        <Badge status={appt.status} />
                        <ChevronDown size={11} className="text-gray-400 group-hover/status:text-black transition-colors" />
                    </button>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: isLastRows ? -8 : 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: isLastRows ? -8 : 8, scale: 0.95 }}
                                transition={{ duration: 0.1, ease: 'easeOut' }}
                                className={`absolute z-50 ${isLastRows ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 sm:left-0 bg-white rounded-[14px] border border-black/[0.08] shadow-2xl p-1.5 min-w-[140px] origin-center`}
                            >
                                {STATUSES.map(s => (
                                    <button key={s} onClick={() => { onStatusChange(appt._id, s); onToggle(); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-[8px] text-[12px] font-medium capitalize transition-colors ${appt.status === s ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-right">
                <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => onView(appt)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                        <Eye size={15} />
                    </button>
                    <button onClick={() => onDelete(appt._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={15} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

/* ── Main Page ─────────────────────────────────────────────────────────────── */
const Appointments = () => {
    const { apiFetch } = useAuth();
    const [appts, setAppts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [page, setPage] = useState(1);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [openRowId, setOpenRowId] = useState(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.dropdown-container')) setOpenRowId(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchAppts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/appointments');
            const data = await res.json();
            setAppts(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [apiFetch]);

    useEffect(() => { fetchAppts(); }, [fetchAppts]);

    /* Open lead detail from customer cell */
    const handleViewLead = async (leadObj) => {
        if (!leadObj?._id) return;
        setSelectedLead({ ...leadObj, _appointments: [] });
        try {
            const res = await apiFetch(`/api/leads/${leadObj._id}/appointments`);
            const appts = await res.json();
            setSelectedLead(prev => prev ? { ...prev, _appointments: Array.isArray(appts) ? appts : [] } : null);
        } catch { /* keep empty list */ }
    };

    const resetFilters = () => {
        setSearch(''); setStatusFilter('all'); setUrgencyFilter('all'); setDateFilter(''); setPage(1);
    };
    const hasActiveFilter = search || statusFilter !== 'all' || urgencyFilter !== 'all' || dateFilter;

    /* Filter */
    const filtered = appts.filter(a => {
        const name = a.leadId?.name || '';
        const matchSearch =
            name.toLowerCase().includes(search.toLowerCase()) ||
            (a.serviceType || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.address?.city || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchUrgency = urgencyFilter === 'all' || a.urgency === urgencyFilter;
        const matchDate = !dateFilter || a.date === dateFilter;
        return matchSearch && matchStatus && matchUrgency && matchDate;
    });
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    /* Status update */
    const handleStatusChange = async (id, newStatus) => {
        setAppts(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
        try {
            const res = await apiFetch(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
            if (!res.ok) throw new Error();
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update status');
            fetchAppts();
        }
    };

    /* Delete */
    const handleDelete = async (id) => {
        if (!confirm('Delete this appointment?')) return;
        setAppts(prev => prev.filter(a => a._id !== id));
        try {
            const res = await apiFetch(`/api/appointments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Appointment deleted');
        } catch {
            toast.error('Failed to delete appointment');
            fetchAppts();
        }
    };

    const selCls = 'px-3 py-2 rounded-[10px] border border-black/[0.1] bg-white text-[12px] text-gray-700 focus:outline-none focus:border-black transition-all cursor-pointer appearance-none pr-7';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 tracking-[-0.02em]">Appointments</h1>
                    <p className="text-[13px] text-gray-400 mt-0.5">{appts.length} total appointments</p>
                </div>
                <button onClick={fetchAppts} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-black transition-colors">
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                {/* Search */}
                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Name, service, city…"
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="pl-8 pr-4 py-2 rounded-[10px] border border-black/[0.1] bg-white text-[13px] focus:outline-none focus:border-black transition-all w-48" />
                </div>
                {/* Date */}
                <div className="relative">
                    <input type="date" value={dateFilter}
                        onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                        className={selCls + ' pl-3'} title="Filter by date" />
                </div>
                {/* Urgency */}
                <div className="relative">
                    <select value={urgencyFilter} onChange={e => { setUrgencyFilter(e.target.value); setPage(1); }} className={selCls}>
                        <option value="all">All urgency</option>
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Status */}
                <div className="relative">
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className={selCls}>
                        <option value="all">All status</option>
                        {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Clear */}
                {hasActiveFilter && (
                    <button onClick={resetFilters}
                        className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[16px] border border-black/[0.07] ">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-20 text-[13px] text-gray-400">
                        {hasActiveFilter ? 'No appointments match your filters.' : 'No appointments yet. They appear when customers book.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/[0.05]">
                                    {['Customer', 'Created', 'Service', 'Date', 'Time', 'Urgency', 'Status', ''].map((h, i) => (
                                        <th key={i} className={`px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap
                                            ${i === 1 ? 'hidden xl:table-cell' : ''}
                                            ${i === 2 ? 'hidden sm:table-cell' : ''}
                                            ${i === 3 ? 'hidden md:table-cell' : ''}
                                            ${i === 4 ? 'hidden lg:table-cell' : ''}
                                            ${i === 5 ? 'hidden 2xl:table-cell' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((appt, idx) => (
                                    <ApptRow key={appt._id} appt={appt}
                                        index={idx}
                                        totalInPage={paginated.length}
                                        isOpen={openRowId === appt._id}
                                        onToggle={() => setOpenRowId(prev => prev === appt._id ? null : appt._id)}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                        onView={setSelectedAppt}
                                        onViewLead={handleViewLead} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[12px] text-gray-400">
                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="p-1.5 rounded-lg border border-black/[0.1] text-gray-500 hover:text-black disabled:opacity-30 transition-all">
                            <ChevronLeft size={14} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
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
                </div>
            )}

            <AnimatePresence>
                {selectedAppt && (
                    <ApptDetailPanel appt={selectedAppt} onClose={() => setSelectedAppt(null)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {selectedLead && (
                    <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Appointments;
