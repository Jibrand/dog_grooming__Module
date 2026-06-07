import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, MapPin, MessageSquare, ChevronRight } from 'lucide-react';

const AddLeadModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal / Slide-over */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl tracking-tight mb-1">add new lead</h2>
                                <p className="text-[11px] text-gray-400">enter customer details to start a new job</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form className="flex flex-col gap-10">
                                {/* Personal Information */}
                                <section>
                                    <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-6 px-1">personal details</h3>
                                    <div className="flex flex-col gap-6">
                                        <div className="group">
                                            <label className="text-[11px] text-gray-400 mb-2 block px-1">full name</label>
                                            <div className="flex items-center gap-3 bg-gray-50 border border-transparent group-focus-within:border-black group-focus-within:bg-white p-3.5 rounded-2xl transition-all">
                                                <User size={16} className="text-gray-300" />
                                                <input
                                                    type="text"
                                                    placeholder="john doe"
                                                    className="bg-transparent border-none outline-none text-sm w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="group">
                                                <label className="text-[11px] text-gray-400 mb-2 block px-1">phone</label>
                                                <div className="flex items-center gap-3 bg-gray-50 border border-transparent group-focus-within:border-black group-focus-within:bg-white p-3.5 rounded-2xl transition-all">
                                                    <Phone size={16} className="text-gray-300" />
                                                    <input
                                                        type="tel"
                                                        placeholder="07123..."
                                                        className="bg-transparent border-none outline-none text-sm w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="group">
                                                <label className="text-[11px] text-gray-400 mb-2 block px-1">email</label>
                                                <div className="flex items-center gap-3 bg-gray-50 border border-transparent group-focus-within:border-black group-focus-within:bg-white p-3.5 rounded-2xl transition-all">
                                                    <Mail size={16} className="text-gray-300" />
                                                    <input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        className="bg-transparent border-none outline-none text-sm w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Job Details */}
                                <section>
                                    <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-6 px-1">job information</h3>
                                    <div className="flex flex-col gap-6">
                                        <div className="group">
                                            <label className="text-[11px] text-gray-400 mb-2 block px-1">address</label>
                                            <div className="flex items-center gap-3 bg-gray-50 border border-transparent group-focus-within:border-black group-focus-within:bg-white p-3.5 rounded-2xl transition-all">
                                                <MapPin size={16} className="text-gray-300" />
                                                <input
                                                    type="text"
                                                    placeholder="123 street lane"
                                                    className="bg-transparent border-none outline-none text-sm w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[11px] text-gray-400 mb-2 block px-1">issue description</label>
                                            <div className="flex items-start gap-3 bg-gray-50 border border-transparent group-focus-within:border-black group-focus-within:bg-white p-3.5 rounded-2xl transition-all">
                                                <MessageSquare size={16} className="text-gray-300 mt-1" />
                                                <textarea
                                                    rows={4}
                                                    placeholder="describe the leaking pipe or repair needed..."
                                                    className="bg-transparent border-none outline-none text-sm w-full resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </form>
                        </div>

                        <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl text-[13px] border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                cancel
                            </button>
                            <button className="flex-[2] py-4 rounded-2xl text-[13px] bg-black text-white hover:opacity-80 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                create lead
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddLeadModal;
