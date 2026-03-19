"use client";

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, Tooltip, Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useMonth } from "@/context/MonthContext";
import { getDaysInMonth, buildDayKey } from "@/lib/formatters";
import type { Expense, Forecast } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

interface Props {
  expenses: Expense[];
  forecast: Forecast[];
}

export default function ExpensesPerDayChart({ expenses, forecast }: Props) {
  const { month, year } = useMonth();
  const days = getDaysInMonth(month, year);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));

  const actualPerDay = labels.map((_, i) => {
    const key = buildDayKey(year, month, i + 1);
    return expenses.filter(e => e.date === key).reduce((s, e) => s + e.amount, 0);
  });

  const forecastPerDay = labels.map((_, i) => {
    const key = buildDayKey(year, month, i + 1);
    return forecast.filter(e => e.date === key).reduce((s, e) => s + e.amount, 0);
  });

  const formatTick = (v: number | string) => {
    const n = Number(v);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  };

  return (
    <div className="bg-bg-2 border border-border rounded-lg p-5">
      <div className="font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase mb-4">
        Expenses Per Day — Forecast vs Actual
      </div>
      <div className="h-[220px]">
        <Chart
          type="bar"
          data={{
            labels,
            datasets: [
              {
                type: "bar" as const,
                label: "Forecast",
                data: forecastPerDay,
                backgroundColor: "rgba(91,141,238,0.25)",
                borderColor: "rgba(91,141,238,0.5)",
                borderWidth: 1,
                borderRadius: 3,
              },
              {
                type: "line" as const,
                label: "Actual",
                data: actualPerDay,
                borderColor: "#a8ff3e",
                backgroundColor: "rgba(168,255,62,0.06)",
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: "#a8ff3e",
                borderWidth: 2,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: "#9090a8", font: { family: "IBM Plex Mono", size: 10 }, boxWidth: 12, padding: 12 },
              },
            },
            scales: {
              x: {
                ticks: { color: "#5a5a72", font: { family: "IBM Plex Mono", size: 9 } },
                grid: { color: "rgba(255,255,255,0.03)" },
                border: { color: "#2a2a38" },
              },
              y: {
                ticks: { color: "#5a5a72", font: { family: "IBM Plex Mono", size: 9 }, callback: formatTick },
                grid: { color: "rgba(255,255,255,0.04)" },
                border: { color: "#2a2a38" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
