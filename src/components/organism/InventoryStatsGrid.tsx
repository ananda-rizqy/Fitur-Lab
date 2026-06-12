import { StatCard } from "../../components/molecules/StatCard";
import { Archive, CheckCircle, AlertTriangle, Layers } from "lucide-react";

interface InventoryStatsGridProps {
  total: number;
  baik: number;
  rusak: number;
  totalUnit: number;
}

export function InventoryStatsGrid({
  total,
  baik,
  rusak,
  totalUnit,
}: InventoryStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Total Item"
        value={total}
        icon={<Archive size={18} />}
        color="text-zinc-900 dark:text-zinc-100"
      />
      <StatCard
        title="Kondisi Baik"
        value={baik}
        icon={<CheckCircle size={18} />}
        color="text-zinc-900 dark:text-zinc-100"
      />
      <StatCard
        title="Kondisi Rusak"
        value={rusak}
        icon={<AlertTriangle size={18} />}
        color="text-zinc-900 dark:text-zinc-100"
      />
      <StatCard
        title="Total Unit"
        value={totalUnit}
        icon={<Layers size={18} />}
        color="text-zinc-900 dark:text-zinc-100"
      />
    </div>
  );
}
