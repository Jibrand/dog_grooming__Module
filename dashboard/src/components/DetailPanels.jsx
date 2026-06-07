import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Globe, Calendar, Clock, MapPin, AlertCircle, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const STATUS_STYLE = {
    new: 'bg-black text-white',
    contacted: 'bg-blue-100 text-blue-700',
    booked: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    lost: 'bg-red-50 text-red-500',
};
const APPT_STATUS_STYLE = {
    scheduled: 'bg-blue-50 text-blue-600',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-50 text-red-500',
};
const URGENCY_STYLE = {
    normal: 'bg-gray-100 text-gray-500',
    urgent: 'bg-amber-100 text-amber-700',
    emergency: 'bg-red-100 text-red-600',
};

/* ── Copy-to-clipboard inline ─────────────────────────────────────────────── */
const CopyField = ({ icon: Icon, value, label }) => {
    const [copied, setCopied] = useState(false);
    if (!value) return null;
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    return (
        <button onClick={copy}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-gray-50 hover:bg-gray-100 transition-colors text-left w-full group">
            <Icon size={13} className="text-gray-400 shrink-0" />
            <span className="text-[13px] text-gray-700 flex-1 truncate">{value}</span>
            {copied
                ? <Check size={12} className="text-green-500 shrink-0" />
                : <Copy size={12} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            }
        </button>
    );
};

const SLabel = ({ children }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-gray-400 mb-2">{children}</p>
);

/* ══════════════════════════════════════════════════════════════════════════════
   Lead Detail Panel
   ══════════════════════════════════════════════════════════════════════════════ */
export const LeadDetailPanel = ({ lead, onClose }) => {
    if (!lead) return null;
    const appts = lead._appointments || [];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{lead.name}</h2>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${STATUS_STYLE[lead.status] || 'bg-gray-100'}`}>{lead.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Lead · via {lead.source || 'website'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={17} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Contact */}
                    <div>
                        <SLabel>Contact</SLabel>
                        <div className="space-y-1.5">
                            <CopyField icon={Phone} value={lead.phone} />
                            <CopyField icon={Mail} value={lead.email} />
                        </div>
                    </div>

                    {/* Meta */}
                    <div>
                        <SLabel>Details</SLabel>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[12px] text-gray-500">
                                <Globe size={12} className="text-gray-400" />
                                <span>Source: <span className="capitalize font-medium text-gray-700">{lead.source || 'website'}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] text-gray-500">
                                <Calendar size={12} className="text-gray-400" />
                                <span>Created: <span className="font-medium text-gray-700">
                                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                </span></span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                        <div>
                            <SLabel>Notes</SLabel>
                            <div className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 rounded-[10px]">
                                <FileText size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-gray-600 leading-relaxed">{lead.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Appointment History */}
                    <div>
                        <SLabel>Appointment History ({appts.length})</SLabel>
                        {appts.length === 0 ? (
                            <p className="text-[12px] text-gray-400 italic px-1">No appointments yet</p>
                        ) : (
                            <div className="space-y-2">
                                {appts.map(a => (
                                    <div key={a._id} className="p-3 rounded-[12px] border border-black/[0.06] bg-gray-50/60 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[13px] font-semibold text-gray-900">{a.serviceType || 'Service'}</p>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${APPT_STATUS_STYLE[a.status] || 'bg-gray-100'}`}>
                                                {a.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar size={10} />{a.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} />{a.timeSlot}</span>
                                        </div>
                                        {a.address?.city && (
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                                <MapPin size={10} />{[a.address.street, a.address.city, a.address.zip].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                        {a.urgency && a.urgency !== 'normal' && (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${URGENCY_STYLE[a.urgency]}`}>{a.urgency}</span>
                                        )}
                                        {a.description && (
                                            <p className="text-[11px] text-gray-500 italic leading-relaxed">{a.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ══════════════════════════════════════════════════════════════════════════════
   Appointment Detail Panel
   ══════════════════════════════════════════════════════════════════════════════ */
export const ApptDetailPanel = ({ appt, onClose }) => {
    if (!appt) return null;
    const lead = appt.leadId || {};

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">{appt.serviceType || 'Appointment'}</h2>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${APPT_STATUS_STYLE[appt.status] || 'bg-gray-100'}`}>{appt.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{appt.date} · {appt.timeSlot}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={17} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Schedule */}
                    <div>
                        <SLabel>Schedule</SLabel>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-[12px] text-center">
                                <p className="text-[10px] text-gray-400 mb-0.5">Date</p>
                                <p className="text-[13px] font-semibold text-gray-900">{appt.date ? new Date(`${appt.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-[12px] text-center">
                                <p className="text-[10px] text-gray-400 mb-0.5">Time</p>
                                <p className="text-[13px] font-semibold text-gray-900">{appt.timeSlot || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div>
                        <SLabel>Client</SLabel>
                        <div className="p-3 bg-gray-50 rounded-[12px] space-y-2">
                            <p className="text-[13px] font-semibold text-gray-900">{lead.name || '—'}</p>
                            <div className="space-y-1.5">
                                <CopyField icon={Phone} value={lead.phone} />
                                <CopyField icon={Mail} value={lead.email} />
                            </div>
                        </div>
                    </div>

                    {/* Job */}
                    <div>
                        <SLabel>Job Info</SLabel>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-[10px]">
                                <span className="text-[12px] text-gray-500">Service</span>
                                <span className="text-[12px] font-semibold text-gray-900">{appt.serviceType || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-[10px]">
                                <span className="text-[12px] text-gray-500">Urgency</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${URGENCY_STYLE[appt.urgency] || 'bg-gray-100 text-gray-500'}`}>{appt.urgency || 'normal'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {appt.description && (
                        <div>
                            <SLabel>Description</SLabel>
                            <div className="px-3 py-2.5 bg-gray-50 rounded-[10px]">
                                <p className="text-[12px] text-gray-600 leading-relaxed">{appt.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {(appt.address?.street || appt.address?.city) && (
                        <div>
                            <SLabel>Location</SLabel>
                            <div className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 rounded-[10px]">
                                <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-gray-700 leading-relaxed">
                                    {[appt.address.street, appt.address.city, appt.address.zip].filter(Boolean).join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Alert if no address */}
                    {!appt.address?.city && !appt.address?.street && (
                        <div className="flex items-center gap-2 text-[12px] text-amber-600 bg-amber-50 px-3 py-2 rounded-[10px] border border-amber-100">
                            <AlertCircle size={13} /> No address provided
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
