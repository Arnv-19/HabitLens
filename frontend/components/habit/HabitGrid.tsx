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
                style={{
                    textAlign: "center",
                    padding: "48px 20px",
                    color: "#3a3a3a",
                }}
            >
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>○</div>
                <p style={{ fontSize: 15, color: "#444", marginBottom: 6 }}>No habits yet</p>
                <p style={{ fontSize: 13, color: "#333" }}>
                    Hit + to add your first one
                </p>
            </motion.div>
        );
    }

    const sortedHabits = [...habits].sort((a, b) => {
        const order = { essential: 0, productivity: 1, recreation: 2, bonus: 3 };
        const ao = order[a.category as keyof typeof order] ?? 4;
        const bo = order[b.category as keyof typeof order] ?? 4;
        return ao - bo;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sortedHabits.map((habit, i) => (
                <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
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
