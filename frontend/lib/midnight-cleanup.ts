/**
 * midnight-cleanup.ts
 * 
 * Place this in: frontend/lib/midnight-cleanup.ts
 * 
 * Call initMidnightCleanup() once in your root layout or _app.
 * It schedules a cleanup at midnight that:
 *  1. Clears today's habit state from localStorage (so habits reset fresh next day)
 *  2. Calls the backend to purge yesterday's photos
 */

const CLEANUP_KEY = "last_cleanup_date";

function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

async function runCleanup(apiUrl: string) {
    const today = new Date().toISOString().split("T")[0];
    const lastCleanup = localStorage.getItem(CLEANUP_KEY);

    if (lastCleanup === today) return; // Already ran today

    console.log("[HabitLens] Running midnight cleanup for", today);

    // 1. Clear all habit state keys from previous days
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("habit_state_")) {
            // key format: habit_state_{habitId}_{date}
            const parts = key.split("_");
            const keyDate = parts[parts.length - 1];
            if (keyDate !== today) {
                keysToRemove.push(key);
            }
        }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    console.log(`[HabitLens] Cleared ${keysToRemove.length} old habit state entries`);

    // 2. Call backend to cleanup old photos
    const token = getToken();
    if (token) {
        try {
            await fetch(`${apiUrl}/collage/cleanup`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("[HabitLens] Backend photo cleanup done");
        } catch (e) {
            console.warn("[HabitLens] Backend cleanup failed:", e);
        }
    }

    // 3. Mark cleanup done for today
    localStorage.setItem(CLEANUP_KEY, today);
}

function msUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // next midnight
    return midnight.getTime() - now.getTime();
}

export function initMidnightCleanup(apiUrl: string) {
    if (typeof window === "undefined") return; // SSR guard

    // Run immediately on load (catches cases where app wasn't open at midnight)
    runCleanup(apiUrl);

    // Schedule at next midnight
    const scheduleNext = () => {
        const ms = msUntilMidnight();
        console.log(`[HabitLens] Next cleanup in ${Math.round(ms / 60000)} minutes`);
        setTimeout(() => {
            runCleanup(apiUrl);
            scheduleNext(); // reschedule for next midnight
        }, ms);
    };

    scheduleNext();
}
