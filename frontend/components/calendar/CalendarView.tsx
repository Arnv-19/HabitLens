"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CalEvent {
    id: string;
    title: string;
    start_time: string | null;
    end_time: string | null;
    type: string;
}

export default function CalendarView() {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalEvent[]>([]);
    const [includeTasks, setIncludeTasks] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchEvents = async () => {
        if (user?.isGuest) return;
        try {
            const data = await api.getCalendar(includeTasks);
            setEvents(data);
        } catch {}
    };

    useEffect(() => {
        fetchEvents();
    }, [includeTasks]);

    const selectedDateStr = date.toISOString().split("T")[0];
    const dayEvents = events.filter((e) => e.start_time?.startsWith(selectedDateStr));

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || user?.isGuest) return;
        try {
            await api.uploadICS(file);
            fetchEvents();
        } catch {}
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Calendar */}
            <div className="glass-card" style={{ padding: "16px 12px" }}>
                <Calendar
                    onChange={(v) => setDate(v as Date)}
                    value={date}
                    locale="en-US"
                />
            </div>

            {/* Controls */}
            {!user?.isGuest && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <label style={{
                        display: "flex", alignItems: "center",
                        gap: 8, fontSize: 13, color: "#555", cursor: "pointer",
                    }}>
                        <div
                            onClick={() => setIncludeTasks(!includeTasks)}
                            style={{
                                width: 36, height: 20, borderRadius: 10,
                                background: includeTasks ? "#6366f1" : "#1a1a1a",
                                position: "relative",
                                transition: "background 0.2s",
                                cursor: "pointer",
                                border: "1px solid #2a2a2a",
                            }}
                        >
                            <motion.div
                                animate={{ x: includeTasks ? 16 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                style={{
                                    width: 16, height: 16,
                                    borderRadius: "50%",
                                    background: "#fff",
                                    position: "absolute",
                                    top: 1,
                                }}
                            />
                        </div>
                        Show tasks
                    </label>

                    <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                            padding: "7px 12px", borderRadius: 8,
                            background: "#0f0f0f", border: "1px solid #1e1e1e",
                            color: "#555", fontSize: 12, cursor: "pointer",
                        }}
                    >
                        Import .ics
                    </button>
                    <input ref={fileRef} type="file" accept=".ics" onChange={handleUpload} style={{ display: "none" }} />
                </div>
            )}

            {/* Events list */}
            <div>
                <p style={{ fontSize: 13, color: "#444", marginBottom: 10 }}>
                    {date.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                </p>

                {dayEvents.length === 0 ? (
                    <p style={{ color: "#2a2a2a", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
                        {user?.isGuest ? "Sign in to sync calendar events" : "Nothing scheduled"}
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {dayEvents.map((ev) => (
                            <div
                                key={ev.id}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 10, background: "#0f0f0f",
                                    border: `1px solid ${ev.type === "habit_task" ? "#6366f120" : "#1a1a1a"}`,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <p style={{
                                        fontSize: 14, color: "#ccc",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>
                                        {ev.title}
                                    </p>
                                    {ev.start_time && (
                                        <p style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
                                            {new Date(ev.start_time).toLocaleTimeString("en", {
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                            {ev.end_time && ` – ${new Date(ev.end_time).toLocaleTimeString("en", {
                                                hour: "2-digit", minute: "2-digit",
                                            })}`}
                                        </p>
                                    )}
                                </div>
                                <span style={{
                                    fontSize: 10,
                                    padding: "3px 7px", borderRadius: 5,
                                    background: ev.type === "habit_task" ? "#6366f115" : "#1a1a1a",
                                    color: ev.type === "habit_task" ? "#818cf8" : "#444",
                                    fontWeight: 500, flexShrink: 0,
                                    textTransform: "uppercase", letterSpacing: "0.5px",
                                }}>
                                    {ev.type === "habit_task" ? "task" : "event"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
