"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EffortSlider({
    value,
    onChange,
}: {
    value: number;
    onChange: (v: number) => void;
}) {
    const getColor = () => {
        if (value >= 80) return "#2ed573";
        if (value >= 50) return "#ffa502";
        return "#ff4757";
    };

    return (
        <div style={{ width: "100%", padding: "8px 0" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: 12,
                color: "#888",
            }}>
                <span>Effort</span>
                <motion.span
                    key={value}
                    initial={{ scale: 1.3, color: getColor() }}
                    animate={{ scale: 1, color: getColor() }}
                    style={{ fontWeight: 700, fontSize: 14 }}
                >
                    {value}%
                </motion.span>
            </div>
            <div style={{ position: "relative" }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    height: 6,
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${getColor()}88, ${getColor()})`,
                    borderRadius: 3,
                    transform: "translateY(-50%)",
                    transition: "width 0.1s",
                    pointerEvents: "none",
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
