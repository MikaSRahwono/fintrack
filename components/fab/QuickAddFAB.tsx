"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FabAction {
  label: string;
  color: string;
  path: string;
  key: string;
}

const ACTIONS: FabAction[] = [
  { label: "Expense",  color: "#ff4d4d",  path: "/expenses",  key: "expense"  },
  { label: "Income",   color: "#a8ff3e",  path: "/income",    key: "income"   },
  { label: "Transfer", color: "#5b8dee",  path: "/transfers", key: "transfer" },
];

interface Props {
  onAction: (key: string) => void;
}

export default function QuickAddFAB({ onAction }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAction = (action: FabAction) => {
    setOpen(false);
    router.push(action.path);
    // Small delay to allow navigation then open modal
    setTimeout(() => onAction(action.key), 80);
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[80]"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-7 right-7 z-[90] flex flex-col items-end gap-2">
        {/* Sub-menu */}
        <div className={`flex flex-col gap-2 items-end transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
        }`}>
          {ACTIONS.map(action => (
            <button
              key={action.key}
              onClick={() => handleAction(action)}
              className="flex items-center gap-2.5 bg-bg-2 border border-border-2 px-3.5 py-2
                rounded-lg text-[12px] font-sans font-semibold text-text
                hover:border-[rgba(168,255,62,0.4)] hover:text-accent
                shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: action.color }} />
              {action.label}
            </button>
          ))}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-13 h-13 rounded-full bg-accent text-bg border-none cursor-pointer
            text-xl font-bold flex items-center justify-center
            shadow-[0_4px_20px_rgba(168,255,62,0.3)]
            hover:bg-[#bfff5c] hover:shadow-[0_6px_28px_rgba(168,255,62,0.4)]
            transition-all duration-200
            ${open ? "rotate-45" : "rotate-0"}`}
          style={{ width: 52, height: 52 }}
        >
          ＋
        </button>
      </div>
    </>
  );
}
