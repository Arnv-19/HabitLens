"use client";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function WeeklyBarChart({
    data,
}: {
    data: { date: string; effort_index: number }[];
}) {
    const labels = data.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en", { weekday: "short" });
    });

    const values = data.map((d) => d.effort_index);

    return (
        <div style={{ padding: "16px 0" }}>
            <Bar
                data={{
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: values.map((v) =>
                                v >= 80
                                    ? "rgba(46, 213, 115, 0.8)"
                                    : v >= 50
                                        ? "rgba(255, 165, 2, 0.8)"
                                        : "rgba(255, 71, 87, 0.5)"
                            ),
                            borderRadius: 8,
                            borderSkipped: false,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: "#1a1a1a" },
                            ticks: { color: "#555", font: { size: 11 } },
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: "#888", font: { size: 12 } },
                        },
                    },
                }}
            />
        </div>
    );
}
