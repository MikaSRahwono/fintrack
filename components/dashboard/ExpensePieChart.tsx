"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { EXPENSE_CATEGORIES, PIE_COLORS_EXPENSE } from "@/lib/constants";
import { formatRupiah } from "@/lib/formatters";
import type { Expense } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { expenses: Expense[] }

export default function ExpensePieChart({ expenses }: Props) {
  const byCat = EXPENSE_CATEGORIES.map((cat, i) => ({
    label: cat,
    color: PIE_COLORS_EXPENSE[i % PIE_COLORS_EXPENSE.length],
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.value > 0);

  const isEmpty = byCat.length === 0;

  return (
    <div className="bg-bg-2 border border-border rounded-lg p-5">
      <div className="font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase mb-4">
        Expense Breakdown
      </div>
      <div className="h-[220px] flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center">
            <div className="text-3xl opacity-20 mb-2">↓</div>
            <div className="font-mono text-[11px] text-text-3">No data</div>
          </div>
        ) : (
          <Doughnut
            data={{
              labels: byCat.map(c => c.label),
              datasets: [{
                data: byCat.map(c => c.value),
                backgroundColor: byCat.map(c => c.color),
                borderWidth: 0,
                hoverOffset: 6,
              }],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "65%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#9090a8",
                    font: { family: "IBM Plex Mono", size: 9 },
                    boxWidth: 10,
                    padding: 8,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` ${formatRupiah(ctx.parsed)}`,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
