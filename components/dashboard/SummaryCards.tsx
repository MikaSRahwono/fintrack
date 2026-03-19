import { formatRupiah } from "@/lib/formatters";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  totalReimburse: number;
  isLoading?: boolean;
}

function Card({ label, value, positive }: { label: string; value: number; positive: boolean }) {
  return (
    <div className="bg-bg-2 border border-border rounded-lg p-5">
      <div className="font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase mb-2">{label}</div>
      <div className={`font-mono text-[22px] font-semibold leading-none ${positive ? "text-accent" : "text-danger"}`}>
        {formatRupiah(value)}
      </div>
    </div>
  );
}

export default function SummaryCards({ totalIncome, totalExpenses, totalReimburse, isLoading }: SummaryCardsProps) {
  const net = totalIncome + totalReimburse - totalExpenses;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <Card label="Total Income" value={totalIncome} positive={true} />
      <Card label="Total Expenses" value={totalExpenses} positive={false} />
      <div className="bg-bg-2 border border-border rounded-lg p-5">
        <div className="font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase mb-2">Net Cash Flow</div>
        <div className={`font-mono text-[22px] font-semibold leading-none ${net >= 0 ? "text-accent" : "text-danger"}`}>
          {formatRupiah(net)}
        </div>
      </div>
      <Card label="Reimbursements" value={totalReimburse} positive={true} />
    </div>
  );
}
