"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/calendar", label: "Calendar", icon: "📅" },
    { href: "/stats", label: "Stats", icon: "📈" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                maxWidth: 480,
                margin: "0 auto",
            }}>
                {tabs.map((tab) => {
                    const active = pathname === tab.href;
                    return (
                        <Link key={tab.href} href={tab.href} style={{ textDecoration: "none" }}>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                    padding: "6px 16px",
                                    borderRadius: 12,
                                    position: "relative",
                                }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "rgba(102, 126, 234, 0.12)",
                                            borderRadius: 12,
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span style={{ fontSize: 22 }}>{tab.icon}</span>
                                <span style={{
                                    fontSize: 10,
                                    fontWeight: active ? 600 : 400,
                                    color: active ? "#fff" : "#666",
                                    letterSpacing: "0.5px",
                                }}>
                                    {tab.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
