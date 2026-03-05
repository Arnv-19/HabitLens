"use client";
import { motion } from "framer-motion";

export default function MonthlyHeatmap({
    data,
}: {
    data: { date: string; effort_index: number }[];
}) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const dataMap: Record<string, number> = {};
    data.forEach((d) => {
        dataMap[d.date] = d.effort_index;
    });

    const getColor = (value: number) => {
        if (value <= 0) return "#111";
        if (value < 25) return "#0e3a1e";
        if (value < 50) return "#1a6b35";
        if (value < 75) return "#26a641";
        return "#39d353";
    };

    const cells = [];
    // Empty cells for alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(<div key={`empty-${i}`} />);
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const value = dataMap[dateStr] || 0;
        const isFuture = day > today.getDate();

        cells.push(
            <motion.div
                key={day}
                whileHover={{ scale: 1.3 }}
                title={`${dateStr}: ${value.toFixed(0)}%`}
                style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 4,
                    background: isFuture ? "#0a0a0a" : getColor(value),
                    border: day === today.getDate() ? "2px solid #667eea" : "1px solid #0a0a0a",
                    cursor: "default",
                    transition: "background 0.2s",
                }}
            />
        );
    }

    return (
        <div>
            {/* Weekday headers */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
                marginBottom: 4,
            }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i} style={{
                        textAlign: "center",
                        fontSize: 10,
                        color: "#555",
                        fontWeight: 500,
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Heatmap Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
            }}>
                {cells}
            </div>

            {/* Legend */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 4,
                marginTop: 12,
                fontSize: 10,
                color: "#555",
            }}>
                <span>Less</span>
                {["#111", "#0e3a1e", "#1a6b35", "#26a641", "#39d353"].map((c) => (
                    <div
                        key={c}
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            background: c,
                        }}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}
