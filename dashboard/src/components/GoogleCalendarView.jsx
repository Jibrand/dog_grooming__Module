import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, RefreshCw, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const GoogleCalendarView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Check if there are tokens in the URL (redirected from backend)
        const urlParams = new URLSearchParams(window.location.search);
        const tokensParam = urlParams.get('tokens');

        if (tokensParam) {
            try {
                const tokens = JSON.parse(decodeURIComponent(tokensParam));
                localStorage.setItem('google_calendar_tokens', JSON.stringify(tokens));
                // Clear the URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (err) {
                console.error("Error parsing tokens from URL", err);
            }
        }

        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const savedTokens = localStorage.getItem('google_calendar_tokens');
            if (!savedTokens) {
                setError("Please connect your Google Calendar first.");
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:3001/api/calendar/events', {
                params: { tokens: savedTokens }
            });
            setEvents(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch calendar events. Try reconnecting.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = () => {
        window.location.href = 'http://localhost:3001/api/calendar/auth';
    };

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const renderGrid = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = (startOfMonth(currentDate) + 6) % 7; // Adjust to start on Monday
        const days = [];

        // Add padding for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`prev-${i}`} className="min-h-[120px] bg-gray-50/50 border border-gray-100/50 opacity-30"></div>);
        }

        // Add current month days
        for (let day = 1; day <= totalDays; day++) {
            const dayEvents = events.filter(e => {
                const eDate = new Date(e.start.dateTime || e.start.date);
                return eDate.getFullYear() === currentDate.getFullYear() &&
                    eDate.getMonth() === currentDate.getMonth() &&
                    eDate.getDate() === day;
            });

            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

            days.push(
                <div key={day} className={`min-h-[120px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors group relative cursor-pointer ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
                    <span className={`text-xs font-bold mb-2 inline-block ${isToday ? 'bg-black text-white px-2 py-0.5 rounded-md' : 'text-gray-400'}`}>
                        {day}
                    </span>
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar text-left">
                        {dayEvents.map((event, idx) => (
                            <div key={idx} className="bg-black text-white px-2 py-1 rounded text-[9px] font-bold truncate hover:scale-[1.02] transition-transform shadow-sm flex flex-col gap-0.5">
                                <span className="opacity-80 flex items-center gap-1">
                                    <Clock size={8} />
                                    {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="truncate">{event.summary}</span>
                                {event.location && <span className="text-[7px] text-gray-400 truncate mt-0.5">📍 {event.location}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    if (loading && events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-gray-100 backdrop-blur-sm shadow-sm">
                <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Syncing Google Calendar...</p>
            </div>
        );
    }

    if (!localStorage.getItem('google_calendar_tokens') || error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm text-center px-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sync Google Calendar</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm font-medium">
                    Connect your account to visualize all your meetings in this beautiful grid view.
                </p>
                <button
                    onClick={handleConnect}
                    className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 transition-all shadow-lg shadow-black/10 group"
                >
                    <div className="w-5 h-5 flex items-center justify-center font-black text-xs bg-white text-black rounded-sm group-hover:scale-110 transition-transform">G</div>
                    Connect with Google
                </button>
                {error && <p className="mt-4 text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-100 shadow-inner">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm group"
                        >
                            <ChevronLeft size={16} className="text-gray-400 group-hover:text-black" />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm group"
                        >
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-black" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchEvents}
                        className="p-3 hover:bg-gray-100 rounded-2xl transition-all border border-gray-100 shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-black/10 hover:bg-black/80 transition-all" onClick={() => setCurrentDate(new Date())}>
                        TODAY
                    </button>
                </div>
            </div>

            <div className="apple-card p-0 overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-700">
                <div className="grid grid-cols-7 bg-gray-50/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <div key={day} className="p-3 text-center text-[10px] font-black text-gray-400 tracking-widest border-b border-gray-100">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 text-sm font-medium">
                    {renderGrid()}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <div className="w-1 h-3 bg-black rounded-full"></div>
                    Legend & Sync Stats
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <div className="w-2 h-2 bg-black rounded-full shadow-sm"></div>
                        Google Calendar
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-200"></div>
                        Synced Live
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold ml-auto uppercase tracking-tighter">
                        Last sync: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GoogleCalendarView;
