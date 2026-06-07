import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Trash2, ChevronLeft, ChevronRight,
    RefreshCw, Phone, Mail, Copy, Check, Eye, ChevronDown, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeadDetailPanel } from '../components/DetailPanels';
import toast from 'react-hot-toast';

/* ── Click-to-copy cell ───────────────────────────────────────────────────── */
const CopyCell = ({ value, icon: Icon }) => {
    const [copied, setCopied] = useState(false);
    if (!value) return <span className="text-gray-300 text-[12px]">—</span>;
    const copy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
        toast.success('Copied!', { duration: 1200 });
    };
    return (
        <button onClick={copy}
            className="flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-black transition-colors group">
            <Icon size={11} className="text-gray-400 shrink-0" />
            <span className="truncate max-w-[140px]">{value}</span>
            {copied
                ? <Check size={10} className="text-green-500 shrink-0" />
                : <Copy size={10} className="text-gray-300 group-hover:text-gray-500 shrink-0" />
            }
        </button>
    );
};

const ITEMS_PER_PAGE = 10;

/* ── Lead row ──────────────────────────────────────────────────────────────── */
const LeadRow = ({ lead, onDelete, onView }) => (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
        <td className="px-4 py-3">
            <div>
                <p className="text-[13px] font-semibold text-gray-900">{lead.name}</p>
                <p className="text-[11px] text-gray-400 capitalize">{lead.source || 'website'}</p>
            </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
            <CopyCell value={lead.phone} icon={Phone} />
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
            <CopyCell value={lead.email} icon={Mail} />
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
            <p className="text-[12px] text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
        </td>
        <td className="px-4 py-3">
            <div className="flex items-center gap-1 justify-end">
                <button onClick={() => onView(lead)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                    <Eye size={13} />
                </button>
                <button onClick={() => onDelete(lead._id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={13} />
                </button>
            </div>
        </td>
    </tr>
);

/* ── Main Page ─────────────────────────────────────────────────────────────── */
const Leads = () => {
    const { apiFetch } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [page, setPage] = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/api/leads');
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    }, [apiFetch]);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    /* Open detail panel — also fetch appointment history */
    const handleView = async (lead) => {
        setSelectedLead({ ...lead, _appointments: [] });
        try {
            const res = await apiFetch(`/api/leads/${lead._id}/appointments`);
            const appts = await res.json();
            setSelectedLead(prev => prev ? { ...prev, _appointments: Array.isArray(appts) ? appts : [] } : null);
        } catch { /* keep empty list */ }
    };

    /* Filter */
    const filtered = leads.filter(l => {
        const matchSearch =
            l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase()) ||
            l.phone?.toLowerCase().includes(search.toLowerCase());
        const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
        const matchDate = !dateFrom || new Date(l.createdAt) >= new Date(dateFrom);
        return matchSearch && matchSource && matchDate;
    });
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    /* Safe delete */
    const handleDelete = async (id) => {
        if (!confirm('Delete this lead?')) return;
        try {
            const res = await apiFetch(`/api/leads/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) { toast.error(data.message); return; }
            setLeads(prev => prev.filter(l => l._id !== id));
            toast.success('Lead deleted');
        } catch {
            toast.error('Failed to delete lead');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 tracking-[-0.02em]">Leads</h1>
                    <p className="text-[13px] text-gray-400 mt-0.5">{leads.length} total leads</p>
                </div>
                <button onClick={fetchLeads} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-black transition-colors">
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Name, email or phone…"
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="pl-8 pr-4 py-2 rounded-[10px] border border-black/[0.1] bg-white text-[13px] focus:outline-none focus:border-black transition-all w-52" />
                </div>
                {/* Source */}
                <div className="relative">
                    <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
                        className="px-3 py-2 pr-7 rounded-[10px] border border-black/[0.1] bg-white text-[12px] text-gray-700 focus:outline-none focus:border-black appearance-none cursor-pointer transition-all">
                        <option value="all">All sources</option>
                        <option value="website">Website</option>
                        <option value="manual">Manual</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {/* Date from */}
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                    title="Created from date"
                    className="px-3 py-2 rounded-[10px] border border-black/[0.1] bg-white text-[12px] text-gray-700 focus:outline-none focus:border-black transition-all" />
                {/* Clear */}
                {(search || sourceFilter !== 'all' || dateFrom) && (
                    <button onClick={() => { setSearch(''); setSourceFilter('all'); setDateFrom(''); setPage(1); }}
                        className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[16px] border border-black/[0.07] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="text-center py-20 text-[13px] text-gray-400">
                        {search ? 'No leads match your search.' : 'No leads yet. They will appear here after bookings are made.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/[0.05]">
                                    {['Name', 'Phone', 'Email', 'Created', ''].map((h, i) => (
                                        <th key={i} className={`px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap
                                            ${i === 1 ? 'hidden md:table-cell' : ''}
                                            ${i === 2 ? 'hidden lg:table-cell' : ''}
                                            ${i === 3 ? 'hidden sm:table-cell' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map(lead => (
                                    <LeadRow key={lead._id} lead={lead}
                                        onDelete={handleDelete}
                                        onView={handleView} />
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

            {/* Detail Panel */}
            <AnimatePresence>
                {selectedLead && (
                    <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Leads;
