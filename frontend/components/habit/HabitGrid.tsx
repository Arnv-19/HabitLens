"use client";
import { motion } from "framer-motion";
import { Habit } from "@/hooks/useHabits";
import HabitCard from "./HabitCard";

export default function HabitGrid({
    habits,
    onLog,
    onDelete,
    onUploadPhoto,
}: {
    habits: Habit[];
    onLog: (habitId: string, completed: number, effort: number) => void;
    onDelete: (id: string) => void;
    onUploadPhoto: (habitId: string, file: File) => void;
}) {
    if (habits.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#555",
                }}
            >
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: "#888" }}>
                    No habits yet
                </p>
                <p style={{ fontSize: 13, marginTop: 8, color: "#555" }}>
                    Tap the + button to create your first habit
                </p>
            </motion.div>
        );
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
        }}>
            {habits.map((habit, i) => (
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
                    />
                </motion.div>
            ))}
        </div>
    );
}
