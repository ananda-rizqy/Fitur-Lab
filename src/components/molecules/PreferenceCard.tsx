import React from "react";
import { Card, CardContent } from "../ui/card";

interface PreferenceCardProps {
  title: string;
  description: string;
  actionElement: React.ReactNode;
}

export function PreferenceCard({
  title,
  description,
  actionElement,
}: PreferenceCardProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 rounded-2xl transition-colors duration-200 shadow-xs group relative overflow-hidden">
      <CardContent className="p-5 flex items-center justify-between gap-4 text-left">
        <div>
          <p className="font-black text-xs uppercase tracking-tight text-zinc-800 dark:text-zinc-200">
            {title}
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium leading-relaxed">
            {description}
          </p>
        </div>
        <div className="shrink-0 relative z-10">{actionElement}</div>
      </CardContent>
    </Card>
  );
}
