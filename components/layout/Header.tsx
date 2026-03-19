"use client";

import { useMonth } from "@/context/MonthContext";

export default function Header() {
  const { label, prev, next, month, year, setMonth, setYear } = useMonth();

  const goToday = () => {
    const now = new Date();
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  return (
    <header className="h-14 min-h-14 bg-bg-2 border-b border-border flex items-center px-6 gap-4 z-10">
      <div className="flex-1" />

      {/* Month Navigator */}
      <div className="flex items-center gap-2">
        <button
          onClick={prev}
          className="w-7 h-7 rounded-md bg-bg-3 border border-border text-text-2 flex items-center justify-center
            hover:border-accent hover:text-accent transition-all text-sm"
        >
          ‹
        </button>

        <button
          onClick={goToday}
          className={`font-mono text-[12px] font-medium min-w-[120px] text-center
            bg-bg-3 border rounded-md px-3 py-1.5 transition-all
            ${isCurrentMonth
              ? "border-accent/40 text-accent"
              : "border-border text-text hover:border-accent hover:text-accent"
            }`}
        >
          {label}
        </button>

        <button
          onClick={next}
          className="w-7 h-7 rounded-md bg-bg-3 border border-border text-text-2 flex items-center justify-center
            hover:border-accent hover:text-accent transition-all text-sm"
        >
          ›
        </button>
      </div>
    </header>
  );
}
