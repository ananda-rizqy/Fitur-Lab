import { Card } from "../ui/card";
import {
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  CheckSquare,
} from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    menunggu: number;
    disetujui: number;
    berlangsung: number;
    selesai: number;
    ditolak: number;
  };
}

export function LoanStatsGrid({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            TOTAL AKTIF
          </span>
          <Layers size={14} className="text-zinc-400" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.total}
        </span>
      </Card>

      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            MENUNGGU
          </span>
          <Hourglass size={14} className="text-amber-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.menunggu}
        </span>
      </Card>

      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            DISETUJUI
          </span>
          <CheckSquare size={14} className="text-emerald-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.disetujui}
        </span>
      </Card>

      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            BERLANGSUNG
          </span>
          <Clock size={14} className="text-blue-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.berlangsung}
        </span>
      </Card>

      {/* CARD 5: SELESAI */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            SELESAI
          </span>
          <CheckCircle2 size={14} className="text-emerald-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.selesai}
        </span>
      </Card>

      {/* CARD 6: DITOLAK */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            DITOLAK
          </span>
          <XCircle size={14} className="text-red-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.ditolak}
        </span>
      </Card>
    </div>
  );
}
