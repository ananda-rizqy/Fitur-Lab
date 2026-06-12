import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Sparkles, RefreshCw, UserCheck } from "lucide-react";

interface Student {
  id: number;
  nama: string;
  nim: string;
}

interface RandomPickerCardProps {
  selected: Student | null;
  isPicking: boolean;
  onPick: () => void;
}

export function RandomPickerCard({
  selected,
  isPicking,
  onPick,
}: RandomPickerCardProps) {
  return (
    <Card variant="brutal" animate={false}>
      <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Sparkles size={16} className="text-zinc-400" />
          <CardTitle className="text-sm font-black tracking-widest font-mono text-zinc-900 dark:text-zinc-200">
            Pilih Acak Personel
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          Gunakan untuk menunjuk kuis kilat, responsi praktikum, atau urutan
          presentasi lab.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col justify-end pt-5">
        {/* TAMPILAN MAHASISWA TERPILIH */}
        {selected && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800  flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <div className="p-2.5 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 shrink-0 shadow-xs">
              <UserCheck size={16} />
            </div>
            <div className="overflow-hidden text-left">
              <span className="text-xs block font-black text-zinc-400 dark:text-zinc-500 tracking-widest  font-mono mb-0.5">
                Mahasiswa Terpilih
              </span>
              <p className="font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight truncate">
                {selected.nama}
              </p>
              <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold mt-0.5">
                {selected.nim}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={onPick}
          disabled={isPicking}
          className="w-full"
          variant="brutal"
        >
          {isPicking ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Mengacak Sistem...</span>
            </div>
          ) : (
            "Mulai Pilih Acak"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
