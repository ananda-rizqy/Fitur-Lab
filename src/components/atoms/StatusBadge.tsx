import React from "react";

interface StatusBadgeProps {
  status: number | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isOnline = Number(status) === 1;
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[9px] font-black uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`}
      />
      {isOnline ? "100" : "OFF"}
    </div>
  );
}
