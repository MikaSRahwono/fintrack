import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function TableWrap({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border ${className}`}>
      <table className="w-full border-collapse text-[13px]">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <th className={`bg-bg-3 font-mono text-[10px] font-medium text-text-3 tracking-[0.1em] uppercase
      px-3.5 py-2.5 text-left border-b border-border sticky top-0 z-10 whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td className={`px-3.5 py-2.5 text-text-2 align-middle ${className}`}>
      {children}
    </td>
  );
}

export function TfootRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="bg-bg-3 border-t-2 border-border-2">
      {children}
    </tr>
  );
}

export function TfootTd({ children, className = "" }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td className={`px-3.5 py-2.5 font-mono text-[11px] font-semibold text-text ${className}`}>
      {children}
    </td>
  );
}

export function Tr({
  children,
  dimmed = false,
  onClick,
}: {
  children: React.ReactNode;
  dimmed?: boolean;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-border transition-colors duration-100
        even:bg-[rgba(255,255,255,0.015)]
        hover:bg-bg-3
        ${dimmed ? "opacity-40 line-through" : ""}
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {children}
    </tr>
  );
}

// Inline-editable amount cell for budget/planned-income
export function InlineEditCell({
  value,
  onChange,
  onBlur,
}: {
  value: number;
  onChange: (v: number) => void;
  onBlur: () => void;
}) {
  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      onBlur={onBlur}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
      className="inline-edit bg-transparent border border-transparent text-text-2 font-mono text-[12px]
        w-32 px-1 py-0.5 rounded hover:bg-bg-3 hover:border-border focus:border-accent focus:bg-bg-4
        transition-all duration-150 outline-none"
      placeholder="0"
    />
  );
}
