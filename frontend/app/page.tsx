"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

declare global {
    interface Window {
        google?: any;
    }
}

export default function LoginPage() {
    const { user, login, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        if (loading || user) return;

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            window.google?.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: async (response: any) => {
                    try {
                        await login(response.credential);
                        router.push("/dashboard");
                    } catch (e) {
                        console.error("Login failed:", e);
                    }
                },
            });
            window.google?.accounts.id.renderButton(
                document.getElementById("google-btn"),
                { theme: "filled_black", size: "large", shape: "pill", width: 300 }
            );
        };
        document.body.appendChild(script);
    }, [loading, user, login, router]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="pulse-glow" style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                }} />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "radial-gradient(ellipse at top, #0a0a2e 0%, #000 60%)",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ textAlign: "center" }}
            >
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: 72, marginBottom: 16 }}
                >
                    🔍
                </motion.div>

                <h1 style={{
                    fontSize: 42,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 8,
                    letterSpacing: "-1px",
                }}>
                    HabitLens
                </h1>

                <p style={{
                    color: "#888",
                    fontSize: 16,
                    marginBottom: 48,
                    maxWidth: 360,
                    lineHeight: 1.6,
                }}>
                    Track habits, build streaks, capture your journey in beautiful photo collages.
                </p>

                <div id="google-btn" style={{ display: "flex", justifyContent: "center" }} />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    style={{
                        marginTop: 48,
                        display: "flex",
                        gap: 32,
                        justifyContent: "center",
                        color: "#555",
                        fontSize: 13,
                    }}
                >
                    {["📊 Analytics", "📸 Collages", "🤖 AI Reflections"].map((t) => (
                        <span key={t}>{t}</span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
