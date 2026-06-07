import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, RefreshCw, ExternalLink } from 'lucide-react';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 pt-24 font-['Outfit']">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            My Schedule
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your Google Calendar meetings and appointments.</p>
                    </div>
                    <button
                        onClick={handleConnect}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-white/10 group"
                    >
                        {/* Using a simple div to represent Google Icon since lucide doesnt have it directly */}
                        <div className="w-5 h-5 flex items-center justify-center font-bold text-blue-600">G</div>
                        Connect Google Calendar
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-blue-400" />
                                Upcoming Meetings
                            </h2>
                            <button
                                onClick={fetchEvents}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-400">Loading your schedule...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={handleConnect}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Connect Now
                                </button>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div key={event.id} className="group p-6 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-all duration-300">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                    {event.summary}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                                    {new Date(event.start.dateTime || event.start.date).toLocaleString([], {
                                                        weekday: 'long',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            {event.htmlLink && (
                                                <a
                                                    href={event.htmlLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-slate-700/50 rounded-lg hover:bg-blue-500 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-white" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
                                <CalendarIcon className="w-12 h-12 text-slate-600 mb-4" />
                                <p className="text-slate-400">No upcoming meetings found.</p>
                                <button
                                    onClick={handleConnect}
                                    className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                                >
                                    Check connection settings
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-2">Google Sync</h3>
                            <p className="text-blue-100/80 text-sm mb-6">
                                Connected as <span className="text-white font-medium">jibrandevn@gmail.com</span>
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-blue-100/90">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    Real-time synchronization
                                </div>
                                <div className="flex items-center gap-3 text-sm text-blue-100/90">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    Auto-update meetings
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-3xl">
                            <h3 className="text-lg font-semibold mb-4 text-white">Calendar Settings</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Primary Calendar</span>
                                    <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Notification Sync</span>
                                    <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                                        <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
