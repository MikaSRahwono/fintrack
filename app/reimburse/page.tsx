"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ReimburseFormModal from "@/components/forms/ReimburseForm";
import EmptyState from "@/components/ui/EmptyState";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useReimburse } from "@/hooks/useReimburse";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatDate } from "@/lib/formatters";
import type { Reimburse, ReimburseForm } from "@/lib/types";

export default function ReimbursePage() {
  const { data, isLoading, add, update, remove, total } = useReimburse();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reimburse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if ((e.key === "n" || e.key === "N") && !modalOpen) { setEditing(null); setModalOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleSave = async (form: ReimburseForm) => {
    if (editing) { await update(editing.id, form); toast("Reimburse diupdate"); }
    else { await add(form); toast("Reimburse ditambah"); }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Reimbursements"
        sub="Money coming back to you — adds to your account balance"
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            ＋ Add Reimburse
          </Button>
        }
      />

      <div className="mb-4 px-3 py-2 bg-[rgba(168,255,62,0.05)] border border-[rgba(168,255,62,0.12)] rounded-lg
        font-mono text-[11px] text-text-2 border-l-2 border-l-accent pl-3">
        Reimbursements are treated as received income and add to your account balance.
      </div>

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
            <SkeletonTable rows={4} cols={6} />
          ) : data.length === 0 ? (
            <EmptyState icon="↩" text="No reimbursements" sub="Record money you received back" />
          ) : data.map(row => (
            <Tr key={row.id} onClick={() => { setEditing(row); setModalOpen(true); }}>
              <Td><span className="font-mono text-[12px]">{formatDate(row.date)}</span></Td>
              <Td>{row.name || "—"}</Td>
              <Td><Badge variant="category">{row.category}</Badge></Td>
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
              <TfootTd colSpan={4}>Total Reimburse</TfootTd>
              <TfootTd className="text-accent">{formatRupiah(total)}</TfootTd>
              <TfootTd />
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>

      <ReimburseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={async () => { if (deleteTarget) { await remove(deleteTarget); toast("Reimburse dihapus"); } setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
