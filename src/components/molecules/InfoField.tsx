import React from "react";

interface InfoFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isMono?: boolean;
  className?: string;
}

export function InfoField({
  label,
  value,
  icon,
  isMono = false,
  className = "",
}: InfoFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
        {icon && <div className="shrink-0">{icon}</div>}
        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={`text-zinc-900 dark:text-zinc-100 tracking-tight ${
          isMono
            ? "font-mono font-bold text-xs"
            : "font-black text-xs uppercase italic"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}
