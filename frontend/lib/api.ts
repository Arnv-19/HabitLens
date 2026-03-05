const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
    return res.json();
}

export const api = {
    // Auth
    googleLogin: (token: string) =>
        request("/auth/google", { method: "POST", body: JSON.stringify({ token }) }),
    updateAvatar: (emoji: string) =>
        request("/auth/me/avatar", { method: "PUT", body: JSON.stringify({ avatar_emoji: emoji }) }),

    // Habits
    getHabits: () => request("/habits"),
    createHabit: (data: any) =>
        request("/habits", { method: "POST", body: JSON.stringify(data) }),
    deleteHabit: (id: string) =>
        request(`/habits/${id}`, { method: "DELETE" }),

    // Tasks
    createTask: (data: any) =>
        request("/tasks", { method: "POST", body: JSON.stringify(data) }),
    deleteTask: (id: string) =>
        request(`/tasks/${id}`, { method: "DELETE" }),

    // Habit Logging
    logHabit: (data: any) =>
        request("/dashboard/habit-log", { method: "POST", body: JSON.stringify(data) }),

    // Dashboard
    getDashboard: () => request("/dashboard"),
    getWeekly: () => request("/dashboard/weekly"),
    getMonthly: () => request("/dashboard/monthly"),

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
