"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREDEFINED_HABITS: Record<string, string[]> = {
    productivity: [
        "Study", "Assignment Work", "Research Reading", "Lecture Review",
        "Practice Problems", "Exam Preparation", "Project Development",
        "Write Notes", "Flashcard Review", "Coding Practice",
        "Algorithm Practice", "Technical Reading", "Language Learning",
        "Prepare Presentation", "Solve Past Papers", "Debug Code",
        "Watch Lecture", "Academic Revision",
    ],
    recreation: [
        "Gym Workout", "Running", "Yoga", "Meditation", "Read Book",
        "Music Practice", "Drawing", "Photography", "Play Sports",
        "Cooking", "Watch Educational Video", "Explore New Topic",
        "Creative Writing", "Dance Practice", "Podcast Listening",
        "Gardening", "Walk Outside",
    ],
    essential: [
        "Brush Teeth", "Drink Water", "Eat Breakfast", "Eat Lunch",
        "Eat Dinner", "Sleep Early", "Take Vitamins", "Shower",
        "Morning Routine", "Evening Routine", "Stretch", "Make Bed",
        "Organize Desk", "Hydrate",
    ],
    bonus: [
        "Sunrise Photo", "Sunset Photo", "Capture Sky", "Nature Photo",
        "Write Reflection", "Gratitude Note", "Capture Moment",
        "Try Something New", "Street Photo", "Night Sky Photo",
        "Creative Photo", "Observe Nature", "Capture Landscape",
    ],
};

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

    const filteredHabits = PREDEFINED_HABITS[category]?.filter((h) =>
        h.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleSelect = (habitTitle: string) => {
        onCreate({ title: habitTitle, category, credit });
        resetAndClose();
    };

    const handleCustom = () => {
        if (!title.trim()) return;
        onCreate({ title: title.trim(), category, credit, tasks: tasks.filter(t => t.trim() !== "") });
        resetAndClose();
    };

    const resetAndClose = () => {
        setTitle("");
        setCredit(1);
        setSearch("");
        setIsCustom(false);
        setTasks([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={resetAndClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.85)",
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
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            maxHeight: "85vh",
                            background: "#0a0a0a",
                            borderRadius: "24px 24px 0 0",
                            padding: 24,
                            overflowY: "auto",
                        }}
                    >
                        {/* Handle */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#333" }} />
                        </div>

                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#fff" }}>
                            Create New Habit
                        </h2>

                        {/* Category Selector */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                            {Object.keys(PREDEFINED_HABITS).map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        padding: "10px 4px",
                                        borderRadius: 12,
                                        background: category === cat ? CATEGORY_COLORS[cat] + "20" : "#111",
                                        border: `1px solid ${category === cat ? CATEGORY_COLORS[cat] + "60" : "#1a1a1a"}`,
                                        color: category === cat ? CATEGORY_COLORS[cat] : "#888",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        textTransform: "capitalize",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[cat]}</span>
                                    {cat}
                                </motion.button>
                            ))}
                        </div>

                        {/* Toggle: Predefined vs Custom */}
                        <div style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 16,
                            background: "#111",
                            borderRadius: 12,
                            padding: 4,
                        }}>
                            {[
                                { label: "Browse", val: false },
                                { label: "Custom", val: true },
                            ].map((opt) => (
                                <motion.button
                                    key={opt.label}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsCustom(opt.val)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 0",
                                        borderRadius: 10,
                                        background: isCustom === opt.val
                                            ? `linear-gradient(135deg, ${CATEGORY_COLORS[category]}40, ${CATEGORY_COLORS[category]}20)`
                                            : "transparent",
                                        border: "none",
                                        color: isCustom === opt.val ? "#fff" : "#666",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    {opt.label}
                                </motion.button>
                            ))}
                        </div>

                        {isCustom ? (
                            /* Custom Habit Form */
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <input
                                    type="text"
                                    placeholder="Habit name..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: 12,
                                        background: "#111",
                                        border: "1px solid #222",
                                        color: "#fff",
                                        fontSize: 15,
                                        outline: "none",
                                    }}
                                />
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <label style={{ color: "#888", fontSize: 13 }}>Credit:</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={credit}
                                        onChange={(e) => setCredit(Number(e.target.value))}
                                        style={{
                                            width: 60,
                                            padding: "8px 12px",
                                            borderRadius: 10,
                                            background: "#111",
                                            border: "1px solid #222",
                                            color: "#fff",
                                            fontSize: 14,
                                            outline: "none",
                                            textAlign: "center",
                                        }}
                                    />
                                </div>

                                {/* Task List */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                                    <label style={{ color: "#888", fontSize: 13 }}>Sub-tasks (Optional):</label>
                                    {tasks.map((task, idx) => (
                                        <div key={idx} style={{ display: "flex", gap: 8 }}>
                                            <input
                                                type="text"
                                                placeholder={`Task ${idx + 1}`}
                                                value={task}
                                                onChange={(e) => {
                                                    const newTasks = [...tasks];
                                                    newTasks[idx] = e.target.value;
                                                    setTasks(newTasks);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px 12px",
                                                    borderRadius: 8,
                                                    background: "#111",
                                                    border: "1px solid #222",
                                                    color: "#fff",
                                                    fontSize: 14,
                                                    outline: "none",
                                                }}
                                            />
                                            <button
                                                onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                                                style={{
                                                    background: "rgba(255, 71, 87, 0.1)",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    padding: "0 12px",
                                                    color: "#ff4757",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setTasks([...tasks, ""])}
                                        style={{
                                            padding: "8px",
                                            borderRadius: 8,
                                            background: "rgba(255, 255, 255, 0.05)",
                                            border: "1px dashed #333",
                                            color: "#888",
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        + Add Task
                                    </button>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCustom}
                                    disabled={!title.trim()}
                                    style={{
                                        padding: "14px 0",
                                        borderRadius: 12,
                                        background: title.trim()
                                            ? `linear-gradient(135deg, ${CATEGORY_COLORS[category]}, ${CATEGORY_COLORS[category]}cc)`
                                            : "#222",
                                        color: title.trim() ? "#fff" : "#555",
                                        border: "none",
                                        fontWeight: 700,
                                        fontSize: 15,
                                        cursor: title.trim() ? "pointer" : "not-allowed",
                                    }}
                                >
                                    Create Habit
                                </motion.button>
                            </div>
                        ) : (
                            /* Browse Predefined */
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search habits..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: 12,
                                        background: "#111",
                                        border: "1px solid #222",
                                        color: "#fff",
                                        fontSize: 14,
                                        outline: "none",
                                        marginBottom: 12,
                                    }}
                                />
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: 8,
                                    maxHeight: 300,
                                    overflowY: "auto",
                                }}>
                                    {filteredHabits.map((h) => (
                                        <motion.button
                                            key={h}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleSelect(h)}
                                            style={{
                                                padding: "12px",
                                                borderRadius: 12,
                                                background: "#111",
                                                border: "1px solid #1a1a1a",
                                                color: "#ddd",
                                                fontSize: 13,
                                                cursor: "pointer",
                                                textAlign: "left",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {h}
                                        </motion.button>
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
