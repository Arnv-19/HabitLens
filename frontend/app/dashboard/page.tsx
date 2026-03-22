"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useHabits } from "@/hooks/useHabits";
import { useDashboard } from "@/hooks/useDashboard";
import { api } from "@/lib/api";
import BottomNav from "@/components/ui/BottomNav";
import CatWidget from "@/components/ui/CatWidget";
import HabitGrid from "@/components/habit/HabitGrid";
import HabitCreateModal from "@/components/habit/HabitCreateModal";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { habits, fetchHabits, createHabit, deleteHabit, logHabit, createTask, deleteTask } = useHabits();
    const { dashboard, fetchDashboard } = useDashboard();
    const [modalOpen, setModalOpen] = useState(false);
    const [reflection, setReflection] = useState("");

    useEffect(() => {
        if (!authLoading && !user) router.push("/");
    }, [user, authLoading, router]);

    useEffect(() => {
        api.getReflection().then((r) => setReflection(r.reflection)).catch(() => {});
    }, []);

    // Upload photo: habitId, optional taskId, file
    const handleUploadPhoto = async (habitId: string, taskId: string | undefined, file: File) => {
        try {
            await api.uploadPhoto(habitId, file, taskId);
        } catch (e) {
            console.error("Photo upload failed:", e);
            throw e; // re-throw so the card can show error state
        }
    };

    const handleLog = async (habitId: string, completed: number, effort: number) => {
        await logHabit(habitId, completed, effort);
        // Refresh both habits and dashboard stats
        await Promise.all([fetchHabits(), fetchDashboard()]);
        // Refresh reflection too
        api.getReflection().then((r) => setReflection(r.reflection)).catch(() => {});
    };

    if (authLoading || !user) return null;

    return (
        <div className="page-transition" style={{ padding: "20px 16px 100px" }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
            }}>
                <div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
                        Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
                    </h1>
                    <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
                        {new Date().toLocaleDateString("en", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
                <div style={{
                    fontSize: 36,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "50%",
                    width: 52,
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {user.avatar_emoji || "😊"}
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 24,
            }}>
                {[
                    { label: "Effort Index", value: `${dashboard?.effort_index?.toFixed(0) || 0}%`, icon: "🔥" },
                    { label: "Daily Score", value: dashboard?.daily_score?.toFixed(1) || "0", icon: "📊" },
                    { label: "Streak", value: `${dashboard?.streak || 0} days`, icon: "⚡" },
                    { label: "Total Habits", value: dashboard?.total_habits || 0, icon: "📌" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card"
                        style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>{stat.label}</span>
                            <span style={{ fontSize: 16 }}>{stat.icon}</span>
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* AI Reflection */}
            {reflection && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: 16, marginBottom: 24 }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16 }}>🤖</span>
                        <span style={{ fontSize: 12, color: "#667eea", fontWeight: 600 }}>Daily Reflection</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.6, fontStyle: "italic" }}>
                        "{reflection}"
                    </p>
                </motion.div>
            )}

            {/* Section Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>My Habits</h2>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setModalOpen(true)}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        border: "none",
                        color: "#fff",
                        fontSize: 20,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
                    }}
                >
                    +
                </motion.button>
            </div>

            {/* Habit Grid */}
            <HabitGrid
                habits={habits}
                onLog={handleLog}
                onDelete={deleteHabit}
                onUploadPhoto={handleUploadPhoto}
                onCreateTask={createTask}
                onDeleteTask={deleteTask}
            />

            {/* Create Modal */}
            <HabitCreateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={async (data) => {
                    await createHabit(data);
                    await fetchDashboard();
                }}
            />

            <CatWidget />
            <BottomNav />
        </div>
    );
}
