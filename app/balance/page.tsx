"use client";

import PageHeader from "@/components/ui/PageHeader";
import { TableWrap, Th, Td, Tr, TfootRow, TfootTd } from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import { useBalanceSummary } from "@/hooks/useBalanceSummary";
import { formatRupiah } from "@/lib/formatters";

export default function BalancePage() {
  const { rows, period, isLoading } = useBalanceSummary();

  const grand = rows.reduce(
    (acc, r) => ({
      expenses: acc.expenses + r.expenses,
      income: acc.income + r.income,
      transfers_in: acc.transfers_in + r.transfers_in,
      transfers_out: acc.transfers_out + r.transfers_out,
      total: acc.total + r.total,
    }),
    { expenses: 0, income: 0, transfers_in: 0, transfers_out: 0, total: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Account Balance"
        sub="Paycheck-to-paycheck cycle: 25th previous month → 24th current month"
      />

      {period && (
        <div className="mb-4 px-3 py-2 bg-bg-2 border border-border rounded-lg border-l-2 border-l-accent
          font-mono text-[11px] text-text-2">
          Siklus: <span className="text-accent">{period.start}</span>
          {" "} s/d {" "}
          <span className="text-accent">{period.end}</span>
        </div>
      )}

      <TableWrap>
        <thead>
          <tr>
            <Th>Account</Th>
            <Th>Expenses</Th>
            <Th>Income + Reimburse</Th>
            <Th>Transfer In</Th>
            <Th>Transfer Out</Th>
            <Th>Net</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <div className="text-center py-16 px-4">
                  <div className="text-4xl opacity-20 mb-3">⊞</div>
                  <div className="font-sans text-[14px] text-text-3">No transactions in this period</div>
                </div>
              </td>
            </tr>
          ) : rows.map(row => (
            <Tr key={row.account}>
              <Td><Badge variant="account">{row.account}</Badge></Td>
              <Td><span className="font-mono text-[12px] text-danger">{formatRupiah(row.expenses)}</span></Td>
              <Td><span className="font-mono text-[12px] text-accent">{formatRupiah(row.income)}</span></Td>
              <Td><span className="font-mono text-[12px] text-text-2">{formatRupiah(row.transfers_in)}</span></Td>
              <Td><span className="font-mono text-[12px] text-text-2">{formatRupiah(row.transfers_out)}</span></Td>
              <Td>
                <span className={`font-mono text-[12px] font-semibold ${row.total >= 0 ? "text-accent" : "text-danger"}`}>
                  {formatRupiah(row.total)}
                </span>
              </Td>
            </Tr>
          ))}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <TfootRow>
              <TfootTd>GRAND TOTAL</TfootTd>
              <TfootTd className="text-danger">{formatRupiah(grand.expenses)}</TfootTd>
              <TfootTd className="text-accent">{formatRupiah(grand.income)}</TfootTd>
              <TfootTd>{formatRupiah(grand.transfers_in)}</TfootTd>
              <TfootTd>{formatRupiah(grand.transfers_out)}</TfootTd>
              <TfootTd className={grand.total >= 0 ? "text-accent" : "text-danger"}>
                {formatRupiah(grand.total)}
              </TfootTd>
            </TfootRow>
          </tfoot>
        )}
      </TableWrap>
    </div>
  );
}
