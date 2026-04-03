"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Habit } from "@/hooks/useHabits";
import HabitFlipCard from "./HabitFlipCard";

const CATEGORY_COLORS: Record<string, string> = {
    productivity: "#ef4444",
    recreation: "#22c55e",
    bonus: "#f59e0b",
    essential: "#3b82f6",
};

const CATEGORY_DOTS: Record<string, string> = {
    productivity: "🎯",
    recreation: "🌿",
    bonus: "⭐",
    essential: "💧",
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
    onUploadPhoto: (habitId: string, taskId: string | undefined, file: File) => Promise<void>;
    onCreateTask?: (habitId: string, taskName: string) => void;
    onDeleteTask?: (taskId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const color = CATEGORY_COLORS[habit.category] || "#6366f1";
    const dot = CATEGORY_DOTS[habit.category] || "●";

    return (
        <motion.div
            layout
            onClick={() => !expanded && setExpanded(true)}
            style={{
                background: "#0f0f0f",
                border: `1px solid ${expanded ? color + "30" : "#1a1a1a"}`,
                borderRadius: 12,
                cursor: expanded ? "default" : "pointer",
                overflow: "hidden",
                transition: "border-color 0.2s",
            }}
            whileHover={!expanded ? { borderColor: color + "40" } : {}}
            whileTap={!expanded ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
            {/* Color strip */}
            <div style={{
                height: 2,
                background: color,
                opacity: expanded ? 1 : 0.5,
                transition: "opacity 0.2s",
            }} />

            <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{dot}</span>
                        <div style={{ minWidth: 0 }}>
                            <p style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#e0e0e0",
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}>
                                {habit.title}
                            </p>
                            <p style={{ fontSize: 11, color: "#444", marginTop: 1 }}>
                                {habit.category} · {habit.credit}pt
                            </p>
                        </div>
                    </div>
                    {habit.tasks.length > 0 && (
                        <span style={{
                            fontSize: 11,
                            color: "#444",
                            flexShrink: 0,
                            marginLeft: 8,
                        }}>
                            {habit.tasks.length} tasks
                        </span>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
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
