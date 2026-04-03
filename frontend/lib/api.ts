const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Guest mode: store habits locally
const GUEST_HABITS_KEY = "guest_habits";
const GUEST_LOGS_KEY = "guest_logs";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

function isGuest(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("is_guest") === "true";
}

async function request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(err.detail || "Request failed");
    }
    // 204 No Content
    if (res.status === 204) return null;
    return res.json();
}

// ---- Guest habit storage ----
let _guestHabitId = 100;
function loadGuestHabits(): any[] {
    try {
        return JSON.parse(localStorage.getItem(GUEST_HABITS_KEY) || "[]");
    } catch { return []; }
}
function saveGuestHabits(habits: any[]) {
    localStorage.setItem(GUEST_HABITS_KEY, JSON.stringify(habits));
}

function loadGuestLogs(): any[] {
    try {
        return JSON.parse(localStorage.getItem(GUEST_LOGS_KEY) || "[]");
    } catch { return []; }
}
function saveGuestLogs(logs: any[]) {
    localStorage.setItem(GUEST_LOGS_KEY, JSON.stringify(logs));
}

function guestCreateHabit(data: any): any {
    const habits = loadGuestHabits();
    const id = String(++_guestHabitId);
    const credit = data.category === "essential" ? 4 : data.category === "productivity" ? 2 : data.category === "recreation" ? 2 : 1;
    const habit = {
        id,
        user_id: "guest",
        title: data.title,
        category: data.category,
        credit,
        is_fixed: ["productivity", "essential"].includes(data.category),
        created_at: new Date().toISOString(),
        tasks: (data.tasks || []).map((name: string, i: number) => ({
            id: `${id}-t${i}`,
            habit_id: id,
            task_name: name,
            time: null,
        })),
    };
    habits.push(habit);
    saveGuestHabits(habits);
    return habit;
}

function guestLogHabit(data: any): any {
    const logs = loadGuestLogs();
    const today = new Date().toISOString().split("T")[0];
    const habits = loadGuestHabits();
    const habit = habits.find((h: any) => h.id === data.habit_id);
    if (!habit) throw new Error("Habit not found");

    const score = habit.credit * (data.tasks_completed / Math.max(habit.tasks.length, 1)) * (data.effort_percent / 100);
    const existing = logs.findIndex((l: any) => l.habit_id === data.habit_id && l.date === today);
    const logEntry = {
        id: String(Date.now()),
        habit_id: data.habit_id,
        date: today,
        tasks_completed: data.tasks_completed,
        effort_percent: data.effort_percent,
        score,
    };
    if (existing >= 0) logs[existing] = logEntry;
    else logs.push(logEntry);
    saveGuestLogs(logs);
    return logEntry;
}

export const api = {
    // Auth
    googleLogin: (token: string) =>
        request("/auth/google", { method: "POST", body: JSON.stringify({ token }) }),
    updateAvatar: (emoji: string) =>
        request("/auth/me/avatar", { method: "PUT", body: JSON.stringify({ avatar_emoji: emoji }) }),

    // Habits
    getHabits: () => {
        if (isGuest()) return Promise.resolve(loadGuestHabits());
        return request("/habits");
    },
    createHabit: (data: any) => {
        if (isGuest()) return Promise.resolve(guestCreateHabit(data));
        return request("/habits", { method: "POST", body: JSON.stringify(data) });
    },
    deleteHabit: (id: string) => {
        if (isGuest()) {
            saveGuestHabits(loadGuestHabits().filter((h: any) => h.id !== id));
            return Promise.resolve(null);
        }
        return request(`/habits/${id}`, { method: "DELETE" });
    },

    // Tasks
    createTask: (data: any) => {
        if (isGuest()) {
            const habits = loadGuestHabits();
            const habit = habits.find((h: any) => h.id === data.habit_id);
            if (habit) {
                const task = { id: `${data.habit_id}-t${Date.now()}`, habit_id: data.habit_id, task_name: data.task_name, time: null };
                habit.tasks.push(task);
                saveGuestHabits(habits);
                return Promise.resolve(task);
            }
            return Promise.reject(new Error("Habit not found"));
        }
        return request("/tasks", { method: "POST", body: JSON.stringify(data) });
    },
    deleteTask: (id: string) => {
        if (isGuest()) {
            const habits = loadGuestHabits();
            habits.forEach((h: any) => { h.tasks = h.tasks.filter((t: any) => t.id !== id); });
            saveGuestHabits(habits);
            return Promise.resolve(null);
        }
        return request(`/tasks/${id}`, { method: "DELETE" });
    },

    // Logging
    logHabit: (data: any) => {
        if (isGuest()) return Promise.resolve(guestLogHabit(data));
        return request("/dashboard/habit-log", { method: "POST", body: JSON.stringify(data) });
    },

    // Dashboard
    getDashboard: () => {
        if (isGuest()) {
            const logs = loadGuestLogs();
            const habits = loadGuestHabits();
            const today = new Date().toISOString().split("T")[0];
            const todayLogs = logs.filter((l: any) => l.date === today);
            const totalScore = todayLogs.reduce((s: number, l: any) => s + l.score, 0);
            const maxScore = habits.reduce((s: number, h: any) => s + h.credit, 0);
            return Promise.resolve({
                effort_index: maxScore > 0 ? (totalScore / maxScore) * 100 : 0,
                daily_score: totalScore,
                streak: 0,
                total_habits: habits.length,
            });
        }
        return request("/dashboard");
    },
    getWeekly: () => {
        if (isGuest()) {
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                result.push({ date: d.toISOString().split("T")[0], effort_index: 0 });
            }
            return Promise.resolve(result);
        }
        return request("/dashboard/weekly");
    },
    getMonthly: () => {
        if (isGuest()) return Promise.resolve([]);
        return request("/dashboard/monthly");
    },

    // Calendar
    getCalendar: (includeTasks = false) =>
        request(`/calendar?include_tasks=${includeTasks}`),
    uploadICS: (file: File) => {
        const fd = new FormData();
        fd.append("file", file);
        return request("/calendar/upload", { method: "POST", body: fd });
    },

    // Collage
    uploadPhoto: (habitId: string, file: File, taskId?: string) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("habit_id", habitId);
        if (taskId) fd.append("task_id", taskId);
        return request(`/collage/upload-photo?habit_id=${habitId}${taskId ? `&task_id=${taskId}` : ""}`, {
            method: "POST",
            body: fd,
        });
    },
    generateCollage: () =>
        request("/collage/generate", { method: "POST" }),

    // Quotes & Reflection
    getQuote: () => request("/quotes"),
    getReflection: () => request("/reflection/today"),
};
