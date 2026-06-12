import { Box, AlertTriangle } from "lucide-react";

export const StockBadge = ({ jumlah }: { jumlah: number }) => {
  const isLow = jumlah <= 5;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 font-mono font-black text-[11px] tracking-wider uppercase rounded-none ${
        isLow
          ? "bg-red-500 text-white border-zinc-950 dark:border-zinc-800"
          : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-950 dark:border-zinc-800"
      }`}
    >
      {isLow ? (
        <AlertTriangle size={12} className="shrink-0" />
      ) : (
        <Box size={12} className="shrink-0" />
      )}

      <span>{jumlah} UNIT</span>
    </div>
  );
};