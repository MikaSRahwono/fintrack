"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { InlineEditCell } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useIncome } from "@/hooks/useIncome";
import { usePlannedIncome } from "@/hooks/usePlannedIncome";
import { formatRupiah } from "@/lib/formatters";
import { INCOME_CATEGORIES } from "@/lib/constants";

export default function PlannedIncomePage() {
  const { data: income, isLoading: incLoading } = useIncome();
  const { plannedMap, isLoading: piLoading, savePlanned } = usePlannedIncome();

  const [localPlanned, setLocalPlanned] = useState<Record<string, number>>({});

  const getPlanned = (cat: string): number =>
    localPlanned[cat] !== undefined ? localPlanned[cat] : (plannedMap[cat] ?? 0);

  const handleChange = (cat: string, val: number) => {
    setLocalPlanned(prev => ({ ...prev, [cat]: val }));
  };

  const handleBlur = (cat: string) => {
    savePlanned(cat, getPlanned(cat));
  };

  const isLoading = incLoading || piLoading;

  const rows = INCOME_CATEGORIES.map(cat => {
    const planned = getPlanned(cat);
    const actual = income.filter(e => e.income_category === cat).reduce((s, e) => s + e.amount, 0);
    const diff = actual - planned;
    return { cat, planned, actual, diff };
  });

  const totPlanned = rows.reduce((s, r) => s + r.planned, 0);
  const totActual  = rows.reduce((s, r) => s + r.actual,  0);
  const totDiff    = totActual - totPlanned;

  return (
    <div>
      <PageHeader
        title="Planned Income"
        sub="Income targets per category — click Planned to edit, auto-saves"
      />

      <TableWrap>
        <thead>
          <tr>
            <Th>Income Category</Th>
            <Th>Planned</Th>
            <Th>Actual</Th>
            <Th>Diff (Actual − Planned)</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={4} cols={4} />
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
                <span className="font-mono text-[12px] text-accent">{formatRupiah(row.actual)}</span>
              </Td>
              <Td>
                <span className={`font-mono text-[12px] font-medium ${row.diff >= 0 ? "text-accent" : "text-danger"}`}>
                  {row.diff >= 0 ? "+" : ""}{formatRupiah(row.diff)}
                </span>
              </Td>
            </Tr>
          ))}
        </tbody>
        <tfoot>
          <TfootRow>
            <TfootTd>TOTAL</TfootTd>
            <TfootTd>{formatRupiah(totPlanned)}</TfootTd>
            <TfootTd className="text-accent">{formatRupiah(totActual)}</TfootTd>
            <TfootTd className={totDiff >= 0 ? "text-accent" : "text-danger"}>
              {totDiff >= 0 ? "+" : ""}{formatRupiah(totDiff)}
            </TfootTd>
          </TfootRow>
        </tfoot>
      </TableWrap>
    </div>
  );
}
