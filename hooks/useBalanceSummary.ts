import useSWR from "swr";
import { useMonth } from "@/context/MonthContext";
import type { AccountBalance } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useBalanceSummary() {
  const { month, year } = useMonth();
  const key = `/api/balance-summary?month=${month}&year=${year}`;
  const { data, error, isLoading } = useSWR<{ rows: AccountBalance[]; period: { start: string; end: string } }>(key, fetcher);

  return {
    rows: data?.rows ?? [],
    period: data?.period,
    error,
    isLoading,
  };
}
