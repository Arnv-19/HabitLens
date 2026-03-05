"use client";
import { useAuth } from "@/lib/auth";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import WeeklyBarChart from "@/components/stats/WeeklyBarChart";
import MonthlyHeatmap from "@/components/stats/MonthlyHeatmap";

export default function StatsPage() {
    const { user, loading } = useAuth();
    const { dashboard, weekly, monthly } = useDashboard();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    if (loading || !user) return null;

    const weeklyAvg =
        weekly.length > 0
            ? weekly.reduce((sum, d) => sum + d.effort_index, 0) / weekly.length
            : 0;

    return (
        <div className="page-transition" style={{ padding: "20px 16px 100px" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px" }}>
                📈 Statistics
            </h1>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    padding: 20,
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <div style={{
                    fontSize: 40,
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {user.avatar_emoji || "😊"}
                </div>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</h2>
                    <p style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{user.email}</p>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                        <span style={{ fontSize: 12, color: "#888" }}>
                            📌 {dashboard?.total_habits || 0} habits
                        </span>
                        <span style={{ fontSize: 12, color: "#888" }}>
                            ⚡ {dashboard?.streak || 0} day streak
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 24,
            }}>
                {[
                    { label: "Effort Index", value: `${dashboard?.effort_index?.toFixed(0) || 0}%` },
                    { label: "Weekly Avg", value: `${weeklyAvg.toFixed(0)}%` },
                    { label: "Completed", value: dashboard?.total_habits || 0 },
                ].map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="glass-card"
                        style={{ padding: "14px 12px", textAlign: "center" }}
                    >
                        <p style={{ fontSize: 10, color: "#666", fontWeight: 500, marginBottom: 4 }}>
                            {m.label}
                        </p>
                        <p style={{ fontSize: 20, fontWeight: 800 }}>{m.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Weekly Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card"
                style={{ padding: 20, marginBottom: 20 }}
            >
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Weekly Performance</h3>
                <p style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>
                    Effort index for the last 7 days
                </p>
                <WeeklyBarChart data={weekly} />
            </motion.div>

            {/* Monthly Heatmap */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card"
                style={{ padding: 20 }}
            >
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Activity</h3>
                <p style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
                    {new Date().toLocaleDateString("en", { month: "long", year: "numeric" })}
                </p>
                <MonthlyHeatmap data={monthly} />
            </motion.div>

            <BottomNav />
        </div>
    );
}
