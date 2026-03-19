"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ForecastFormModal from "@/components/forms/ForecastForm";
import EmptyState from "@/components/ui/EmptyState";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useForecast } from "@/hooks/useForecast";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah, formatDate } from "@/lib/formatters";
import type { Forecast, ForecastForm } from "@/lib/types";

export default function ForecastPage() {
  const { data, isLoading, add, update, remove, toggleExpended, total, totalExpended } = useForecast();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Forecast | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if ((e.key === "n" || e.key === "N") && !modalOpen) { setEditing(null); setModalOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  const handleSave = async (form: ForecastForm) => {
    if (editing) { await update(editing.id, form); toast("Forecast diupdate"); }
    else { await add(form); toast("Forecast ditambah"); }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Forecasted Expenses"
        sub="Plan ahead — track what you expect to spend"
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            ＋ Add Forecast
          </Button>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Expended</Th>
            <Th>Amount</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : data.length === 0 ? (
            <EmptyState icon="◎" text="No forecasted expenses" sub="Add planned spending for the month" />
          ) : data.map(row => (
            <Tr key={row.id} dimmed={row.is_expended} onClick={() => { setEditing(row); setModalOpen(true); }}>
              <Td><span className="font-mono text-[12px]">{formatDate(row.date)}</span></Td>
              <Td>{row.name || "—"}</Td>
              <Td><Badge variant="category">{row.category}</Badge></Td>
              <Td>
                <div
                  onClick={e => { e.stopPropagation(); toggleExpended(row.id, row.is_expended); }}
                  className={`relative w-9 h-5 rounded-full border transition-all cursor-pointer
                    ${row.is_expended
                      ? "bg-[rgba(168,255,62,0.15)] border-accent"
                      : "bg-bg-4 border-border-2"}`}
                >
                  <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all
                    ${row.is_expended ? "left-[18px] bg-accent" : "left-0.5 bg-text-3"}`} />
                </div>
              </Td>
              <Td>
                <span className="font-mono text-[12px] font-medium text-text">
                  {formatRupiah(row.amount)}
                </span>
              </Td>
              <Td>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setEditing(row); setModalOpen(true); }}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3 hover:bg-bg-4 hover:text-blue transition-all text-[11px]">
                    ✎
                  </button>
                  <button onClick={() => setDeleteTarget(row.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-text-3 hover:bg-[rgba(255,77,77,0.12)] hover:text-danger transition-all text-[11px]">
                    ✕
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <TfootRow>
              <TfootTd colSpan={3}>Total</TfootTd>
              <TfootTd>
                <span className="text-text-3 font-mono text-[10px]">
                  Expended: {formatRupiah(totalExpended)}
                </span>
              </TfootTd>
              <TfootTd>{formatRupiah(total)}</TfootTd>
              <TfootTd />
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>

      <ForecastFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={async () => { if (deleteTarget) { await remove(deleteTarget); toast("Forecast dihapus"); } setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
