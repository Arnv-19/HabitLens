"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function CatWidget() {
    const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchQuote = async () => {
        if (show) { setShow(false); return; }
        setLoading(true);
        try {
            const q = await api.getQuote();
            setQuote(q);
            setShow(true);
        } catch {
            setQuote({ quote: "Keep going.", author: "HabitLens" });
            setShow(true);
        }
        setLoading(false);
    };

    return (
        <>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={fetchQuote}
                style={{
                    position: "fixed",
                    bottom: 76,
                    right: 16,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#111",
                    border: "1px solid #222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    cursor: "pointer",
                    zIndex: 90,
                    color: "#555",
                }}
            >
                {loading ? "·" : "🐱"}
            </motion.button>

            <AnimatePresence>
                {show && quote && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setShow(false)}
                        style={{
                            position: "fixed",
                            bottom: 128,
                            right: 16,
                            maxWidth: 260,
                            background: "#111",
                            border: "1px solid #1e1e1e",
                            borderRadius: 12,
                            padding: "14px 16px",
                            zIndex: 91,
                            cursor: "pointer",
                        }}
                    >
                        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 6 }}>
                            "{quote.quote}"
                        </p>
                        <p style={{ fontSize: 11, color: "#444" }}>
                            — {quote.author}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
