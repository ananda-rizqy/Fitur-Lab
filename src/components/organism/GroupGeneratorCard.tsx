import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GroupCard } from "../molecules/GroupCard";
import { Layers, Loader2 } from "lucide-react";

interface Student {
  id: number;
  nama: string;
  nim: string;
}

interface GroupGeneratorCardProps {
  groupCount: number;
  setGroupCount: (count: number) => void;
  groups: Student[][];
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GroupGeneratorCard({
  groupCount,
  setGroupCount,
  groups,
  isGenerating,
  onGenerate,
}: GroupGeneratorCardProps) {
  return (
    <Card variant="brutal" animate={false}>
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Layers size={16} className="text-zinc-400" />
          <CardTitle className="text-sm font-black tracking-widest font-mono text-zinc-800 dark:text-zinc-200">
            Pembagian Kelompok
          </CardTitle>
        </div>
        <CardDescription className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
          Bagi rata seluruh anggota kelas ke dalam kluster kelompok belajar
          secara adil dan acak.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* TOOLBAR PANEL INPUT */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 sm:max-w-[150px]">
            <span className="absolute left-3.5 top-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Slot:
            </span>
            <Input
              type="number"
              min={1}
              // 👑 FIX UX: Mencegah nilai input menjadi string kosong atau NaN saat dihapus total
              value={groupCount || ""}
              onChange={(e) => {
                const val = e.target.value;
                setGroupCount(val === "" ? 0 : Math.max(1, Number(val)));
              }}
              className="pl-14 pr-3 font-mono font-black text-xs h-11  border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors"
            />
          </div>

          <Button
            onClick={onGenerate}
            disabled={isGenerating || !groupCount}
            className="flex-1 h-11"
            variant="brutal"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Memproses Acak Kluster...</span>
              </>
            ) : (
              "Bentuk Kelompok"
            )}
          </Button>
        </div>

        {/* HASIL RENDER DATA KELOMPOK */}
        {groups.length > 0 && (
          <div className="space-y-2 pt-4 border-t-2 border-zinc-100 dark:border-zinc-800/60 animate-in fade-in duration-300">
            <h4 className="text-sm font-mono font-black  tracking-widest text-zinc-900 dark:text-zinc-500 text-left px-1">
              Kluster Terbentuk ({groups.length} Kelompok)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {groups.map((group, idx) => (
                <GroupCard key={idx} index={idx} members={group} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
