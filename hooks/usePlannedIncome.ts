import useSWR from "swr";
import { useCallback, useRef } from "react";
import { useMonth } from "@/context/MonthContext";
import type { PlannedIncome } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function usePlannedIncome() {
  const { month, year } = useMonth();
  const key = `/api/planned-income?month=${month}&year=${year}`;
  const { data, error, isLoading, mutate } = useSWR<PlannedIncome[]>(key, fetcher);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const savePlanned = useCallback((income_category: string, planned: number) => {
    if (timers.current[income_category]) clearTimeout(timers.current[income_category]);
    timers.current[income_category] = setTimeout(async () => {
      await fetch("/api/planned-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, income_category, planned }),
      });
      await mutate();
    }, 500);
  }, [month, year, mutate]);

  const plannedMap: Record<string, number> = {};
  (data ?? []).forEach(b => { plannedMap[b.income_category] = b.planned; });

  return { data: data ?? [], plannedMap, error, isLoading, savePlanned, mutate };
}
