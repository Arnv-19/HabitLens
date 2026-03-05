"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { api } from "@/lib/api";

interface CalEvent {
    id: string;
    title: string;
    start_time: string | null;
    end_time: string | null;
    type: string;
}

export default function CalendarView() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalEvent[]>([]);
    const [includeTasks, setIncludeTasks] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchEvents = async () => {
        try {
            const data = await api.getCalendar(includeTasks);
            setEvents(data);
        } catch {
            console.error("Failed to fetch calendar");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [includeTasks]);

    const selectedDateStr = date.toISOString().split("T")[0];
    const dayEvents = events.filter((e) => e.start_time?.startsWith(selectedDateStr));

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await api.uploadICS(file);
            fetchEvents();
        } catch (err) {
            console.error("ICS upload failed:", err);
        }
    };

    return (
        <div>
            {/* Calendar Widget */}
            <div className="glass-card" style={{ padding: 16, marginBottom: 16 }}>
                <Calendar
                    onChange={(v) => setDate(v as Date)}
                    value={date}
                    locale="en-US"
                />
            </div>

            {/* Controls Row */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
            }}>
                {/* Show Tasks Toggle */}
                <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#888",
                    cursor: "pointer",
                }}>
                    <div
                        onClick={() => setIncludeTasks(!includeTasks)}
                        style={{
                            width: 40,
                            height: 22,
                            borderRadius: 11,
                            background: includeTasks ? "#667eea" : "#222",
                            position: "relative",
                            transition: "background 0.2s",
                            cursor: "pointer",
                        }}
                    >
                        <motion.div
                            animate={{ x: includeTasks ? 20 : 2 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: 2,
                            }}
                        />
                    </div>
                    Show Tasks
                </label>

                {/* Upload ICS */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 10,
                        background: "#111",
                        border: "1px solid #222",
                        color: "#888",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    📤 Import ICS
                </motion.button>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".ics"
                    onChange={handleUpload}
                    style={{ display: "none" }}
                />
            </div>

            {/* Events for Selected Day */}
            <div>
                <h3 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#888",
                    marginBottom: 12,
                }}>
                    {date.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                </h3>

                {dayEvents.length === 0 ? (
                    <p style={{ color: "#444", fontSize: 13, textAlign: "center", padding: 40 }}>
                        No events for this day
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {dayEvents.map((ev) => (
                            <motion.div
                                key={ev.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    background: "#111",
                                    border: `1px solid ${ev.type === "habit_task" ? "#667eea30" : "#1a1a1a"}`,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{ev.title}</p>
                                    {ev.start_time && (
                                        <p style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                                            {new Date(ev.start_time).toLocaleTimeString("en", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            {ev.end_time && ` – ${new Date(ev.end_time).toLocaleTimeString("en", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}`}
                                        </p>
                                    )}
                                </div>
                                <span style={{
                                    fontSize: 10,
                                    padding: "4px 8px",
                                    borderRadius: 6,
                                    background: ev.type === "habit_task" ? "#667eea20" : "#1a1a1a",
                                    color: ev.type === "habit_task" ? "#667eea" : "#555",
                                    fontWeight: 600,
                                }}>
                                    {ev.type === "habit_task" ? "TASK" : "EVENT"}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
