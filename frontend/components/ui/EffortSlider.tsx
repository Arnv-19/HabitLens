"use client";
import { motion } from "framer-motion";

export default function EffortSlider({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const getColor = () => {
        if (value >= 80) return "#22c55e";
        if (value >= 50) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div style={{ width: "100%" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                fontSize: 12,
            }}>
                <span style={{ color: "#555" }}>effort</span>
                <motion.span
                    key={value}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    style={{ color: getColor(), fontWeight: 600, fontSize: 13 }}
                >
                    {value}%
                </motion.span>
            </div>
            <div style={{ position: "relative" }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    height: 4,
                    width: `${value}%`,
                    background: getColor(),
                    borderRadius: 2,
                    transform: "translateY(-50%)",
                    transition: "width 0.05s, background 0.2s",
                    pointerEvents: "none",
                    opacity: 0.7,
                }} />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{ position: "relative", zIndex: 1 }}
                />
            </div>
        </div>
    );
}
