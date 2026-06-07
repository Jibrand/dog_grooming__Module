import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://veterinary-clinics-futureframe-back.vercel.app' : 'http://localhost:3000');
const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
    const [loading, setLoading] = useState(false);

    /* ── Persist on change ─────────────────────────────────────────────────── */
    useEffect(() => {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
        else localStorage.removeItem(USER_KEY);
    }, [user]);

    /* ── Auth header helper ────────────────────────────────────────────────── */
    const authHeader = useCallback(() => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }), [token]);

    /* ── Register ──────────────────────────────────────────────────────────── */
    const register = async (data) => {
        setLoading(true);
        const res = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        setLoading(false);
        if (!res.ok) throw new Error(json.message || 'Registration failed');
        setToken(json.token);
        setUser(json.user);
        return json;
    };

    /* ── Login ─────────────────────────────────────────────────────────────── */
    const login = async ({ email, password }) => {
        setLoading(true);
        const res = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        setLoading(false);
        if (!res.ok) throw new Error(json.message || 'Login failed');
        setToken(json.token);
        setUser(json.user);
        return json;
    };

    /* ── Logout ────────────────────────────────────────────────────────────── */
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    /* ── API helper (auto-attach token + handle 401) ───────────────────────── */
    const apiFetch = useCallback(async (path, options = {}) => {
        const headers = { ...authHeader(), ...options.headers };

        // If body is FormData, DON'T set Content-Type (browser must set it with boundary)
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const res = await fetch(`${API}${path}`, {
            ...options,
            headers,
        });
        if (res.status === 401) { logout(); throw new Error('Session expired'); }
        return res;
    }, [authHeader, logout]);

    /* ── Refresh User Profile ────────────────────────────────────────────── */
    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const res = await apiFetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setUser(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    }, [token, apiFetch]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, register, logout, apiFetch, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
};
