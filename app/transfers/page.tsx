"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TransferFormModal from "@/components/forms/TransferForm";
import EmptyState from "@/components/ui/EmptyState";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useTransfers } from "@/hooks/useTransfers";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatDate } from "@/lib/formatters";
import type { Transfer, TransferForm } from "@/lib/types";

export default function TransfersPage() {
  const { data, isLoading, add, update, remove, total } = useTransfers();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transfer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if ((e.key === "n" || e.key === "N") && !modalOpen) { setEditing(null); setModalOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleSave = async (form: TransferForm) => {
    if (editing) { await update(editing.id, form); toast("Transfer diupdate"); }
    else { await add(form); toast("Transfer ditambah"); }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Transfers"
        sub="Between accounts — does not affect income or expense totals"
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            ＋ Add Transfer
          </Button>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th>Amount</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={4} cols={5} />
          ) : data.length === 0 ? (
            <EmptyState icon="⇄" text="No transfers recorded" sub="Track money moving between accounts" />
          ) : data.map(row => (
            <Tr key={row.id} onClick={() => { setEditing(row); setModalOpen(true); }}>
              <Td><span className="font-mono text-[12px]">{formatDate(row.date)}</span></Td>
              <Td><Badge variant="account">{row.account_from}</Badge></Td>
              <Td><Badge variant="account">{row.account_to}</Badge></Td>
              <Td>
                <span className="font-mono text-[12px] font-medium text-text">
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
              <TfootTd colSpan={3}>Total Transferred</TfootTd>
              <TfootTd>{formatRupiah(total)}</TfootTd>
              <TfootTd />
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>

      <TransferFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={async () => { if (deleteTarget) { await remove(deleteTarget); toast("Transfer dihapus"); } setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
