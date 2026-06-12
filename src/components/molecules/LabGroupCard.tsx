import React from "react";
import { Card } from "../../components/ui/card";

interface LabGroupCardProps {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
}

export function LabGroupCard({
  name,
  icon: IconComponent,
  color,
  onClick,
}: LabGroupCardProps) {
  return (
    <Card
      onClick={onClick}
      variant="brutal"
      animate={true}
      className="group relative p-8 cursor-pointer text-center flex justify-center items-center flex-col select-none"
    >
      <div className="absolute inset-0 bg-linear-to-br from-zinc-50/0 to-zinc-100/0 group-hover:from-zinc-50/30 dark:group-hover:from-zinc-950/10 group-hover:to-zinc-100/20 dark:group-hover:to-zinc-950/20 transition-all duration-150 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`w-14 h-14 bg-linear-to-br ${color} flex items-center justify-center text-white mb-5 border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none group-hover:rotate-6 group-hover:translate-x-px group-hover:translate-y-px group-hover:shadow-none transition-all duration-150`}
        >
          <IconComponent
            size={22}
            className="group-hover:scale-110 transition-transform duration-150"
          />
        </div>

        <h3 className="text-xs font-mono font-black  tracking-widest text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 max-w-[180px] leading-relaxed">
          {name}
        </h3>

        <div className="w-0 h-0.5 bg-zinc-950 dark:bg-zinc-100 mt-3 group-hover:w-8 transition-all duration-150 " />
      </div>
    </Card>
  );
}
