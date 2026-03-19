"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import IncomeFormModal from "@/components/forms/IncomeForm";
import EmptyState from "@/components/ui/EmptyState";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useIncome } from "@/hooks/useIncome";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatDate } from "@/lib/formatters";
import type { Income, IncomeForm } from "@/lib/types";

export default function IncomePage() {
  const { data, isLoading, add, update, remove, total } = useIncome();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if ((e.key === "n" || e.key === "N") && !modalOpen) { setEditing(null); setModalOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleSave = async (form: IncomeForm) => {
    if (editing) { await update(editing.id, form); toast("Income diupdate"); }
    else { await add(form); toast("Income ditambah"); }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Income"
        sub="What comes in"
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            ＋ Add Income
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
            <SkeletonTable rows={5} cols={6} />
          ) : data.length === 0 ? (
            <EmptyState icon="↑" text="No income recorded" sub="Add your salary or other income" />
          ) : data.map(row => (
            <Tr key={row.id} onClick={() => { setEditing(row); setModalOpen(true); }}>
              <Td><span className="font-mono text-[12px]">{formatDate(row.date)}</span></Td>
              <Td>{row.name || "—"}</Td>
              <Td><Badge variant="category">{row.income_category}</Badge></Td>
              <Td><Badge variant="account">{row.account}</Badge></Td>
              <Td>
                <span className="font-mono text-[12px] font-medium text-accent">
                  {formatRupiah(row.amount)}
                </span>
              </Td>
              <Td>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setEditing(row); setModalOpen(true); }}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3 hover:bg-bg-4 hover:text-blue transition-all text-[11px]">✎</button>
                  <button onClick={() => setDeleteTarget(row.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3 hover:bg-[rgba(255,77,77,0.12)] hover:text-danger transition-all text-[11px]">✕</button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <TfootRow>
              <TfootTd colSpan={4}>Total Income</TfootTd>
              <TfootTd className="text-accent">{formatRupiah(total)}</TfootTd>
              <TfootTd />
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>

      <IncomeFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={async () => { if (deleteTarget) { await remove(deleteTarget); toast("Income dihapus"); } setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
