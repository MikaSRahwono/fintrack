export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3.5 py-3">
          <div className="h-3 bg-bg-3 rounded animate-pulse" style={{ width: `${60 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-2 border border-border rounded-lg p-5">
      <div className="h-2.5 w-20 bg-bg-3 rounded animate-pulse mb-3" />
      <div className="h-6 w-36 bg-bg-3 rounded animate-pulse" />
    </div>
  );
}
