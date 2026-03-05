"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Habit } from "@/hooks/useHabits";
import HabitFlipCard from "./HabitFlipCard";

const CATEGORY_COLORS: Record<string, string> = {
    productivity: "#ff4757",
    recreation: "#2ed573",
    bonus: "#ffa502",
    essential: "#3742fa",
};

const CATEGORY_ICONS: Record<string, string> = {
    productivity: "🎯",
    recreation: "🌿",
    bonus: "⭐",
    essential: "💎",
};

export default function HabitCard({
    habit,
    onLog,
    onDelete,
    onUploadPhoto,
    onCreateTask,
    onDeleteTask,
}: {
    habit: Habit;
    onLog: (habitId: string, completed: number, effort: number) => void;
    onDelete: (id: string) => void;
    onUploadPhoto: (habitId: string, file: File) => void;
    onCreateTask?: (habitId: string, taskName: string) => void;
    onDeleteTask?: (taskId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const color = CATEGORY_COLORS[habit.category] || "#667eea";
    const icon = CATEGORY_ICONS[habit.category] || "📌";

    return (
        <motion.div
            layout
            onClick={() => !expanded && setExpanded(true)}
            style={{
                background: expanded
                    ? `linear-gradient(145deg, ${color}10, #111)`
                    : "#111",
                border: `1px solid ${expanded ? color + "40" : "#1a1a1a"}`,
                borderRadius: 16,
                cursor: expanded ? "default" : "pointer",
                overflow: "hidden",
                position: "relative",
            }}
            whileHover={!expanded ? { scale: 1.03, borderColor: color + "60" } : {}}
            whileTap={!expanded ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {/* Top color accent bar */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: "16px 16px 0 0",
            }} />

            {/* Collapsed tile */}
            <div style={{ padding: 16 }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{icon}</span>
                        <div>
                            <h3 style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#fff",
                                margin: 0,
                            }}>
                                {habit.title}
                            </h3>
                            <span style={{
                                fontSize: 11,
                                color: color,
                                fontWeight: 500,
                                textTransform: "capitalize",
                            }}>
                                {habit.category} • {habit.credit}cr
                            </span>
                        </div>
                    </div>
                    <div style={{
                        background: color + "20",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 12,
                        color: color,
                        fontWeight: 600,
                    }}>
                        {habit.tasks.length} tasks
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                        <HabitFlipCard
                            habit={habit}
                            color={color}
                            onLog={onLog}
                            onDelete={onDelete}
                            onUploadPhoto={onUploadPhoto}
                            onCreateTask={onCreateTask}
                            onDeleteTask={onDeleteTask}
                            onCollapse={() => setExpanded(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
