"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function CatWidget() {
    const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const q = await api.getQuote();
            setQuote(q);
            setShow(true);
        } catch {
            setQuote({ quote: "Keep going, you're doing amazing!", author: "HabitLens" });
            setShow(true);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating Cat Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                onClick={fetchQuote}
                style={{
                    position: "fixed",
                    bottom: 80,
                    right: 20,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(102,126,234,0.4)",
                    zIndex: 90,
                }}
            >
                {loading ? "⏳" : "🐱"}
            </motion.button>

            {/* Quote Popup */}
            <AnimatePresence>
                {show && quote && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        onClick={() => setShow(false)}
                        style={{
                            position: "fixed",
                            bottom: 146,
                            right: 20,
                            maxWidth: 300,
                            background: "#111",
                            border: "1px solid #222",
                            borderRadius: 16,
                            padding: 20,
                            zIndex: 91,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                            cursor: "pointer",
                        }}
                    >
                        <p style={{
                            fontSize: 15,
                            lineHeight: 1.6,
                            fontStyle: "italic",
                            color: "#ddd",
                            marginBottom: 8,
                        }}>
                            "{quote.quote}"
                        </p>
                        <p style={{
                            fontSize: 12,
                            color: "#667eea",
                            fontWeight: 600,
                        }}>
                            — {quote.author}
                        </p>
                        <div style={{
                            position: "absolute",
                            bottom: -8,
                            right: 28,
                            width: 16,
                            height: 16,
                            background: "#111",
                            border: "1px solid #222",
                            borderTop: "none",
                            borderLeft: "none",
                            transform: "rotate(45deg)",
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
