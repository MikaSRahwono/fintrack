interface EmptyStateProps {
  icon?: string;
  text: string;
  sub?: string;
}

export default function EmptyState({ icon = "◈", text, sub }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="text-center py-16 px-4">
          <div className="text-4xl mb-3 opacity-20">{icon}</div>
          <div className="font-sans text-[14px] text-text-3">{text}</div>
          {sub && <div className="font-mono text-[11px] text-text-3 opacity-70 mt-1.5">{sub}</div>}
        </div>
      </td>
    </tr>
  );
}
