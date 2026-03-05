"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface HabitTask {
    id: string;
    habit_id: string;
    task_name: string;
    time: string | null;
}

export interface Habit {
    id: string;
    user_id: string;
    title: string;
    category: string;
    credit: number;
    is_fixed: boolean;
    created_at: string;
    tasks: HabitTask[];
}

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getHabits();
            setHabits(data);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHabits();
    }, [fetchHabits]);

    const createHabit = async (data: any) => {
        await api.createHabit(data);
        await fetchHabits();
    };

    const deleteHabit = async (id: string) => {
        await api.deleteHabit(id);
        await fetchHabits();
    };

    const logHabit = async (habitId: string, tasksCompleted: number, effortPercent: number) => {
        await api.logHabit({
            habit_id: habitId,
            tasks_completed: tasksCompleted,
            effort_percent: effortPercent,
        });
    };

    return { habits, loading, error, fetchHabits, createHabit, deleteHabit, logHabit };
}
