import React from "react";
import { Cpu } from "lucide-react";
import { StatusBadge } from "../atoms/StatusBadge";

interface DeviceListItemProps {
  name: string;
  mac: string;
  x: number;
  y: number;
  status: number | string;
  isActive: boolean;
  onClick: () => void;
}

export function DeviceListItem({
  name,
  mac,
  x,
  y,
  status,
  isActive,
  onClick,
}: DeviceListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative p-4 flex items-center justify-between border cursor-pointer transition-all duration-300 rounded-2xl ${
        isActive
          ? "bg-zinc-900 border-zinc-100 text-white shadow-md"
          : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden text-left">
        <div
          className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
            isActive
              ? "bg-zinc-800 border-zinc-700 text-white"
              : "bg-zinc-950 border-zinc-900 text-zinc-500 group-hover:text-zinc-300"
          }`}
        >
          <Cpu size={14} />
        </div>
        <div className="overflow-hidden">
          <h4
            className={`text-xs font-black uppercase tracking-tight truncate transition-colors ${isActive ? "text-white italic" : "text-zinc-300"}`}
          >
            {name || "Unnamed Tag"}
          </h4>
          <p className="text-[10px] font-mono text-zinc-500 font-bold tracking-wide mt-0.5 truncate">
            MAC: {mac}
          </p>
          <p className="text-[9px] font-mono font-medium text-zinc-400 mt-1">
            LOC:{" "}
            <span className="font-bold text-zinc-500">
              X:{Number(x).toFixed(1)}, Y:{Number(y).toFixed(1)}
            </span>
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
