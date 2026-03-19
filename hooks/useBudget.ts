import useSWR from "swr";
import { useCallback, useRef } from "react";
import { useMonth } from "@/context/MonthContext";
import type { Budget } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useBudget() {
  const { month, year } = useMonth();
  const key = `/api/budget?month=${month}&year=${year}`;
  const { data, error, isLoading, mutate } = useSWR<Budget[]>(key, fetcher);

  // Debounce save per category
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const savePlanned = useCallback((category: string, planned: number) => {
    if (timers.current[category]) clearTimeout(timers.current[category]);
    timers.current[category] = setTimeout(async () => {
      await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, category, planned }),
      });
      await mutate();
    }, 500);
  }, [month, year, mutate]);

  // Map category → planned amount for quick lookup
  const plannedMap: Record<string, number> = {};
  (data ?? []).forEach(b => { plannedMap[b.category] = b.planned; });

  return { data: data ?? [], plannedMap, error, isLoading, savePlanned, mutate };
}
