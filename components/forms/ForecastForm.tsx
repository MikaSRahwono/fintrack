"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { todayStr } from "@/lib/formatters";
import type { Forecast, ForecastForm } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: ForecastForm) => Promise<void>;
  initial?: Forecast | null;
}

const empty = (): ForecastForm => ({
  date: todayStr(), name: "", category: EXPENSE_CATEGORIES[0],
  is_expended: false, amount: 0,
});

export default function ForecastFormModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<ForecastForm>(initial ? {
    date: initial.date, name: initial.name, category: initial.category,
    is_expended: initial.is_expended, amount: initial.amount,
  } : empty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof ForecastForm) => (v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.date || !form.amount) { setError("Tanggal dan jumlah wajib diisi"); return; }
    setLoading(true); setError("");
    try {
      await onSave({ ...form, amount: Number(form.amount) });
      setForm(empty());
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Forecast" : "Add Forecast"} icon="◎">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={form.date}
          onChange={e => set("date")(e.target.value)} />
        <Input label="Amount (Rp)" type="number" value={form.amount || ""}
          onChange={e => set("amount")(e.target.value)} placeholder="0" />
        <div className="col-span-2">
          <Input label="Name / Description" value={form.name}
            onChange={e => set("name")(e.target.value)} placeholder="e.g. Bayar kos" />
        </div>
        <Select label="Category" options={EXPENSE_CATEGORIES} value={form.category}
          onChange={e => set("category")(e.target.value)} />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] font-medium text-text-3 tracking-[0.08em] uppercase">Is Expended</span>
          <label className="flex items-center gap-2.5 cursor-pointer mt-1.5">
            <div
              onClick={() => set("is_expended")(!form.is_expended)}
              className={`relative w-9 h-5 rounded-full border transition-all cursor-pointer flex-shrink-0
                ${form.is_expended ? "bg-[rgba(168,255,62,0.15)] border-accent" : "bg-bg-4 border-border-2"}`}
            >
              <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all
                ${form.is_expended ? "left-[18px] bg-accent" : "left-0.5 bg-text-3"}`} />
            </div>
            <span className="text-[12px] text-text-2">Already expended</span>
          </label>
        </div>
      </div>
      {error && <p className="text-danger text-[12px] font-mono mt-3">{error}</p>}
      <div className="flex gap-2 justify-end mt-5">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>Save</Button>
      </div>
    </Modal>
  );
}
