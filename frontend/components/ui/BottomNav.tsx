"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
    { href: "/dashboard", label: "Home", icon: "⊞" },
    { href: "/calendar", label: "Calendar", icon: "◫" },
    { href: "/stats", label: "Stats", icon: "◈" },
    { href: "/settings", label: "Settings", icon: "◎" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                maxWidth: 520,
                margin: "0 auto",
                padding: "0 8px",
            }}>
                {tabs.map((tab) => {
                    const active = pathname === tab.href;
                    return (
                        <Link key={tab.href} href={tab.href} style={{ textDecoration: "none", flex: 1 }}>
                            <motion.div
                                whileTap={{ scale: 0.88 }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 3,
                                    padding: "8px 12px",
                                    borderRadius: 10,
                                    position: "relative",
                                }}
                            >
                                <span style={{
                                    fontSize: 18,
                                    lineHeight: 1,
                                    color: active ? "#6366f1" : "#3a3a3a",
                                    transition: "color 0.2s",
                                }}>
                                    {tab.icon}
                                </span>
                                <span style={{
                                    fontSize: 10,
                                    fontWeight: active ? 600 : 400,
                                    color: active ? "#6366f1" : "#3a3a3a",
                                    letterSpacing: "0.2px",
                                    transition: "color 0.2s",
                                }}>
                                    {tab.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="navDot"
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            background: "#6366f1",
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
