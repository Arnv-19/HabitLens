"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface DashboardData {
    effort_index: number;
    daily_score: number;
    streak: number;
    total_habits: number;
}

interface WeeklyData {
    date: string;
    effort_index: number;
}

interface MonthlyData {
    date: string;
    effort_index: number;
    total_score: number;
}

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [weekly, setWeekly] = useState<WeeklyData[]>([]);
    const [monthly, setMonthly] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const [dash, week, month] = await Promise.all([
                api.getDashboard(),
                api.getWeekly(),
                api.getMonthly(),
            ]);
            setDashboard(dash);
            setWeekly(week);
            setMonthly(month);
        } catch (e) {
            console.error("Dashboard fetch error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return { dashboard, weekly, monthly, loading, fetchDashboard };
}
