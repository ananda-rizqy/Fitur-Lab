import { Card } from "../ui/card";
import { Layers, CheckCircle2, ThumbsUp, AlertTriangle } from "lucide-react";

interface InventoryStatsProps {
  stats: {
    total: number;
    layak: number;
    rusak: number;
    volume: number;
  };
}

export function InventorySummaryGrid({ stats }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 w-full">
      {/* TOTAL KATALOG */}
      <Card variant="brutal" className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">TOTAL KATALOG</span>
          <Layers size={14} className="text-zinc-400" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">{stats.total} Model</span>
      </Card>

      {/* KONDISI LAYAK */}
      <Card variant="brutal" className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">KONDISI LAYAK</span>
          <CheckCircle2 size={14} className="text-emerald-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">{stats.layak} Alat</span>
      </Card>

      {/* KONDISI RUSAK */}
      <Card variant="brutal" className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">KONDISI RUSAK</span>
          <AlertTriangle size={14} className="text-orange-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">{stats.rusak} Alat</span>
      </Card>

      {/* TOTAL VOLUME */}
      <Card variant="brutal" className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]">
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">TOTAL VOLUME</span>
          <Layers size={14} className="text-purple-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">{stats.volume} Pcs</span>
      </Card>
    </div>
  );
}