"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BottomNav from "@/components/ui/BottomNav";
import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    if (loading || !user) return null;

    return (
        <div className="page-transition" style={{ padding: "20px 16px 100px" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px" }}>
                📅 Calendar
            </h1>
            <CalendarView />
            <BottomNav />
        </div>
    );
}
