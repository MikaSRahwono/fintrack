"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ExpenseFormModal from "@/components/forms/ExpenseForm";
import EmptyState from "@/components/ui/EmptyState";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatDate } from "@/lib/formatters";
import type { Expense, ExpenseForm } from "@/lib/types";

export default function ExpensesPage() {
  const { data, isLoading, add, update, remove, total } = useExpenses();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Keyboard shortcut N
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if ((e.key === "n" || e.key === "N") && !modalOpen) {
        setEditing(null);
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleSave = async (form: ExpenseForm) => {
    if (editing) {
      await update(editing.id, form);
      toast("Expense diupdate");
    } else {
      await add(form);
      toast("Expense ditambah");
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (row: Expense) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget);
    toast("Expense dihapus");
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Expenses"
        sub="Track your spending"
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            ＋ Add Expense
          </Button>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Account</Th>
            <Th>Amount</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : data.length === 0 ? (
            <EmptyState icon="↓" text="No expenses yet" sub="Press N or click + to add" />
          ) : data.map(row => (
            <Tr key={row.id} onClick={() => handleEdit(row)}>
              <Td><span className="font-mono text-[12px]">{formatDate(row.date)}</span></Td>
              <Td>{row.name || "—"}</Td>
              <Td><Badge variant="category">{row.category}</Badge></Td>
              <Td><Badge variant="account">{row.account}</Badge></Td>
              <Td>
                <span className="font-mono text-[12px] font-medium text-danger">
                  {formatRupiah(row.amount)}
                </span>
              </Td>
              <Td>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(row)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3
                      hover:bg-bg-4 hover:text-blue transition-all text-[11px]"
                  >✎</button>
                  <button
                    onClick={() => setDeleteTarget(row.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3
                      hover:bg-[rgba(255,77,77,0.12)] hover:text-danger transition-all text-[11px]"
                  >✕</button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <TfootRow>
              <TfootTd colSpan={4}>Total</TfootTd>
              <TfootTd className="text-danger">{formatRupiah(total)}</TfootTd>
              <TfootTd />
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
