"use client";

import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, message = "Yakin mau dihapus?", onConfirm, onCancel
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(5,5,8,0.85)] backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-2 border border-border-2 rounded-lg w-full max-w-sm mx-4 p-6 animate-slide-up">
        <h3 className="font-sans font-bold text-[15px] text-text mb-2">Konfirmasi Hapus</h3>
        <p className="text-[13px] text-text-2 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Batal</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </div>
  );
}
