"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = [
    "😊", "😎", "🤓", "🧠", "💪", "🔥", "✨", "🎯",
    "🌟", "🚀", "🎨", "📚", "🎵", "🏃", "🧘", "🌱",
    "🐱", "🦊", "🐻", "🐼", "🤖", "👻", "💀", "🎭",
    "🌈", "⚡", "🌙", "☀️", "🍎", "🍕", "☕", "🎮",
];

export default function AvatarPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (emoji: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                style={{
                    fontSize: 48,
                    background: "rgba(255,255,255,0.05)",
                    border: "2px solid #222",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                {value}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        style={{
                            position: "absolute",
                            top: 90,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#111",
                            border: "1px solid #222",
                            borderRadius: 16,
                            padding: 12,
                            display: "grid",
                            gridTemplateColumns: "repeat(8, 1fr)",
                            gap: 4,
                            zIndex: 50,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                        }}
                    >
                        {EMOJIS.map((e) => (
                            <motion.button
                                key={e}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { onChange(e); setOpen(false); }}
                                style={{
                                    fontSize: 24,
                                    padding: 6,
                                    background: value === e ? "rgba(102,126,234,0.2)" : "transparent",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                }}
                            >
                                {e}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
