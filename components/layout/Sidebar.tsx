"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", items: [
    { href: "/dashboard", icon: "◈", label: "Dashboard" },
  ]},
  { label: "Transactions", items: [
    { href: "/expenses",  icon: "↓", label: "Expenses" },
    { href: "/forecast",  icon: "◎", label: "Forecasted" },
    { href: "/income",    icon: "↑", label: "Income" },
    { href: "/transfers", icon: "⇄", label: "Transfers" },
    { href: "/reimburse", icon: "↩", label: "Reimburse" },
  ]},
  { label: "Planning", items: [
    { href: "/budget",         icon: "≡", label: "Budget" },
    { href: "/planned-income", icon: "⊕", label: "Planned Income" },
  ]},
  { label: "Insights", items: [
    { href: "/balance", icon: "⊞", label: "Account Balance" },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <nav className="w-[220px] min-w-[220px] flex flex-col bg-bg-2 border-r border-border overflow-hidden">
      {/* Logo */}
      <div className="p-5 pb-4 border-b border-border">
        <div className="font-sans font-extrabold text-lg text-accent tracking-tight">FinTrack</div>
        <div className="font-mono text-[10px] text-text-3 mt-0.5 tracking-widest uppercase">Personal Finance OS</div>
      </div>

      {/* Nav */}
      <div className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map(group => (
          <div key={group.label}>
            <div className="px-5 py-2 font-mono text-[9px] font-medium text-text-3 tracking-[0.12em] uppercase">
              {group.label}
            </div>
            {group.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-5 py-2 text-[13px] font-medium transition-all duration-150
                    border-l-2
                    ${active
                      ? "text-accent bg-[rgba(168,255,62,0.06)] border-accent"
                      : "text-text-2 border-transparent hover:text-text hover:bg-bg-3"
                    }`}
                >
                  <span className={`text-sm w-4 text-center ${active ? "opacity-100" : "opacity-70"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border font-mono text-[10px] text-text-3">
        {today}
      </div>
    </nav>
  );
}
