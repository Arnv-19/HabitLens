"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUploader({
    onUpload,
}: {
    onUpload: (file: File) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = (file: File) => {
        setPreview(URL.createObjectURL(file));
        onUpload(file);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
            style={{
                border: `2px dashed ${dragOver ? "#667eea" : "#333"}`,
                borderRadius: 12,
                padding: preview ? 0 : 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                minHeight: 120,
                background: dragOver ? "rgba(102,126,234,0.05)" : "transparent",
                transition: "all 0.2s",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
                style={{ display: "none" }}
            />

            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.img
                        key="preview"
                        src={preview}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                            borderRadius: 10,
                        }}
                    />
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: "center" }}
                    >
                        <div style={{ fontSize: 32, marginBottom: 8 }}>➕</div>
                        <div style={{ color: "#666", fontSize: 13 }}>
                            Tap to capture or upload
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
