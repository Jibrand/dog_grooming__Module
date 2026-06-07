import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, ChevronLeft, ChevronRight, MessageSquare,
    RefreshCw, ThumbsUp, ThumbsDown, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 15;

const StarDisplay = ({ rating }) => (
    <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={12}
                className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
        ))}
    </span>
);

const Reviews = () => {
    const { apiFetch } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [ratingFilter, setRating] = useState('all');   // 'all' | '5' | '4' | '3' | '2' | '1' | 'positive' | 'negative'
    const [selected, setSelected] = useState(null);    // full-detail view

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const fakeReviews = [
                { _id: '1', clientName: 'Sarah Jenkins', clientEmail: 'sarah.j@email.com', rating: 5, feedback: 'The styling team took amazing care of my golden retriever! The staff is so friendly and professional. Highly recommend this salon.', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
                { _id: '2', clientName: 'Mike Rogers', clientEmail: 'mike.r@email.com', rating: 4, feedback: 'Great service, but we had to wait about 15 minutes past our appointment time. Overall very satisfied with the care my cat received.', submittedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
                { _id: '3', clientName: 'Emily Chen', clientEmail: 'emily.chen88@email.com', rating: 5, feedback: 'They saved my puppy\'s life! The emergency response was incredibly fast and the follow-up care has been exceptional.', submittedAt: new Date(Date.now() - 86400000 * 12).toISOString() },
                { _id: '4', clientName: 'David Wilson', clientEmail: 'davidw@email.com', rating: 2, feedback: 'Felt a bit rushed during the consultation. The vet didn\'t really answer all my questions about my dog\'s diet plan.', submittedAt: new Date(Date.now() - 86400000 * 15).toISOString() },
                { _id: '5', clientName: 'Jessica Taylor', clientEmail: 'jtaylor@email.com', rating: 5, feedback: 'The best dog grooming salon in town! The facility is spotlessly clean and everyone genuinely loves animals.', submittedAt: new Date(Date.now() - 86400000 * 20).toISOString() }
            ];
            setReviews(fakeReviews);
            setTotal(fakeReviews.length);
        } catch {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    /* Client-side rating filter */
    const filtered = reviews.filter(r => {
        if (ratingFilter === 'all') return true;
        if (ratingFilter === 'positive') return r.rating >= 4;
        if (ratingFilter === 'negative') return r.rating <= 3;
        return r.rating === parseInt(ratingFilter);
    });

    /* Summary stats */
    const avg = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '—';
    const positive = reviews.filter(r => r.rating >= 4).length;
    const negative = reviews.filter(r => r.rating <= 3).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 tracking-[-0.02em]">Reviews</h1>
                    <p className="text-[13px] text-gray-400 mt-0.5">{total} total reviews collected</p>
                </div>
                <button onClick={fetchReviews}
                    className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-black border border-black/[0.1] px-3 py-2 rounded-[10px] transition-all hover:border-black/30 self-start">
                    <RefreshCw size={12} /> Refresh
                </button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Avg Rating', value: avg, sub: 'out of 5', icon: Star },
                    { label: 'Positive', value: positive, sub: '4–5 stars', icon: ThumbsUp },
                    { label: 'Negative', value: negative, sub: '1–3 stars', icon: ThumbsDown },
                ].map(c => (
                    <div key={c.label} className="bg-white rounded-[16px] border border-black/[0.07] p-4 flex flex-col gap-1">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
                        <p className="text-[24px] font-bold text-gray-900 leading-none">{c.value}</p>
                        <p className="text-[11px] text-gray-400">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'positive', label: '👍 Positive (4–5★)' },
                    { key: 'negative', label: '👎 Negative (1–3★)' },
                    { key: '5', label: '⭐ 5 stars' },
                    { key: '4', label: '⭐ 4 stars' },
                    { key: '3', label: '⭐ 3 stars' },
                    { key: '2', label: '⭐ 2 stars' },
                    { key: '1', label: '⭐ 1 star' },
                ].map(f => (
                    <button key={f.key} onClick={() => setRating(f.key)}
                        className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold border transition-all
                            ${ratingFilter === f.key
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-500 border-black/[0.1] hover:border-black/30'}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[16px] border border-black/[0.07] overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-[13px] text-gray-400">
                        No reviews yet. They appear when customers submit feedback.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/[0.05]">
                                    {['Customer', 'Rating', 'Type', 'Feedback', 'Date'].map((h, i) => (
                                        <th key={i} className={`px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap ${i === 3 ? 'hidden md:table-cell' : ''}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r._id}
                                        onClick={() => setSelected(r)}
                                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer group">
                                        <td className="px-4 py-3">
                                            <p className="text-[13px] font-semibold text-gray-900">{r.clientName || '—'}</p>
                                            <p className="text-[11px] text-gray-400">{r.clientEmail || ''}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StarDisplay rating={r.rating} />
                                            <p className="text-[11px] text-gray-400 mt-0.5">{r.rating}/5</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.rating >= 4 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                                                    <ThumbsUp size={9} /> Positive
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-500">
                                                    <ThumbsDown size={9} /> Negative
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell max-w-[220px]">
                                            <p className="text-[12px] text-gray-600 truncate">
                                                {r.feedback ? `"${r.feedback}"` : <span className="text-gray-300 italic">No written feedback</span>}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-[12px] text-gray-500">
                                                {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination — always visible */}
            <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray-400">
                    Showing {filtered.length} of {total} reviews · Page {page} of {Math.max(1, totalPages)}
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


            {/* Detail side panel */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <p className="text-[14px] font-bold text-gray-900">Review Detail</p>
                                <button onClick={() => setSelected(null)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black transition-all">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-[15px] shrink-0">
                                        {selected.clientName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold text-gray-900">{selected.clientName || '—'}</p>
                                        <p className="text-[12px] text-gray-400">{selected.clientEmail}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <StarDisplay rating={selected.rating} />
                                    <p className="text-[13px] text-gray-600">{selected.rating} out of 5 stars</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-[12px]">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Type</p>
                                    {selected.rating >= 4 ? (
                                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-green-700">
                                            <ThumbsUp size={12} /> Positive — redirected to Google Review
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-500">
                                            <ThumbsDown size={12} /> Negative — private feedback captured
                                        </span>
                                    )}
                                </div>
                                {selected.feedback && (
                                    <div className="p-3 bg-gray-50 rounded-[12px]">
                                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Feedback</p>
                                        <p className="text-[13px] text-gray-700 leading-relaxed italic">"{selected.feedback}"</p>
                                    </div>
                                )}
                                <div className="p-3 bg-gray-50 rounded-[12px]">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Submitted</p>
                                    <p className="text-[13px] text-gray-700">
                                        {selected.submittedAt
                                            ? new Date(selected.submittedAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Reviews;
