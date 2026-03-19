type BadgeVariant = "category" | "account" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  category: "bg-[rgba(91,141,238,0.1)] text-[#8ab4f8] border-[rgba(91,141,238,0.2)]",
  account:  "bg-[rgba(168,255,62,0.06)] text-accent border-[rgba(168,255,62,0.15)]",
  default:  "bg-bg-4 text-text-3 border-border",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium border whitespace-nowrap ${styles[variant]}`}>
      {children}
    </span>
  );
}
