"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

let externalToast: ((msg: string, type?: ToastType) => void) | null = null;

export function useToast() {
  return useContext(ToastContext);
}

// Standalone trigger (can be called outside React tree if needed)
export function showToast(msg: string, type: ToastType = "success") {
  externalToast?.(msg, type);
}

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++counterRef.current;
    setItems(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  externalToast = toast;

  const dotColor = (type: ToastType) => {
    if (type === "success") return "bg-accent";
    if (type === "error") return "bg-danger";
    return "bg-blue";
  };

  const borderColor = (type: ToastType) => {
    if (type === "success") return "border-accent/30";
    if (type === "error") return "border-danger/30";
    return "border-blue/30";
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-24 right-7 z-[9999] flex flex-col gap-2 pointer-events-none">
        {items.map(item => (
          <div
            key={item.id}
            className={`toast-enter flex items-center gap-2.5 bg-bg-3 border ${borderColor(item.type)}
              px-4 py-2.5 rounded-lg text-[12px] text-text font-sans
              shadow-[0_4px_20px_rgba(0,0,0,0.4)] max-w-[280px]`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor(item.type)}`} />
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
