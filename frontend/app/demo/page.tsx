"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import CatWidget from "@/components/ui/CatWidget";
import HabitGrid from "@/components/habit/HabitGrid";
import HabitCreateModal from "@/components/habit/HabitCreateModal";
import type { Habit } from "@/hooks/useHabits";

// Demo data to preview the UI
const DEMO_HABITS: Habit[] = [
    {
        id: "1", user_id: "demo", title: "Study", category: "productivity", credit: 3, is_fixed: true, created_at: "",
        tasks: [
            { id: "1a", habit_id: "1", task_name: "Read Chapter 5", time: null },
            { id: "1b", habit_id: "1", task_name: "Solve Problems", time: null },
            { id: "1c", habit_id: "1", task_name: "Review Notes", time: null },
        ],
    },
    {
        id: "2", user_id: "demo", title: "Gym Workout", category: "recreation", credit: 2, is_fixed: false, created_at: "",
        tasks: [
            { id: "2a", habit_id: "2", task_name: "Warm Up", time: "07:00" },
            { id: "2b", habit_id: "2", task_name: "Workout", time: "07:15" },
            { id: "2c", habit_id: "2", task_name: "Cool Down", time: "08:00" },
        ],
    },
    {
        id: "3", user_id: "demo", title: "Drink Water", category: "essential", credit: 1, is_fixed: true, created_at: "",
        tasks: [
            { id: "3a", habit_id: "3", task_name: "Morning", time: "08:00" },
            { id: "3b", habit_id: "3", task_name: "Afternoon", time: "13:00" },
            { id: "3c", habit_id: "3", task_name: "Evening", time: "18:00" },
            { id: "3d", habit_id: "3", task_name: "Night", time: "21:00" },
        ],
    },
    {
        id: "4", user_id: "demo", title: "Sunrise Photo", category: "bonus", credit: 2, is_fixed: false, created_at: "",
        tasks: [
            { id: "4a", habit_id: "4", task_name: "Capture Sunrise", time: "06:00" },
        ],
    },
    {
        id: "5", user_id: "demo", title: "Coding Practice", category: "productivity", credit: 3, is_fixed: true, created_at: "",
        tasks: [
            { id: "5a", habit_id: "5", task_name: "LeetCode", time: null },
            { id: "5b", habit_id: "5", task_name: "Project Work", time: null },
        ],
    },
    {
        id: "6", user_id: "demo", title: "Meditation", category: "recreation", credit: 1, is_fixed: false, created_at: "",
        tasks: [
            { id: "6a", habit_id: "6", task_name: "10 min session", time: "06:30" },
        ],
    },
];

export default function DemoPage() {
    const [habits, setHabits] = useState<Habit[]>(DEMO_HABITS);
    const [modalOpen, setModalOpen] = useState(false);

    const handleLog = (habitId: string, completed: number, effort: number) => {
        console.log("Logged:", { habitId, completed, effort });
    };

    const handleDelete = (id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const handleCreate = (data: any) => {
        const newHabit: Habit = {
            id: String(Date.now()),
            user_id: "demo",
            title: data.title,
            category: data.category,
            credit: data.credit || 1,
            is_fixed: false,
            created_at: "",
            tasks: [],
        };
        setHabits((prev) => [...prev, newHabit]);
    };

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
                        Welcome back, Arnav 👋
                    </h1>
                    <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
                        {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
                <div style={{
                    fontSize: 36, background: "rgba(255,255,255,0.05)",
                    borderRadius: "50%", width: 52, height: 52,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    🧠
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                    { label: "Effort Index", value: "78%", icon: "🔥" },
                    { label: "Daily Score", value: "8.4", icon: "📊" },
                    { label: "Streak", value: "5 days", icon: "⚡" },
                    { label: "Total Habits", value: 6, icon: "📌" },
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
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: 16, marginBottom: 24 }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <span style={{ fontSize: 12, color: "#667eea", fontWeight: 600 }}>AI Reflection</span>
                </div>
                <p style={{ fontSize: 14, color: "#bbb", lineHeight: 1.6, fontStyle: "italic" }}>
                    "You showed strong academic focus today with consistent study sessions. Keep this momentum going! 💪"
                </p>
            </motion.div>

            {/* Section Header */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>My Habits</h2>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setModalOpen(true)}
                    style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        border: "none", color: "#fff", fontSize: 20, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
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
                onDelete={handleDelete}
                onUploadPhoto={async (habitId, taskId, file) => { }}
            />

            <HabitCreateModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
            <CatWidget />
            <BottomNav />
        </div>
    );
}
