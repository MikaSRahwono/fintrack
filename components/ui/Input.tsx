import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-[10px] font-medium text-text-3 tracking-[0.08em] uppercase">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          bg-bg-3 border border-border text-text
          px-3 py-2 rounded-md font-sans text-[13px]
          placeholder:text-text-3
          focus:outline-none focus:border-accent
          transition-colors duration-150
          w-full
          ${error ? "border-danger" : ""}
          ${className}
        `}
      />
      {error && <span className="text-danger text-[11px] font-mono">{error}</span>}
    </div>
  );
}
