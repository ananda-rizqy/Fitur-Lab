import React from "react";

interface SettingSectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export function SectionHeader({ title, icon }: SettingSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
      <div className="text-zinc-400 dark:text-zinc-600 shrink-0">{icon}</div>
      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
        {title}
      </h2>
    </div>
  );
}
