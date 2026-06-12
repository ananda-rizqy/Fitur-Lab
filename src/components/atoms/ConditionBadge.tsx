import { Badge } from "../ui/badge";

export const ConditionBadge = ({
  kondisi,
  isConsumable,
}: {
  kondisi: string;
  isConsumable: boolean;
}) => {
  const currentCondition = isConsumable ? "Baik" : kondisi || "Baik";

  const isBaik =
    currentCondition.toLowerCase().trim() === "baik";

  const isRusak =
    currentCondition.toLowerCase().trim() === "rusak";

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1 border-2 rounded-none font-mono font-black text-[10px] tracking-widest uppercase shadow-none ${
        isBaik
          ? "bg-emerald-500 text-white border-zinc-950 dark:border-zinc-800"
          : isRusak
            ? "bg-red-500 text-white border-zinc-950 dark:border-zinc-800"
            : "bg-amber-400 text-zinc-950 border-zinc-950 dark:border-zinc-800"
      }`}
    >
      {currentCondition}
    </Badge>
  );
};