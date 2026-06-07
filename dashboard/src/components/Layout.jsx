import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CheckCircle2,
    Settings,
    Search,
    Plus,
    User as UserIcon,
    LogOut,
    Star,
    Activity,
    Brain,
} from 'lucide-react';
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/settings', label: 'Settings', icon: Settings },
];

/* ─── Nav Separator (Demo Section) ───────────────────────────────────────── */
const NavSeparator = ({ collapsed, label }) => (
    <div className={`flex items-center gap-3 px- py-3 mt-2 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed ? (
            <>
                <span className="text-xs font-semibold text-gray-400 px-1 whitespace-nowrap">{label}</span>
            </>
        ) : (
            <div ></div>
        )}
    </div>
);

/* ─── Hamburger Icon (react-icons) ───────────────────────────────────────── */
const HamburgerIcon = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-black transition-all shrink-0 focus:outline-none"
    >
        <motion.span
            key={isOpen ? 'cross' : 'hamburger'}
            initial={{ opacity: 0, rotate: isOpen ? -90 : 90, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
            {isOpen ? <RxCross1 size={18} /> : <RxHamburgerMenu size={18} />}
        </motion.span>
    </button>
);

/* ─── Single Nav Item ─────────────────────────────────────────────────────── */
const NavItem = ({ item, collapsed, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
        <Link
            to={item.path}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 select-none mt-1
                ${isActive
                    ? 'bg-black text-white shadow-lg shadow-black/10'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }
                ${collapsed ? 'justify-center' : ''}
            `}
        >
            <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'}`}>
                <Icon size={18} strokeWidth={1.75} />
            </span>

            <AnimatePresence initial={false}>
                {!collapsed && (
                    <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className={`text-sm font-medium overflow-hidden whitespace-nowrap ${isActive ? 'text-white' : ''}`}
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {collapsed && (
                <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50">
                    {item.label}
                </span>
            )}
        </Link>
    );
};

/* ─── Main Layout ─────────────────────────────────────────────────────────── */
const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();

    const handleLogout = () => { logout(); navigate('/login'); };

    // Refresh user profile/logo on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    /* ── Dynamic Branding (Favicon & SEO) ───────────────────────────────── */
    useEffect(() => {
        const businessName = user?.businessName || user?.name || 'VetCare CRM';
        const logoUrl = user?.logoUrl || '/favicon.png';
        const description = `Manage your business bookings and CRM with ${businessName}.`;

        // Update Title & Meta
        document.title = `${businessName} | Dashboard`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);

        // Update Favicon
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
            link.href = logoUrl;
        } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = logoUrl;
            document.head.appendChild(newLink);
        }
    }, [user?.logoUrl, user?.businessName, user?.name]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f8f8fb] text-[#1a1a1a]">

            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 72 : 189 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="hidden md:flex flex-col shrink-0 h-screen bg-white border-r border-gray-100 z-30 overflow-hidden"
            >
                {/* Logo */}
                <div className={`h-16 flex items-center shrink-0 px-4 border-b border-gray-50 ${collapsed ? 'justify-center' : ''}`}>
                    <AnimatePresence initial={false} mode="wait">
                        {!collapsed ? (
                            <motion.div
                                key="logo-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center gap-2.5 overflow-hidden"
                            >
                                {user?.logoUrl ? (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/[0.05]">
                                        <img src={user.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/[0.05]">
                                        <img src="/logo.png" alt="VetCare CRM" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <span className="text-[15px] font-bold tracking-tight text-black whitespace-nowrap truncate max-w-[120px]">
                                    {user?.businessName || 'Grooming CRM'}
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-icon"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {user?.logoUrl ? (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/[0.05]">
                                        <img src={user.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/[0.05]">
                                        <img src="/logo.png" alt="VetCare CRM" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col gap-0.5 ">
                    {navItems.map((item) => (
                        item.type === 'separator' ? (
                            <NavSeparator key={item.label} collapsed={collapsed} label={item.label} />
                        ) : (
                            <NavItem key={item.path} item={item} collapsed={collapsed} />
                        )
                    ))}
                </nav>



                {/* User Profile + Logout */}
                <div className={`shrink-0 p-3 border-t border-gray-100 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
                            <span className="text-[12px] font-bold text-blue-700">
                                {user?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <AnimatePresence initial={false}>
                            {!collapsed && (
                                <motion.div
                                    key="user-info"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                                    className="overflow-hidden flex-1"
                                >
                                    <p className="text-[13px] font-semibold text-black whitespace-nowrap leading-tight">{user?.name || 'User'}</p>
                                    <p className="text-[11px] text-gray-400 whitespace-nowrap">{user?.businessName || user?.email || ''}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!collapsed && (
                            <button onClick={handleLogout} title="Sign out"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                    {collapsed && (
                        <button onClick={handleLogout} title="Sign out"
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                            <LogOut size={14} />
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* ── Mobile: Backdrop ────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ── Mobile: Drawer Sidebar ───────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        key="mobile-sidebar"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
                        className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col md:hidden shadow-2xl"
                    >
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-2.5">
                                {user?.logoUrl ? (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/[0.05]">
                                        <img src={user.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/[0.05]">
                                        <img src="/logo.png" alt="VetCare CRM" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <span className="text-[15px] font-bold tracking-tight text-black">
                                    {user?.businessName || 'Grooming CRM'}
                                </span>
                            </div>
                            <HamburgerIcon isOpen={true} onClick={() => setMobileOpen(false)} />
                        </div>

                        {/* Mobile Nav */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                            {navItems.map((item) => (
                                item.type === 'separator' ? (
                                    <NavSeparator key={item.label} collapsed={false} label={item.label} />
                                ) : (
                                    <NavItem key={item.path} item={item} collapsed={false} onClick={() => setMobileOpen(false)} />
                                )
                            ))}
                        </nav>

                        {/* Mobile User */}
                        <div className="shrink-0 p-3 border-t border-gray-100">
                            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ring-2 ring-white shadow-sm shrink-0">
                                    <span className="text-[12px] font-bold text-blue-700">
                                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-black truncate">{user?.name || 'User'}</p>
                                    <p className="text-[11px] text-gray-400 truncate">{user?.businessName || user?.email || ''}</p>
                                </div>
                                <button onClick={handleLogout} title="Sign out"
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
                                    <LogOut size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Main column: Header + Scrollable Content ────────────────── */}
            <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

                {/* ── Sticky Header ────────────────────────────────────────── */}
                <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-20">

                    {/* Left: Hamburger (controls sidebar on all sizes) + Search */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Mobile: toggles drawer; Desktop: toggles collapse */}
                        <div className="md:hidden">
                            <HamburgerIcon isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
                        </div>

                        {/* Global Search */}
                        <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl w-48 md:w-64 lg:w-80 focus-within:border-black focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
                            <Search size={15} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search everything…"
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-black"
                            />
                        </div>
                    </div>

                    {/* Right side: empty — clean header */}
                    <div />
                </header>

                {/* ── Scrollable Page Content ───────────────────────────────── */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-6 w-full max-w-[100rem] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
