import React from "react";

type Variant = "primary" | "ghost" | "danger" | "icon";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-bg font-semibold hover:bg-[#bfff5c] shadow-[0_0_0_0_rgba(168,255,62,0)] hover:shadow-[0_0_18px_rgba(168,255,62,0.25)]",
  ghost:   "bg-bg-3 text-text-2 border border-border hover:border-border-2 hover:text-text",
  danger:  "bg-[rgba(255,77,77,0.12)] text-danger border border-[rgba(255,77,77,0.2)] hover:bg-[rgba(255,77,77,0.2)]",
  icon:    "bg-transparent text-text-3 hover:bg-bg-4 hover:text-text",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2.5 py-1 text-[11px] rounded",
  md: "px-3.5 py-1.5 text-[12px] rounded-md",
};

export default function Button({
  variant = "ghost",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-1.5
        font-sans tracking-[0.02em] transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
