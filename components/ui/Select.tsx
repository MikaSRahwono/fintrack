import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly string[] | string[];
  error?: string;
}

export default function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-mono text-[10px] font-medium text-text-3 tracking-[0.08em] uppercase">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          bg-bg-3 border border-border text-text
          px-3 py-2 rounded-md font-sans text-[13px]
          focus:outline-none focus:border-accent
          transition-colors duration-150
          w-full cursor-pointer
          ${error ? "border-danger" : ""}
          ${className}
        `}
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-bg-3">
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-danger text-[11px] font-mono">{error}</span>}
    </div>
  );
}
