import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Check, Clock, Calendar, Layers, Link2, Star, User as UserIcon, Globe, Phone, Mail, MapPin, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSettings = {
    availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '17:00',
        allowOverlap: false,
    },
    services: [],
    googleReviewUrl: '',
    reviewAutomation: {
        enabled: false,
        firstDelay: 1,
        maxReminders: 2,
        interval: 2,
    },
    winBackAutomation: {
        enabled: false,
        delay: 30,
        messageType: 'Both',
        message: 'Hi! We haven\'t seen you in a while. We\'d love to have you back! Use code WELCOMEBACK for 10% off your next session.',
    },
};

/* ── Toggle switch component ─────────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-black' : 'bg-gray-200'}`}
    >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
);

/* ── Section wrapper ─────────────────────────────────────────────────────── */
const Section = ({ icon: Icon, title, desc, children }) => (
    <div className="bg-white rounded-[16px] border border-black/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center gap-3">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shrink-0">
                <Icon size={13} className="text-white" />
            </div>
            <div>
                <p className="text-[14px] font-semibold text-gray-900">{title}</p>
                {desc && <p className="text-[11px] text-gray-400">{desc}</p>}
            </div>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

/* ── Main Settings Page ───────────────────────────────────────────────────── */
const Settings = () => {
    const { apiFetch, setUser } = useAuth();
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [newService, setNewService] = useState({ name: '' });
    const [addingService, setAddingService] = useState(false);

    // Profile
    const [profile, setProfile] = useState({});
    const [profSaving, setProfSaving] = useState(false);
    const [profSaved, setProfSaved] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);

    /* ── Load settings ─────────────────────────────────────────────────── */
    const fetchSettings = useCallback(async () => {
        try {
            const res = await apiFetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    }, [apiFetch]);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    /* ── Load profile ──────────────────────────────────────────────────── */
    const fetchProfile = useCallback(async () => {
        try {
            const res = await apiFetch('/api/profile');
            const data = await res.json();
            setProfile(data);
        } catch { /* silent */ }
    }, [apiFetch]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    /* ── Save profile ──────────────────────────────────────────────────── */
    const handleSaveProfile = async () => {
        setProfSaving(true);
        try {
            const res = await apiFetch('/api/profile', {
                method: 'PATCH',
                body: JSON.stringify({
                    name: profile.name,
                    businessName: profile.businessName,
                    phone: profile.phone,
                    website: profile.website,
                    tagline: profile.tagline,
                    address: {
                        street: profile.address?.street,
                        city: profile.address?.city,
                        state: profile.address?.state,
                        zip: profile.address?.zip,
                    },
                }),
            });
            if (!res.ok) throw new Error('Save failed');
            const data = await res.json();
            setProfile(data);
            setUser(prev => ({ ...prev, ...data }));
            setProfSaved(true);
            setTimeout(() => setProfSaved(false), 2500);
            toast.success('Profile saved!');
        } catch {
            toast.error('Failed to save profile');
        } finally {
            setProfSaving(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoUploading(true);
        const formData = new FormData();
        formData.append('logo', file);

        try {
            const res = await apiFetch('/api/profile/logo', {
                method: 'PATCH',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setProfile(prev => ({ ...prev, logoUrl: data.logoUrl }));
            setUser(prev => ({ ...prev, logoUrl: data.logoUrl }));
            toast.success('Logo updated!');
        } catch (err) {
            toast.error(err.message || 'Failed to upload logo');
        } finally {
            setLogoUploading(false);
        }
    };

    const setAddr = (key, val) =>
        setProfile(p => ({ ...p, address: { ...p.address, [key]: val } }));

    /* ── Save ──────────────────────────────────────────────────────────── */
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await apiFetch('/api/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    availability: settings.availability,
                    services: settings.services,
                    googleReviewUrl: settings.googleReviewUrl || '',
                    reviewAutomation: settings.reviewAutomation,
                    winBackAutomation: settings.winBackAutomation,
                }),
            });
            if (!res.ok) throw new Error('Save failed');
            const data = await res.json();
            setSettings(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    /* ── Save ALL (profile + settings together) ───────────────────── */
    const handleSaveAll = async () => {
        await Promise.all([handleSaveProfile(), handleSave()]);
    };
    const isSavingAll = saving || profSaving;
    const allSaved = saved && profSaved;

    /* ── Availability helpers ──────────────────────────────────────────── */
    const toggleDay = (day) => {
        const days = settings.availability.days.includes(day)
            ? settings.availability.days.filter(d => d !== day)
            : [...settings.availability.days, day];
        setSettings(s => ({ ...s, availability: { ...s.availability, days } }));
    };

    const setAvail = (key, val) =>
        setSettings(s => ({ ...s, availability: { ...s.availability, [key]: val } }));

    /* ── Service helpers ───────────────────────────────────────────────── */
    const addService = () => {
        if (!newService.name.trim()) return;
        const svc = { name: newService.name.trim() };
        setSettings(s => ({ ...s, services: [...s.services, svc] }));
        setNewService({ name: '' });
        setAddingService(false);
    };

    const deleteService = (idx) =>
        setSettings(s => ({ ...s, services: s.services.filter((_, i) => i !== idx) }));

    const updateService = (idx, key, val) =>
        setSettings(s => ({
            ...s,
            services: s.services.map((svc, i) => i === idx ? { ...svc, [key]: val } : svc)
        }));

    const inp = 'w-full px-3 py-2 rounded-[9px] border border-black/[0.1] bg-gray-50 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all';

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-gray-900 tracking-[-0.02em]">Settings</h1>
                    <p className="text-[13px] text-gray-500 mt-0.5">Manage your profile, availability and services</p>
                </div>
                {/* <button
                    onClick={handleSaveAll}
                    disabled={isSavingAll}
                    className="flex items-center gap-2 bg-black text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-black/80 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                >
                    {isSavingAll ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : allSaved ? (
                        <><Check size={13} /> Saved!</>
                    ) : (
                        <><Save size={13} /> Save All Changes</>
                    )}
                </button> */}
            </div>

            <fieldset disabled className="space-y-5 opacity-80">




            {/* ── Business Profile ──────────────────────────────────────── */}
            <Section icon={UserIcon} title="Business Profile" desc="Your public business information">
                <div className="space-y-6">
                    {/* Logo Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-black/[0.05]">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-black/[0.07] overflow-hidden flex items-center justify-center shadow-sm">
                                {profile.logoUrl ? (
                                    <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-gray-400">
                                        <Upload size={20} strokeWidth={1.5} />
                                        <span className="text-[10px] font-medium uppercase tracking-wider">Logo</span>
                                    </div>
                                )}
                                {logoUploading && (
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-[14px] font-semibold text-gray-900">Business Logo</h3>
                            <p className="text-[11px] text-gray-500 mt-0.5 mb-3 max-w-[320px]">
                                Upload your company logo. This will be displayed in the sidebar and on client communications.
                            </p>
                            <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-black/[0.1] px-4 py-2 rounded-xl text-[12px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-black/30 active:scale-95 transition-all shadow-sm">
                                <Upload size={13} />
                                {profile.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Owner Name</label>
                            <input value={profile.name || ''} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                placeholder="Your full name" className={inp} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                            <input value={profile.email || ''} readOnly
                                className={`${inp} opacity-60 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Business Name</label>
                            <input value={profile.businessName || ''} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))}
                                placeholder="Your business name" className={inp} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                            <input value={profile.category || ''} readOnly
                                className={`${inp} opacity-60 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                            <div className="relative">
                                <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="+1 555 000 0000" className={`${inp} pl-8`} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Website</label>
                            <div className="relative">
                                <Globe size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input value={profile.website || ''} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                                    placeholder="https://yoursite.com" className={`${inp} pl-8`} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tagline</label>
                        <input value={profile.tagline || ''} onChange={e => setProfile(p => ({ ...p, tagline: e.target.value }))}
                            placeholder="Fast, reliable, professional" className={inp} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Address</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input value={profile.address?.street || ''} onChange={e => setAddr('street', e.target.value)}
                                placeholder="Street" className={`${inp} sm:col-span-2`} />
                            <input value={profile.address?.city || ''} onChange={e => setAddr('city', e.target.value)}
                                placeholder="City" className={inp} />
                            <input value={profile.address?.state || ''} onChange={e => setAddr('state', e.target.value)}
                                placeholder="State / Province" className={inp} />
                            <input value={profile.address?.zip || ''} onChange={e => setAddr('zip', e.target.value)}
                                placeholder="ZIP / Postal code" className={inp} />
                        </div>
                    </div>
                    <div className="flex justify-end pt-1">
                        <p className="text-[11px] text-gray-400 italic">Use "Save All Changes" above to save</p>
                    </div>
                </div>
            </Section>

            {/* ── Availability Sections ────────────────────────────────────── */}
            <Section icon={Calendar} title="Availability" desc="Set your working days and hours">
                <div className="space-y-5">
                    {/* Day picker */}
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-3">Working Days</p>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map(day => {
                                const active = settings.availability.days.includes(day);
                                return (
                                    <button key={day} type="button" onClick={() => toggleDay(day)}
                                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${active
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-500 border-black/[0.1] hover:border-black/30'
                                            }`}>
                                        {day.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5">Start Time</p>
                            <div className="relative">
                                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="time"
                                    value={settings.availability.startTime}
                                    onChange={e => setAvail('startTime', e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-[9px] border border-black/[0.1] bg-gray-50 text-[13px] focus:outline-none focus:border-black focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1.5">End Time</p>
                            <div className="relative">
                                <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="time"
                                    value={settings.availability.endTime}
                                    onChange={e => setAvail('endTime', e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 rounded-[9px] border border-black/[0.1] bg-gray-50 text-[13px] focus:outline-none focus:border-black focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Allow overlap */}
                    <div className="flex items-center justify-between py-3 border-t border-black/[0.05]">
                        <div>
                            <p className="text-[13px] font-semibold text-gray-900">Allow overlapping appointments</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Accept multiple bookings at the same time slot</p>
                        </div>
                        <Toggle
                            checked={settings.availability.allowOverlap}
                            onChange={val => setAvail('allowOverlap', val)}
                        />
                    </div>
                    {settings.availability.allowOverlap && (
                        <div className="flex items-center gap-4 pt-1 pl-1">
                            <p className="text-[12px] text-gray-600 font-medium">How many parallel appointments?</p>
                            <input
                                type="number" min="2" max="20"
                                value={settings.availability.maxParallel || 2}
                                onChange={e => setAvail('maxParallel', Number(e.target.value))}
                                className="w-16 px-1 py-1.5 rounded-[9px] border border-black/[0.1] bg-gray-50 text-[13px] font-semibold text-center focus:outline-none focus:border-black focus:bg-white transition-all"
                            />
                        </div>
                    )}
                </div>
            </Section>

            {/* ── Services ────────────────────────────────────────────────── */}
            <Section icon={Layers} title="Services" desc="Define the services you offer">
                <div className="space-y-3">
                    {/* Existing services */}
                    {settings.services.length === 0 && !addingService && (
                        <p className="text-[13px] text-gray-400 italic py-2">No services added yet.</p>
                    )}

                    {settings.services.map((svc, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 rounded-[12px] border border-black/[0.07] bg-gray-50/60"
                        >
                            <input
                                value={svc.name}
                                onChange={e => updateService(idx, 'name', e.target.value)}
                                placeholder="Service name"
                                className="flex-1 bg-transparent text-[13px] font-semibold text-gray-900 outline-none placeholder:text-gray-400 min-w-0"
                            />
                            <button onClick={() => deleteService(idx)}
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0">
                                <Trash2 size={13} />
                            </button>
                        </motion.div>
                    ))}

                    {addingService && (
                        <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-[12px] border-2 border-dashed border-black/20 bg-white space-y-3"
                        >
                            <div>
                                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Service Name</label>
                                <input
                                    autoFocus
                                    value={newService.name}
                                    onChange={e => setNewService({ name: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && addService()}
                                    placeholder="e.g. Haircut"
                                    className={inp}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setAddingService(false)}
                                    className="px-3 py-1.5 text-[12px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all">
                                    Cancel
                                </button>
                                <button onClick={addService}
                                    className="px-4 py-1.5 text-[12px] font-semibold bg-black text-white rounded-lg hover:bg-black/80 transition-all">
                                    Add Service
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Add button */}
                    {!addingService && (
                        <button
                            onClick={() => setAddingService(true)}
                            className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-black border border-dashed border-black/20 hover:border-black/40 px-4 py-2 rounded-[10px] transition-all w-full justify-center mt-1"
                        >
                            <Plus size={13} /> Add Service
                        </button>
                    )}
                </div>
            </Section>

            {/* ── Google Review URL ────────────────────────────────────────── */}
            <Section icon={Star} title="Google Review Link" desc="Sent to customers when their appointment is completed">
                <div className="space-y-3">
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                        When a job is marked <strong>Completed</strong>, the customer receives an email with a link to rate their experience.
                        Customers who give 4–5 stars are redirected to your Google Review page.
                    </p>
                    <div className="relative">
                        <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="url"
                            placeholder="https://g.page/r/YOUR_ID/review"
                            value={settings.googleReviewUrl || ''}
                            onChange={e => setSettings(s => ({ ...s, googleReviewUrl: e.target.value }))}
                            className="w-full pl-8 pr-4 py-2 rounded-[9px] border border-black/[0.1] bg-gray-50 text-[13px] focus:outline-none focus:border-black focus:bg-white transition-all"
                        />
                    </div>
                    <p className="text-[11px] text-gray-400">
                        Get your link: Google Maps → Your Business → Share → Copy link
                    </p>
                </div>
            </Section>
            </fieldset>
        </div>
    );
};

export default Settings;
