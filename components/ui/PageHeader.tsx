import React from "react";

interface PageHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, sub, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="font-sans font-bold text-[15px] text-text">{title}</h1>
        {sub && <p className="font-mono text-[11px] text-text-3 mt-0.5">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
