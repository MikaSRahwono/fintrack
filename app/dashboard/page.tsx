"use client";

import { useState, useEffect, useCallback } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpensesPerDayChart from "@/components/dashboard/ExpensesPerDayChart";
import IncomePieChart from "@/components/dashboard/IncomePieChart";
import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
import QuickAddFAB from "@/components/fab/QuickAddFAB";
import ExpenseFormModal from "@/components/forms/ExpenseForm";
import IncomeFormModal from "@/components/forms/IncomeForm";
import TransferFormModal from "@/components/forms/TransferForm";
import { useExpenses } from "@/hooks/useExpenses";
import { useForecast } from "@/hooks/useForecast";
import { useIncome } from "@/hooks/useIncome";
import { useReimburse } from "@/hooks/useReimburse";
import { useToast } from "@/components/ui/Toast";
import type { ExpenseForm, IncomeForm, TransferForm } from "@/lib/types";

export default function DashboardPage() {
  const { data: expenses, isLoading: expLoading, add: addExpense, total: totalExpenses } = useExpenses();
  const { data: forecast } = useForecast();
  const { data: income, isLoading: incLoading, add: addIncome, total: totalIncome } = useIncome();
  const { total: totalReimburse } = useReimburse();
  const { toast } = useToast();

  const [modal, setModal] = useState<"expense" | "income" | "transfer" | null>(null);

  // Expose FAB action handler via custom event for cross-page use
  const handleFabAction = useCallback((key: string) => {
    setModal(key as "expense" | "income" | "transfer");
  }, []);

  // Keyboard shortcut N on dashboard opens expense modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "n" || e.key === "N") setModal("expense");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleAddExpense = async (form: ExpenseForm) => {
    await addExpense(form);
    toast("Expense ditambah");
    setModal(null);
  };

  const handleAddIncome = async (form: IncomeForm) => {
    await addIncome(form);
    toast("Income ditambah");
    setModal(null);
  };

  const handleAddTransfer = async (_form: TransferForm) => {
    // Transfer is handled in transfers page, but FAB can add here
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_form),
    });
    if (!res.ok) throw new Error("Failed");
    toast("Transfer ditambah");
    setModal(null);
  };

  return (
    <div>
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalReimburse={totalReimburse}
        isLoading={expLoading || incLoading}
      />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-3">
          <ExpensesPerDayChart expenses={expenses} forecast={forecast} />
        </div>
        <IncomePieChart income={income} />
        <ExpensePieChart expenses={expenses} />
        <div className="bg-bg-2 border border-border rounded-lg p-5 flex flex-col justify-between">
          <div className="font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase mb-3">
            Quick Stats
          </div>
          <div className="space-y-3">
            {[
              { label: "Transactions", value: expenses.length + income.length, mono: false },
              { label: "Expense entries", value: expenses.length, mono: false },
              { label: "Income entries", value: income.length, mono: false },
              { label: "Avg daily expense", value: expenses.length
                ? `Rp ${Math.round(totalExpenses / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).toLocaleString("id-ID")}`
                : "—", mono: true },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider">{item.label}</span>
                <span className={`${item.mono ? "font-mono text-[11px]" : "font-mono text-[13px] font-semibold"} text-text`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <QuickAddFAB onAction={handleFabAction} />

      {/* Quick-add modals */}
      <ExpenseFormModal
        open={modal === "expense"}
        onClose={() => setModal(null)}
        onSave={handleAddExpense}
      />
      <IncomeFormModal
        open={modal === "income"}
        onClose={() => setModal(null)}
        onSave={handleAddIncome}
      />
      <TransferFormModal
        open={modal === "transfer"}
        onClose={() => setModal(null)}
        onSave={handleAddTransfer}
      />
    </div>
  );
}
