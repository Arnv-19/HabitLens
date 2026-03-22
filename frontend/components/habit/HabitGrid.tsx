"use client";
import { motion } from "framer-motion";
import { Habit } from "@/hooks/useHabits";
import HabitCard from "./HabitCard";

export default function HabitGrid({
    habits,
    onLog,
    onDelete,
    onUploadPhoto,
    onCreateTask,
    onDeleteTask,
}: {
    habits: Habit[];
    onLog: (habitId: string, completed: number, effort: number) => void;
    onDelete: (id: string) => void;
    onUploadPhoto: (habitId: string, taskId: string | undefined, file: File) => Promise<void>;
    onCreateTask?: (habitId: string, taskName: string) => void;
    onDeleteTask?: (taskId: string) => void;
}) {
    if (habits.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}
            >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#888" }}>No habits yet</p>
                <p style={{ fontSize: 13, marginTop: 8, color: "#555" }}>
                    Tap the + button to create your first habit
                </p>
            </motion.div>
        );
    }

    const sortedHabits = [...habits].sort((a, b) => {
        if (a.is_fixed !== b.is_fixed) return a.is_fixed ? -1 : 1;
        return a.category.localeCompare(b.category);
    });

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
        }}>
            {sortedHabits.map((habit, i) => (
                <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                    <HabitCard
                        habit={habit}
                        onLog={onLog}
                        onDelete={onDelete}
                        onUploadPhoto={onUploadPhoto}
                        onCreateTask={onCreateTask}
                        onDeleteTask={onDeleteTask}
                    />
                </motion.div>
            ))}
        </div>
    );
}
