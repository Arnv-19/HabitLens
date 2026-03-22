"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Habit } from "@/hooks/useHabits";
import EffortSlider from "@/components/ui/EffortSlider";
import PhotoUploader from "@/components/ui/PhotoUploader";

export default function HabitFlipCard({
    habit,
    color,
    onLog,
    onDelete,
    onUploadPhoto,
    onCreateTask,
    onDeleteTask,
    onCollapse,
}: {
    habit: Habit;
    color: string;
    onLog: (habitId: string, completed: number, effort: number) => void;
    onDelete: (id: string) => void;
    onUploadPhoto: (habitId: string, taskId: string | undefined, file: File) => Promise<void>;
    onCreateTask?: (habitId: string, taskName: string) => void;
    onDeleteTask?: (taskId: string) => void;
    onCollapse: () => void;
}) {
    const [flipped, setFlipped] = useState(false);
    const [effort, setEffort] = useState(50);
    const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
    const [newTaskName, setNewTaskName] = useState("");
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [loggedToday, setLoggedToday] = useState(false);

    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 150], [1, 0.3]);

    // Restore state from localStorage on mount
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const key = `habit_state_${habit.id}_${today}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCheckedTasks(new Set(parsed.checkedTasks || []));
                setEffort(parsed.effort ?? 50);
                setLoggedToday(parsed.loggedToday ?? false);
            } catch {}
        }
    }, [habit.id]);

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const key = `habit_state_${habit.id}_${today}`;
        localStorage.setItem(key, JSON.stringify({
            checkedTasks: Array.from(checkedTasks),
            effort,
            loggedToday,
        }));
    }, [checkedTasks, effort, loggedToday, habit.id]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100) onCollapse();
    };

    const toggleTask = (taskId: string) => {
        setCheckedTasks((prev) => {
            const next = new Set(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.add(taskId);
            return next;
        });
    };

    const handleComplete = () => {
        const completed = habit.tasks.length > 0 ? checkedTasks.size : 1;
        const total = habit.tasks.length > 0 ? habit.tasks.length : 1;
        // clamp
        const safeCompleted = Math.min(completed, total);
        onLog(habit.id, safeCompleted, effort);
        setLoggedToday(true);
        onCollapse();
    };

    const handlePhotoUpload = async (file: File) => {
        setPhotoUploading(true);
        try {
            await onUploadPhoto(habit.id, undefined, file);
            setPhotoUploaded(true);
        } catch (e) {
            console.error("Photo upload failed:", e);
        } finally {
            setPhotoUploading(false);
        }
    };

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 200 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            style={{ y, opacity, touchAction: "none" }}
        >
            <div style={{ padding: "0 16px 16px", perspective: 1000 }}>
                {/* Drag handle */}
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 12px" }}>
                    <div style={{ width: 40, height: 4, borderRadius: 2, background: "#333" }} />
                </div>

                {/* Logged today badge */}
                {loggedToday && (
                    <div style={{
                        background: `${color}20`,
                        border: `1px solid ${color}50`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        marginBottom: 12,
                        fontSize: 12,
                        color: color,
                        fontWeight: 600,
                        textAlign: "center",
                    }}>
                        ✓ Logged today — you can update below
                    </div>
                )}

                {/* Flip container */}
                <div style={{ perspective: 1000 }}>
                    <div
                        className={`flip-card-inner ${flipped ? "flipped" : ""}`}
                        style={{ position: "relative", minHeight: 280 }}
                    >
                        {/* FRONT: Photo + Effort + Complete */}
                        <div
                            className="flip-card-front"
                            style={{
                                position: flipped ? "absolute" : "relative",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            {/* Photo uploader with status */}
                            <div style={{ position: "relative" }}>
                                <PhotoUploader onUpload={handlePhotoUpload} />
                                {photoUploading && (
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(0,0,0,0.6)",
                                        borderRadius: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: 13,
                                    }}>
                                        Uploading...
                                    </div>
                                )}
                                {photoUploaded && !photoUploading && (
                                    <div style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        background: "#2ed573",
                                        borderRadius: 6,
                                        padding: "2px 8px",
                                        color: "#000",
                                        fontSize: 11,
                                        fontWeight: 700,
                                    }}>
                                        ✓ Saved
                                    </div>
                                )}
                            </div>

                            <EffortSlider value={effort} onChange={setEffort} />

                            <div style={{ display: "flex", gap: 8 }}>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleComplete}
                                    style={{
                                        flex: 1,
                                        padding: "12px 0",
                                        borderRadius: 12,
                                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                                        color: "#fff",
                                        border: "none",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    {loggedToday ? "↺ Update Log" : "✓ Complete Habit"}
                                </motion.button>

                                {habit.tasks.length > 0 && (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFlipped(true)}
                                        style={{
                                            padding: "12px 16px",
                                            borderRadius: 12,
                                            background: "#1a1a1a",
                                            color: "#888",
                                            border: "1px solid #222",
                                            cursor: "pointer",
                                            fontSize: 14,
                                        }}
                                    >
                                        📋 {checkedTasks.size}/{habit.tasks.length}
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        {/* BACK: Task Checklist */}
                        <div
                            className="flip-card-back"
                            style={{
                                position: flipped ? "relative" : "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                            }}>
                                <h4 style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>
                                    Tasks ({checkedTasks.size}/{habit.tasks.length})
                                </h4>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setFlipped(false)}
                                    style={{
                                        background: "#1a1a1a",
                                        border: "1px solid #222",
                                        borderRadius: 8,
                                        padding: "6px 12px",
                                        color: "#888",
                                        cursor: "pointer",
                                        fontSize: 12,
                                    }}
                                >
                                    ← Back
                                </motion.button>
                            </div>

                            {habit.tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleTask(task.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        background: checkedTasks.has(task.id) ? `${color}15` : "#0a0a0a",
                                        border: `1px solid ${checkedTasks.has(task.id) ? color + "30" : "#1a1a1a"}`,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <div style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 6,
                                        border: `2px solid ${checkedTasks.has(task.id) ? color : "#333"}`,
                                        background: checkedTasks.has(task.id) ? color : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                        color: "#fff",
                                        transition: "all 0.2s",
                                        flexShrink: 0,
                                    }}>
                                        {checkedTasks.has(task.id) && "✓"}
                                    </div>
                                    <span style={{
                                        fontSize: 14,
                                        flex: 1,
                                        color: checkedTasks.has(task.id) ? "#fff" : "#aaa",
                                        textDecoration: checkedTasks.has(task.id) ? "line-through" : "none",
                                    }}>
                                        {task.task_name}
                                    </span>
                                    {task.time && (
                                        <span style={{ fontSize: 11, color: "#555" }}>{task.time}</span>
                                    )}
                                    {onDeleteTask && habit.category !== "essential" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteTask(task.id);
                                            }}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "#555",
                                                cursor: "pointer",
                                                fontSize: 12,
                                                padding: "4px",
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </motion.div>
                            ))}

                            {habit.tasks.length === 0 && (
                                <p style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 10 }}>
                                    No tasks yet.
                                </p>
                            )}

                            {onCreateTask && !["essential"].includes(habit.category) && (
                                isCreatingTask ? (
                                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                        <input
                                            type="text"
                                            value={newTaskName}
                                            onChange={(e) => setNewTaskName(e.target.value)}
                                            placeholder="Task name"
                                            style={{
                                                flex: 1,
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                background: "#111",
                                                border: "1px solid #222",
                                                color: "#fff",
                                                fontSize: 13,
                                                outline: "none",
                                            }}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && newTaskName.trim()) {
                                                    onCreateTask(habit.id, newTaskName.trim());
                                                    setNewTaskName("");
                                                    setIsCreatingTask(false);
                                                }
                                                if (e.key === "Escape") setIsCreatingTask(false);
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                if (newTaskName.trim()) {
                                                    onCreateTask(habit.id, newTaskName.trim());
                                                    setNewTaskName("");
                                                }
                                                setIsCreatingTask(false);
                                            }}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                background: color,
                                                color: "#fff",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => setIsCreatingTask(false)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                background: "#111",
                                                color: "#888",
                                                border: "1px solid #222",
                                                cursor: "pointer",
                                                fontSize: 13,
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsCreatingTask(true)}
                                        style={{
                                            padding: "8px",
                                            borderRadius: 8,
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px dashed #333",
                                            color: "#888",
                                            fontSize: 13,
                                            cursor: "pointer",
                                            marginTop: 8,
                                        }}
                                    >
                                        + Add Task
                                    </button>
                                )
                            )}

                            {/* Log from task view too */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setFlipped(false); handleComplete(); }}
                                style={{
                                    marginTop: 8,
                                    padding: "12px 0",
                                    borderRadius: 12,
                                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                                    color: "#fff",
                                    border: "none",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: "pointer",
                                }}
                            >
                                {loggedToday ? "↺ Update Log" : "✓ Log Progress"}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Delete button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (confirm("Delete this habit?")) onDelete(habit.id);
                    }}
                    style={{
                        width: "100%",
                        marginTop: 12,
                        padding: "8px 0",
                        borderRadius: 10,
                        background: "transparent",
                        border: "1px solid #1a1a1a",
                        color: "#555",
                        fontSize: 12,
                        cursor: "pointer",
                    }}
                >
                    Delete Habit
                </motion.button>
            </div>
        </motion.div>
    );
}
