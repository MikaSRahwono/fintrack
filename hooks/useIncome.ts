import useSWR from "swr";
import { useMonth } from "@/context/MonthContext";
import type { Income, IncomeForm } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useIncome() {
  const { month, year } = useMonth();
  const key = `/api/income?month=${month}&year=${year}`;
  const { data, error, isLoading, mutate } = useSWR<Income[]>(key, fetcher);

  const add = async (form: IncomeForm) => {
    const res = await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const update = async (id: string, form: Partial<IncomeForm>) => {
    const res = await fetch(`/api/income/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/income/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const total = (data ?? []).reduce((s, e) => s + e.amount, 0);

  return { data: data ?? [], error, isLoading, add, update, remove, total, mutate };
}
