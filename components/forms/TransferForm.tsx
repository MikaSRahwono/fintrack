"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ACCOUNTS } from "@/lib/constants";
import { todayStr } from "@/lib/formatters";
import type { Transfer, TransferForm } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: TransferForm) => Promise<void>;
  initial?: Transfer | null;
}

const empty = (): TransferForm => ({
  date: todayStr(), account_from: ACCOUNTS[0], account_to: ACCOUNTS[1], amount: 0,
});

export default function TransferFormModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<TransferForm>(initial ? {
    date: initial.date, account_from: initial.account_from,
    account_to: initial.account_to, amount: initial.amount,
  } : empty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof TransferForm) => (v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.date || !form.amount) { setError("Tanggal dan jumlah wajib diisi"); return; }
    if (form.account_from === form.account_to) { setError("Akun asal dan tujuan tidak boleh sama"); return; }
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
    <Modal open={open} onClose={onClose} title={initial ? "Edit Transfer" : "Add Transfer"} icon="⇄">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={form.date}
          onChange={e => set("date")(e.target.value)} />
        <Input label="Amount (Rp)" type="number" value={form.amount || ""}
          onChange={e => set("amount")(e.target.value)} placeholder="0" />
        <Select label="From Account" options={ACCOUNTS} value={form.account_from}
          onChange={e => set("account_from")(e.target.value)} />
        <Select label="To Account" options={ACCOUNTS} value={form.account_to}
          onChange={e => set("account_to")(e.target.value)} />
      </div>
      {error && <p className="text-danger text-[12px] font-mono mt-3">{error}</p>}
      <div className="flex gap-2 justify-end mt-5">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} loading={loading}>Save</Button>
      </div>
    </Modal>
  );
}
