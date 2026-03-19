"use client";

import React, { createContext, useContext, useState } from "react";
import { MONTH_NAMES } from "@/lib/constants";
import type { MonthContextType } from "@/lib/types";

const MonthContext = createContext<MonthContextType | null>(null);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1–12
  const [year, setYear] = useState(now.getFullYear());

  const prev = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const next = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const label = `${MONTH_NAMES[month - 1]} ${year}`;

  return (
    <MonthContext.Provider value={{ month, year, setMonth, setYear, prev, next, label }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth(): MonthContextType {
  const ctx = useContext(MonthContext);
  if (!ctx) throw new Error("useMonth must be used within MonthProvider");
  return ctx;
}
