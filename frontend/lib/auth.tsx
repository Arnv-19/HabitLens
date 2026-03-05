"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "./api";

interface User {
    id: string;
    name: string;
    email: string;
    avatar_emoji: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (googleToken: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    logout: () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (googleToken: string) => {
        const res = await api.googleLogin(googleToken);
        setToken(res.access_token);
        setUser(res.user);
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
