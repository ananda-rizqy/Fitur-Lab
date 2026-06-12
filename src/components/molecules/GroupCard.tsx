import React from "react";
import { Badge } from "../ui/badge";

interface Student {
  id: number;
  nama: string;
  nim: string;
}

interface GroupCardProps {
  index: number;
  members: Student[];
}

export function GroupCard({ index, members }: GroupCardProps) {
  return (
    <div className="bg-zinc-50/60 dark:bg-zinc-900/30 p-4 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl space-y-2 text-left">
      <div className="flex justify-between items-center border-b border-zinc-200/50 dark:border-zinc-800/50 pb-1.5">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-mono">
          Group {index + 1}
        </h3>
        <Badge
          variant="outline"
          className="text-[9px] px-1.5 py-0 font-mono font-black border-zinc-300 bg-white text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 rounded-md"
        >
          {members.length} Mhs
        </Badge>
      </div>
      <ul className="space-y-1 font-medium text-xs text-zinc-600 dark:text-zinc-400">
        {members.map((student, sIdx) => (
          <li
            key={student.id}
            className="truncate pb-0.5 border-b border-dashed border-zinc-200/40 dark:border-zinc-800/40 last:border-0"
          >
            <span className="font-mono text-zinc-400 text-[10px] mr-0.5">
              {sIdx + 1}.
            </span>{" "}
            <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-tight text-[11px]">
              {student.nama}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
