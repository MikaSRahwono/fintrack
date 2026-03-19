"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { EXPENSE_CATEGORIES, ACCOUNTS } from "@/lib/constants";
import { todayStr } from "@/lib/formatters";
import type { Expense, ExpenseForm } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: ExpenseForm) => Promise<void>;
  initial?: Expense | null;
}

const empty = (): ExpenseForm => ({
  date: todayStr(), name: "", category: EXPENSE_CATEGORIES[0],
  account: ACCOUNTS[0], amount: 0,
});

export default function ExpenseFormModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<ExpenseForm>(initial ? {
    date: initial.date, name: initial.name, category: initial.category,
    account: initial.account, amount: initial.amount,
  } : empty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof ExpenseForm) => (v: string | number) =>
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
    } finally {
      setLoading(false);
    }
  };

  // Reset when opening
  const handleOpen = () => {
    setForm(initial ? {
      date: initial.date, name: initial.name, category: initial.category,
      account: initial.account, amount: initial.amount,
    } : empty());
    setError("");
  };

  if (open && !loading && !error && !form.name && !initial) { /* init already done */ }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Expense" : "Add Expense"} icon="↓">
      <div onClick={handleOpen} style={{ display: "none" }} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={form.date}
          onChange={e => set("date")(e.target.value)} />
        <Input label="Amount (Rp)" type="number" value={form.amount || ""}
          onChange={e => set("amount")(e.target.value)} placeholder="0" />
        <div className="col-span-2">
          <Input label="Name / Description" value={form.name}
            onChange={e => set("name")(e.target.value)} placeholder="e.g. Makan siang" />
        </div>
        <Select label="Category" options={EXPENSE_CATEGORIES} value={form.category}
          onChange={e => set("category")(e.target.value)} />
        <Select label="Account" options={ACCOUNTS} value={form.account}
          onChange={e => set("account")(e.target.value)} />
      </div>
      {error && <p className="text-danger text-[12px] font-mono mt-3">{error}</p>}
      <div className="flex gap-2 justify-end mt-5">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>Save</Button>
      </div>
    </Modal>
  );
}
