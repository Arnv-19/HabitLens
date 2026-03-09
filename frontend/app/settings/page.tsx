"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import AvatarPicker from "@/components/ui/AvatarPicker";
import { api } from "@/lib/api";

export default function SettingsPage() {
    const { user, updateUser, logout, loading } = useAuth();
    const router = useRouter();
    const [avatar, setAvatar] = useState(user?.avatar_emoji || "😊");
    const [collageImage, setCollageImage] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    const handleAvatarChange = async (newEmoji: string) => {
        try {
            const updatedUser = await api.updateAvatar(newEmoji);
            setAvatar(newEmoji);
            updateUser(updatedUser);
        } catch (e) {
            console.error("Failed to update avatar", e);
            alert("Failed to save avatar.");
        }
    };

    if (loading || !user) return null;

    const handleGenerateCollage = async () => {
        try {
            const result = await api.generateCollage();
            if (result.collage_image) {
                setCollageImage(result.collage_image);
            }
            alert(result.message);
        } catch (e: any) {
            alert("Failed: " + e.message);
        }
    };

    return (
        <div className="page-transition" style={{ padding: "20px 16px 100px" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px" }}>
                ⚙️ Settings
            </h1>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    padding: 24,
                    marginBottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <AvatarPicker value={avatar} onChange={handleAvatarChange} />
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</h2>
                    <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{user.email}</p>
                </div>
            </motion.div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGenerateCollage}
                    style={{
                        padding: "16px 20px",
                        borderRadius: 14,
                        background: "#111",
                        border: "1px solid #1a1a1a",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                    }}
                >
                    <span style={{ fontSize: 20 }}>📸</span>
                    Generate Daily Collage
                </motion.button>

                {collageImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            marginTop: 12,
                            padding: 16,
                            borderRadius: 14,
                            background: "#111",
                            border: "1px solid #1a1a1a",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600, color: "#fff" }}>
                            Today's Collage
                        </h3>
                        <img
                            src={collageImage}
                            alt="Daily Collage"
                            style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
                        />
                    </motion.div>
                )}

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    style={{
                        padding: "16px 20px",
                        borderRadius: 14,
                        background: "#111",
                        border: "1px solid #1a1a1a",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                    }}
                >
                    <span style={{ fontSize: 20 }}>🔔</span>
                    Notification Preferences
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    style={{
                        padding: "16px 20px",
                        borderRadius: 14,
                        background: "#111",
                        border: "1px solid #1a1a1a",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                    }}
                >
                    <span style={{ fontSize: 20 }}>📊</span>
                    Export Data
                </motion.button>

                <div style={{ height: 16 }} />

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        logout();
                        router.push("/");
                    }}
                    style={{
                        padding: "16px 20px",
                        borderRadius: 14,
                        background: "rgba(255, 71, 87, 0.08)",
                        border: "1px solid rgba(255, 71, 87, 0.2)",
                        color: "#ff4757",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                    }}
                >
                    <span style={{ fontSize: 20 }}>🚪</span>
                    Sign Out
                </motion.button>
            </div>

            {/* App Info */}
            <div style={{
                textAlign: "center",
                marginTop: 40,
                color: "#333",
                fontSize: 12,
            }}>
                <p>HabitLens v1.0.0</p>
                <p style={{ marginTop: 4 }}>Built with ❤️ for better habits</p>
            </div>

            <BottomNav />
        </div>
    );
}
