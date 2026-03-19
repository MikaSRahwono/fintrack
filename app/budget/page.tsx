"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { InlineEditCell } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useExpenses } from "@/hooks/useExpenses";
import { useForecast } from "@/hooks/useForecast";
import { useBudget } from "@/hooks/useBudget";
import { useToast } from "@/components/ui/Toast";
import { formatRupiah } from "@/lib/formatters";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

export default function BudgetPage() {
  const { data: expenses, isLoading: expLoading } = useExpenses();
  const { data: forecast } = useForecast();
  const { plannedMap, isLoading: budgetLoading, savePlanned } = useBudget();
  const { toast } = useToast();

  // Local state for inline edits (reflects user typing before debounce saves)
  const [localPlanned, setLocalPlanned] = useState<Record<string, number>>({});

  const getPlanned = (cat: string): number =>
    localPlanned[cat] !== undefined ? localPlanned[cat] : (plannedMap[cat] ?? 0);

  const handleChange = (cat: string, val: number) => {
    setLocalPlanned(prev => ({ ...prev, [cat]: val }));
  };

  const handleBlur = (cat: string) => {
    const val = getPlanned(cat);
    savePlanned(cat, val);
    toast(`Budget "${cat.slice(0, 20)}…" disimpan`, "info" as never);
  };

  const isLoading = expLoading || budgetLoading;

  // Compute per-category actuals & forecast
  const rows = EXPENSE_CATEGORIES.map(cat => {
    const planned = getPlanned(cat);
    const actual = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    const forecastPending = forecast
      .filter(e => e.category === cat && !e.is_expended)
      .reduce((s, e) => s + e.amount, 0);
    const diff = planned - actual;
    const available = planned - forecastPending;
    return { cat, planned, actual, diff, available };
  });

  const totPlanned = rows.reduce((s, r) => s + r.planned, 0);
  const totActual  = rows.reduce((s, r) => s + r.actual,  0);
  const totDiff    = totPlanned - totActual;

  return (
    <div>
      <PageHeader
        title="Budget"
        sub="Planned vs Actual per category — click Planned to edit, changes save automatically"
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Category</Th>
            <Th>Planned</Th>
            <Th>Actual</Th>
            <Th>Diff</Th>
            <Th>Available Budget</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={10} cols={5} />
          ) : rows.map(row => (
            <Tr key={row.cat}>
              <Td>{row.cat}</Td>
              <Td>
                <InlineEditCell
                  value={getPlanned(row.cat)}
                  onChange={v => handleChange(row.cat, v)}
                  onBlur={() => handleBlur(row.cat)}
                />
              </Td>
              <Td>
                <span className="font-mono text-[12px] text-danger">{formatRupiah(row.actual)}</span>
              </Td>
              <Td>
                <span className={`font-mono text-[12px] font-medium ${row.diff >= 0 ? "text-accent" : "text-danger"}`}>
                  {row.diff >= 0 ? "+" : ""}{formatRupiah(row.diff)}
                </span>
              </Td>
              <Td>
                <span className={`font-mono text-[12px] ${row.available >= 0 ? "text-text-2" : "text-danger"}`}>
                  {formatRupiah(row.available)}
                </span>
              </Td>
            </Tr>
          ))}
        </tbody>
        <tfoot>
          <TfootRow>
            <TfootTd>TOTAL</TfootTd>
            <TfootTd>{formatRupiah(totPlanned)}</TfootTd>
            <TfootTd className="text-danger">{formatRupiah(totActual)}</TfootTd>
            <TfootTd className={totDiff >= 0 ? "text-accent" : "text-danger"}>
              {totDiff >= 0 ? "+" : ""}{formatRupiah(totDiff)}
            </TfootTd>
            <TfootTd />
          </TfootRow>
        </tfoot>
      </TableWrap>
    </div>
  );
}
