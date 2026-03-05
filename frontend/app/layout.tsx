import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
    title: "HabitLens — Track Your Habits",
    description:
        "A premium habit tracking platform with visual analytics, photo collages, and AI-powered daily reflections.",
    manifest: "/manifest.json",
    icons: { apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
