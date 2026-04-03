"use client";
import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
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
    const [tab, setTab] = useState<"log" | "tasks">("log");
    const [effort, setEffort] = useState(50);
    const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
    const [newTaskName, setNewTaskName] = useState("");
    const [addingTask, setAddingTask] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [loggedToday, setLoggedToday] = useState(false);

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
        if (info.offset.y > 80) onCollapse();
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
        onLog(habit.id, Math.min(completed, total), effort);
        setLoggedToday(true);
        onCollapse();
    };

    const handlePhotoUpload = async (file: File) => {
        setPhotoUploading(true);
        try {
            await onUploadPhoto(habit.id, undefined, file);
            setPhotoUploaded(true);
        } catch {}
        finally { setPhotoUploading(false); }
    };

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 150 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ touchAction: "none" }}
        >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
                <div style={{ width: 32, height: 3, borderRadius: 2, background: "#2a2a2a" }} />
            </div>

            <div style={{ padding: "0 14px 14px" }}>
                {/* Already logged badge */}
                {loggedToday && (
                    <div style={{
                        fontSize: 12,
                        color: color,
                        background: color + "12",
                        border: `1px solid ${color}25`,
                        borderRadius: 8,
                        padding: "5px 10px",
                        marginBottom: 12,
                        textAlign: "center",
                    }}>
                        ✓ logged today — tap to update
                    </div>
                )}

                {/* Tabs */}
                {habit.tasks.length > 0 && (
                    <div style={{
                        display: "flex",
                        gap: 4,
                        marginBottom: 14,
                        background: "#080808",
                        borderRadius: 8,
                        padding: 3,
                    }}>
                        {(["log", "tasks"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    flex: 1,
                                    padding: "6px 0",
                                    borderRadius: 6,
                                    background: tab === t ? "#1a1a1a" : "transparent",
                                    border: "none",
                                    color: tab === t ? "#ccc" : "#444",
                                    fontSize: 12,
                                    fontWeight: tab === t ? 500 : 400,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                {t === "tasks"
                                    ? `tasks (${checkedTasks.size}/${habit.tasks.length})`
                                    : "log effort"
                                }
                            </button>
                        ))}
                    </div>
                )}

                {/* Log tab */}
                {tab === "log" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ position: "relative" }}>
                            <PhotoUploader onUpload={handlePhotoUpload} />
                            {photoUploading && (
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "rgba(0,0,0,0.6)",
                                    borderRadius: 10,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, color: "#888",
                                }}>
                                    uploading...
                                </div>
                            )}
                            {photoUploaded && !photoUploading && (
                                <div style={{
                                    position: "absolute", top: 8, right: 8,
                                    background: "#22c55e",
                                    borderRadius: 6, padding: "2px 8px",
                                    color: "#000", fontSize: 11, fontWeight: 600,
                                }}>
                                    ✓ saved
                                </div>
                            )}
                        </div>
                        <EffortSlider value={effort} onChange={setEffort} />
                        <button
                            onClick={handleComplete}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                borderRadius: 10,
                                background: color,
                                color: "#fff",
                                border: "none",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                opacity: 0.9,
                            }}
                        >
                            {loggedToday ? "Update log" : "Mark complete"}
                        </button>
                    </div>
                )}

                {/* Tasks tab */}
                {tab === "tasks" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {habit.tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "9px 12px",
                                    borderRadius: 8,
                                    background: checkedTasks.has(task.id) ? color + "10" : "#080808",
                                    border: `1px solid ${checkedTasks.has(task.id) ? color + "25" : "#1a1a1a"}`,
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                }}
                            >
                                <div style={{
                                    width: 16, height: 16, borderRadius: 4,
                                    border: `1.5px solid ${checkedTasks.has(task.id) ? color : "#2a2a2a"}`,
                                    background: checkedTasks.has(task.id) ? color : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, color: "#fff", flexShrink: 0,
                                    transition: "all 0.15s",
                                }}>
                                    {checkedTasks.has(task.id) && "✓"}
                                </div>
                                <span style={{
                                    fontSize: 13, flex: 1, color: checkedTasks.has(task.id) ? "#888" : "#ccc",
                                    textDecoration: checkedTasks.has(task.id) ? "line-through" : "none",
                                }}>
                                    {task.task_name}
                                </span>
                                {task.time && (
                                    <span style={{ fontSize: 11, color: "#3a3a3a" }}>{task.time}</span>
                                )}
                                {onDeleteTask && habit.category !== "essential" && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                        style={{
                                            background: "transparent", border: "none",
                                            color: "#2a2a2a", cursor: "pointer", fontSize: 13, padding: "2px 4px",
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}

                        {onCreateTask && habit.category !== "essential" && (
                            addingTask ? (
                                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                                    <input
                                        type="text"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                        placeholder="Task name..."
                                        autoFocus
                                        style={{
                                            flex: 1, padding: "7px 10px",
                                            borderRadius: 8, background: "#080808",
                                            border: "1px solid #2a2a2a",
                                            color: "#ccc", fontSize: 13, outline: "none",
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && newTaskName.trim()) {
                                                onCreateTask(habit.id, newTaskName.trim());
                                                setNewTaskName("");
                                                setAddingTask(false);
                                            }
                                            if (e.key === "Escape") setAddingTask(false);
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (newTaskName.trim()) {
                                                onCreateTask(habit.id, newTaskName.trim());
                                                setNewTaskName("");
                                            }
                                            setAddingTask(false);
                                        }}
                                        style={{
                                            padding: "7px 12px", borderRadius: 8,
                                            background: color, color: "#fff",
                                            border: "none", cursor: "pointer", fontSize: 13,
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingTask(true)}
                                    style={{
                                        padding: "7px", borderRadius: 8,
                                        background: "transparent",
                                        border: "1px dashed #222",
                                        color: "#444", fontSize: 12, cursor: "pointer", marginTop: 4,
                                    }}
                                >
                                    + add task
                                </button>
                            )
                        )}

                        <button
                            onClick={handleComplete}
                            style={{
                                marginTop: 8, width: "100%",
                                padding: "11px 0", borderRadius: 10,
                                background: color, color: "#fff",
                                border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer",
                            }}
                        >
                            {loggedToday ? "Update log" : "Log progress"}
                        </button>
                    </div>
                )}

                {/* Delete */}
                <button
                    onClick={() => { if (confirm("Delete this habit?")) onDelete(habit.id); }}
                    style={{
                        width: "100%", marginTop: 10,
                        padding: "7px 0", borderRadius: 8,
                        background: "transparent", border: "none",
                        color: "#2a2a2a", fontSize: 12, cursor: "pointer",
                    }}
                >
                    delete habit
                </button>
            </div>
        </motion.div>
    );
}