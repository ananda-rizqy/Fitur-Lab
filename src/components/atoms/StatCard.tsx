import React from "react";
import { Card, CardContent } from "../ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <Card
      variant="brutal"
      className={`active:translate-x-0.5! active:translate-y-0.5! active:shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]! dark:active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)]! ${className}`}
    >
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {label}
          </p>
          <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
            {value}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 shadow-xs">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
