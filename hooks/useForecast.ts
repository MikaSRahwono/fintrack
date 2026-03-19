import useSWR from "swr";
import { useMonth } from "@/context/MonthContext";
import type { Forecast, ForecastForm } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useForecast() {
  const { month, year } = useMonth();
  const key = `/api/forecast?month=${month}&year=${year}`;
  const { data, error, isLoading, mutate } = useSWR<Forecast[]>(key, fetcher);

  const add = async (form: ForecastForm) => {
    const res = await fetch("/api/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const update = async (id: string, form: Partial<ForecastForm>) => {
    const res = await fetch(`/api/forecast/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/forecast/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error((await res.json()).error);
    await mutate();
  };

  const toggleExpended = async (id: string, current: boolean) => {
    await update(id, { is_expended: !current });
  };

  const total = (data ?? []).reduce((s, e) => s + e.amount, 0);
  const totalExpended = (data ?? []).filter(e => e.is_expended).reduce((s, e) => s + e.amount, 0);

  return { data: data ?? [], error, isLoading, add, update, remove, toggleExpended, total, totalExpended, mutate };
}
