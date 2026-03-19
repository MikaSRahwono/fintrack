"use client";

import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, icon, children, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,5,8,0.85)] backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-bg-2 border border-border-2 rounded-lg w-full ${maxWidth} mx-4 p-6 relative animate-slide-up max-h-[90vh] overflow-y-auto`}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-md bg-bg-3 border border-border text-text-3
            flex items-center justify-center text-sm hover:border-danger hover:text-danger transition-all"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="font-sans font-bold text-[15px] text-text mb-5 flex items-center gap-2">
          {icon && <span className="text-accent">{icon}</span>}
          {title}
        </h2>

        {children}
      </div>
    </div>
  );
}
