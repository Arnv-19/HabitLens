"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREDEFINED_HABITS: Record<string, string[]> = {
    productivity: [
        "Study", "Assignment Work", "Research Reading", "Lecture Review",
        "Practice Problems", "Exam Prep", "Project Work", "Write Notes",
        "Flashcard Review", "Coding Practice", "Algorithm Practice",
        "Technical Reading", "Language Learning", "Solve Past Papers",
        "Debug Code", "Watch Lecture", "Academic Revision",
    ],
    recreation: [
        "Gym Workout", "Running", "Yoga", "Meditation", "Read Book",
        "Music Practice", "Drawing", "Photography", "Play Sports",
        "Cooking", "Creative Writing", "Dance Practice",
        "Podcast Listening", "Gardening", "Walk Outside",
    ],
    essential: [
        "Brush Teeth", "Drink Water", "Eat Breakfast", "Eat Lunch",
        "Eat Dinner", "Sleep Early", "Take Vitamins", "Shower",
        "Morning Routine", "Evening Routine", "Stretch", "Make Bed",
        "Organize Desk", "Hydrate",
    ],
    bonus: [
        "Sunrise Photo", "Sunset Photo", "Capture Sky", "Nature Photo",
        "Write Reflection", "Gratitude Note", "Try Something New",
        "Street Photo", "Night Sky Photo", "Observe Nature",
    ],
};

const CATEGORY_COLORS: Record<string, string> = {
    productivity: "#ef4444",
    recreation: "#22c55e",
    bonus: "#f59e0b",
    essential: "#3b82f6",
};

const CATEGORY_LABELS: Record<string, string> = {
    productivity: "Work",
    recreation: "Play",
    bonus: "Bonus",
    essential: "Daily",
};

export default function HabitCreateModal({
    open,
    onClose,
    onCreate,
}: {
    open: boolean;
    onClose: () => void;
    onCreate: (data: { title: string; category: string; credit: number; tasks?: string[] }) => void;
}) {
    const [category, setCategory] = useState("productivity");
    const [title, setTitle] = useState("");
    const [credit, setCredit] = useState(1);
    const [search, setSearch] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [tasks, setTasks] = useState<string[]>([]);

    const filtered = PREDEFINED_HABITS[category]?.filter((h) =>
        h.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const handleSelect = (habitTitle: string) => {
        onCreate({ title: habitTitle, category, credit });
        reset();
    };

    const handleCustom = () => {
        if (!title.trim()) return;
        onCreate({ title: title.trim(), category, credit, tasks: tasks.filter(t => t.trim()) });
        reset();
    };

    const reset = () => {
        setTitle(""); setCredit(1); setSearch("");
        setIsCustom(false); setTasks([]);
        onClose();
    };

    const color = CATEGORY_COLORS[category];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={reset}
                    style={{
                        position: "fixed", inset: 0,
                        background: "rgba(0,0,0,0.75)",
                        zIndex: 200,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 520,
                            maxHeight: "82vh",
                            background: "#0a0a0a",
                            borderRadius: "16px 16px 0 0",
                            padding: "20px 16px 32px",
                            overflowY: "auto",
                            border: "1px solid #1a1a1a",
                            borderBottom: "none",
                        }}
                    >
                        {/* Handle */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                            <div style={{ width: 32, height: 3, borderRadius: 2, background: "#2a2a2a" }} />
                        </div>

                        <p style={{ fontSize: 16, fontWeight: 600, color: "#e0e0e0", marginBottom: 18 }}>
                            New habit
                        </p>

                        {/* Category tabs */}
                        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                            {Object.keys(PREDEFINED_HABITS).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 4px",
                                        borderRadius: 8,
                                        background: category === cat ? CATEGORY_COLORS[cat] + "15" : "#111",
                                        border: `1px solid ${category === cat ? CATEGORY_COLORS[cat] + "40" : "#1a1a1a"}`,
                                        color: category === cat ? CATEGORY_COLORS[cat] : "#555",
                                        fontSize: 12,
                                        fontWeight: category === cat ? 600 : 400,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {CATEGORY_LABELS[cat]}
                                </button>
                            ))}
                        </div>

                        {/* Browse / Custom toggle */}
                        <div style={{
                            display: "flex",
                            gap: 4,
                            marginBottom: 16,
                            background: "#111",
                            borderRadius: 8,
                            padding: 3,
                        }}>
                            {[false, true].map((val) => (
                                <button
                                    key={String(val)}
                                    onClick={() => setIsCustom(val)}
                                    style={{
                                        flex: 1, padding: "7px 0", borderRadius: 6,
                                        background: isCustom === val ? "#1e1e1e" : "transparent",
                                        border: "none",
                                        color: isCustom === val ? "#ccc" : "#444",
                                        fontSize: 12, fontWeight: isCustom === val ? 500 : 400,
                                        cursor: "pointer",
                                    }}
                                >
                                    {val ? "Custom" : "Browse"}
                                </button>
                            ))}
                        </div>

                        {isCustom ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <input
                                    type="text"
                                    placeholder="Habit name..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        padding: "11px 14px", borderRadius: 10,
                                        background: "#111", border: "1px solid #1e1e1e",
                                        color: "#e0e0e0", fontSize: 14, outline: "none",
                                    }}
                                />

                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 13, color: "#555" }}>Points:</span>
                                    {[1, 2, 3, 4].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setCredit(n)}
                                            style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                background: credit === n ? color + "20" : "#111",
                                                border: `1px solid ${credit === n ? color + "50" : "#1e1e1e"}`,
                                                color: credit === n ? color : "#555",
                                                fontSize: 13, fontWeight: credit === n ? 600 : 400,
                                                cursor: "pointer",
                                            }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>

                                {/* Tasks */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <p style={{ fontSize: 12, color: "#444" }}>Sub-tasks (optional)</p>
                                    {tasks.map((task, idx) => (
                                        <div key={idx} style={{ display: "flex", gap: 6 }}>
                                            <input
                                                type="text"
                                                placeholder={`Task ${idx + 1}`}
                                                value={task}
                                                onChange={(e) => {
                                                    const t = [...tasks];
                                                    t[idx] = e.target.value;
                                                    setTasks(t);
                                                }}
                                                style={{
                                                    flex: 1, padding: "7px 10px", borderRadius: 8,
                                                    background: "#111", border: "1px solid #1e1e1e",
                                                    color: "#ccc", fontSize: 13, outline: "none",
                                                }}
                                            />
                                            <button
                                                onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                                                style={{
                                                    background: "#111", border: "1px solid #1e1e1e",
                                                    borderRadius: 8, padding: "0 10px",
                                                    color: "#555", cursor: "pointer", fontSize: 14,
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setTasks([...tasks, ""])}
                                        style={{
                                            padding: "7px", borderRadius: 8,
                                            background: "transparent", border: "1px dashed #1e1e1e",
                                            color: "#444", fontSize: 12, cursor: "pointer",
                                        }}
                                    >
                                        + add task
                                    </button>
                                </div>

                                <button
                                    onClick={handleCustom}
                                    disabled={!title.trim()}
                                    style={{
                                        padding: "13px 0", borderRadius: 10,
                                        background: title.trim() ? color : "#1a1a1a",
                                        color: title.trim() ? "#fff" : "#333",
                                        border: "none", fontWeight: 600, fontSize: 14,
                                        cursor: title.trim() ? "pointer" : "not-allowed",
                                        marginTop: 4,
                                    }}
                                >
                                    Create habit
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    placeholder={`Search ${CATEGORY_LABELS[category].toLowerCase()} habits...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        borderRadius: 10, background: "#111",
                                        border: "1px solid #1e1e1e",
                                        color: "#e0e0e0", fontSize: 14, outline: "none",
                                        marginBottom: 10,
                                    }}
                                />
                                <div style={{
                                    display: "flex", flexDirection: "column", gap: 4,
                                    maxHeight: 280, overflowY: "auto",
                                }}>
                                    {filtered.map((h) => (
                                        <button
                                            key={h}
                                            onClick={() => handleSelect(h)}
                                            style={{
                                                padding: "11px 14px", borderRadius: 9,
                                                background: "#111", border: "1px solid #1a1a1a",
                                                color: "#ccc", fontSize: 13, cursor: "pointer",
                                                textAlign: "left", fontWeight: 400,
                                                transition: "border-color 0.1s",
                                            }}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
