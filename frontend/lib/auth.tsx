"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";
import { initMidnightCleanup } from "./midnight-cleanup";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
    id: string;
    name: string;
    email: string;
    avatar_emoji: string;
    isGuest?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (googleToken: string) => Promise<void>;
    guestLogin: () => void;
    logout: () => void;
    updateUser: (user: User) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => {},
    guestLogin: () => {},
    logout: () => {},
    updateUser: () => {},
    loading: true,
});

const GUEST_USER: User = {
    id: "guest",
    name: "Guest",
    email: "guest@habitlens.local",
    avatar_emoji: "👤",
    isGuest: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const isGuest = localStorage.getItem("is_guest");

            if (isGuest === "true") {
                setUser(GUEST_USER);
            } else if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to restore auth state", e);
        }
        setLoading(false);

        initMidnightCleanup(API_URL);
    }, []);

    const login = async (googleToken: string) => {
        const res = await api.googleLogin(googleToken);
        setToken(res.access_token);
        setUser(res.user);
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.removeItem("is_guest");
    };

    const guestLogin = () => {
        setUser(GUEST_USER);
        setToken(null);
        localStorage.setItem("is_guest", "true");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("is_guest");
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);
        if (!newUser.isGuest) {
            localStorage.setItem("user", JSON.stringify(newUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, guestLogin, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
