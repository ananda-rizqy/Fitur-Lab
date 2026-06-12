import { Card } from "../ui/card";
import { Layers, CheckCircle2, ThumbsUp, AlertTriangle } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    ongoing: number;
    baik: number;
    rusak: number;
  };
}

export function StatsSummaryGrid({ stats }: StatsProps) {
  return (
    // Menggunakan 4 kolom di layar besar agar layout pas dan padat
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 w-full">
      {/* CARD 1: TOTAL RIWAYAT */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            TOTAL RIWAYAT
          </span>
          <Layers size={14} className="text-zinc-400" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.total}
        </span>
      </Card>

      {/* CARD 2: BERLANGSUNG */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            BERLANGSUNG
          </span>
          {/* Mengganti icon jika perlu, atau tetap menggunakan CheckCircle2 sesuai preferensi */}
          <CheckCircle2 size={14} className="text-blue-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.ongoing}
        </span>
      </Card>

      {/* CARD 3: KONDISI BAIK */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            KONDISI BAIK
          </span>
          <ThumbsUp size={14} className="text-emerald-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.baik}
        </span>
      </Card>

      {/* CARD 4: RUSAK / PERBAIKAN */}
      <Card
        variant="brutal"
        className="p-4 flex flex-col justify-between min-h-[100px] bg-white dark:bg-zinc-900 rounded-none shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-wider">
            RUSAK / PERBAIKAN
          </span>
          <AlertTriangle size={14} className="text-red-500" />
        </div>
        <span className="text-2xl font-mono font-black mt-2 text-zinc-900 dark:text-zinc-50">
          {stats.rusak}
        </span>
      </Card>
    </div>
  );
}
