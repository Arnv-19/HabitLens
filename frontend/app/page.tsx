"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

declare global {
    interface Window {
        google?: any;
    }
}

export default function LoginPage() {
    const { user, login, guestLogin, loading } = useAuth();
    const router = useRouter();
    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState("");

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
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;
            window.google?.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: async (response: any) => {
                    setSigningIn(true);
                    setError("");
                    try {
                        await login(response.credential);
                        router.push("/dashboard");
                    } catch (e) {
                        console.error("Login failed:", e);
                        setError("Sign-in failed. Try again or use guest access.");
                    } finally {
                        setSigningIn(false);
                    }
                },
            });
            window.google?.accounts.id.renderButton(
                document.getElementById("google-btn"),
                { theme: "filled_black", size: "large", shape: "pill", width: 280 }
            );
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [loading, user, login, router]);

    const handleGuestAccess = () => {
        guestLogin();
        router.push("/dashboard");
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#000"
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "2px solid #333",
                    borderTopColor: "#667eea",
                    animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
            padding: "24px 20px",
            background: "#000",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* subtle background grain */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(102,126,234,0.12) 0%, transparent 60%)",
                pointerEvents: "none",
            }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo mark */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    style={{ marginBottom: 28 }}
                >
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 18,
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 30,
                        boxShadow: "0 8px 32px rgba(102,126,234,0.3)",
                    }}>
                        🔍
                    </div>
                </motion.div>

                {/* Wordmark */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ textAlign: "center", marginBottom: 40 }}
                >
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: "-1.5px",
                        lineHeight: 1,
                        marginBottom: 10,
                    }}>
                        HabitLens
                    </h1>
                    <p style={{
                        color: "#666",
                        fontSize: 15,
                        lineHeight: 1.5,
                        maxWidth: 280,
                        margin: "0 auto",
                    }}>
                        Track habits, build streaks, and see your day unfold.
                    </p>
                </motion.div>

                {/* Sign-in card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                        width: "100%",
                        background: "#111",
                        border: "1px solid #1e1e1e",
                        borderRadius: 20,
                        padding: "32px 28px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <p style={{
                        fontSize: 13,
                        color: "#555",
                        marginBottom: 4,
                        letterSpacing: "0.3px",
                    }}>
                        sign in to continue
                    </p>

                    {/* Google button container */}
                    {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                        <div
                            id="google-btn"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                minHeight: 44,
                                width: "100%",
                            }}
                        />
                    ) : (
                        <div style={{
                            padding: "10px 16px",
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: 10,
                            fontSize: 13,
                            color: "#555",
                            textAlign: "center",
                            width: "100%",
                        }}>
                            Google sign-in not configured
                        </div>
                    )}

                    {error && (
                        <p style={{ fontSize: 13, color: "#ff4757", textAlign: "center" }}>
                            {error}
                        </p>
                    )}

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        width: "100%",
                        color: "#333",
                        fontSize: 12,
                    }}>
                        <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
                        <span>or</span>
                        <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
                    </div>

                    {/* Guest access */}
                    <motion.button
                        whileHover={{ background: "#1a1a1a" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGuestAccess}
                        style={{
                            width: "100%",
                            padding: "13px 20px",
                            borderRadius: 12,
                            background: "#0d0d0d",
                            border: "1px solid #222",
                            color: "#aaa",
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background 0.2s",
                        }}
                    >
                        <span style={{ fontSize: 16 }}>👤</span>
                        Continue as guest
                    </motion.button>

                    <p style={{
                        fontSize: 11,
                        color: "#3a3a3a",
                        textAlign: "center",
                        lineHeight: 1.5,
                    }}>
                        Guest data is stored locally and won't sync across devices
                    </p>
                </motion.div>

                {/* Feature hints */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                        marginTop: 32,
                        display: "flex",
                        gap: 20,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    {["📊 Analytics", "📸 Collages", "🔥 Streaks"].map((item) => (
                        <span key={item} style={{ fontSize: 12, color: "#444" }}>{item}</span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
