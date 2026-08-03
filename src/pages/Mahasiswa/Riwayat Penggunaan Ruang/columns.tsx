import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Image, Clock, Calendar } from "lucide-react";

export const getColumns = (
  setSelectedImg: (url: string | null) => void,
): ColumnDef<any>[] => [
  {
    header: "Laboratorium",
    cell: ({ row }) => (
      <div className="py-1 text-left">
        <div className="font-sans font-black text-zinc-800 dark:text-zinc-200 text-xs">
          {row.original.laboratorium}
        </div>
        <div className="text-[10px] font-sans text-zinc-400 dark:text-zinc-500 truncate max-w-40 mt-0.5 font-medium">
          {row.original.keperluan}
        </div>
      </div>
    ),
  },
  {
    header: "Estimasi Jadwal",
    cell: ({ row }) => (
      <div className="py-1 text-left space-y-0.5 font-mono text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <Calendar size={11} className="text-zinc-400 shrink-0" />
          <span>Mulai: {row.original.waktu_mulai || "-"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={11} className="text-zinc-400 shrink-0" />
          <span>Selesai: {row.original.waktu_selesai || "-"}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Waktu Aktual (CI / CO)",
    cell: ({ row }) => (
      <div className="py-1 text-left space-y-0.5 font-mono text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-emerald-600 shrink-0" />
          <span>In: {row.original.waktu_masuk || "-"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-emerald-600 shrink-0" />
          <span>Out: {row.original.waktu_keluar || "-"}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Bukti Foto",
    cell: ({ row }) => {
      const cleanImgBefore = row.original.foto_before
        ? row.original.foto_before.replace(/\\/g, "")
        : null;
      const cleanImgAfter = row.original.foto_after
        ? row.original.foto_after.replace(/\\/g, "")
        : null;

      return (
        <div className="flex items-center gap-2 py-1 justify-start">
          {cleanImgBefore ? (
            <div
              onClick={() => setSelectedImg(cleanImgBefore)}
              className="h-9 w-14 rounded-none overflow-hidden border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer transition-all relative group shrink-0"
            >
              <img
                src={cleanImgBefore}
                alt="Before"
                className="w-full h-full object-cover transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-white font-mono font-black tracking-wider">
                  In
                </span>
              </div>
            </div>
          ) : (
            <div className="h-9 w-14 rounded-none border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Image size={12} />
            </div>
          )}

          {cleanImgAfter ? (
            <div
              onClick={() => setSelectedImg(cleanImgAfter)}
              className="h-9 w-14 rounded-none overflow-hidden border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer transition-all relative group shrink-0"
            >
              <img
                src={cleanImgAfter}
                alt="After"
                className="w-full h-full object-cover transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] text-white font-mono font-black tracking-wider">
                  Out
                </span>
              </div>
            </div>
          ) : (
            <div className="h-9 w-14 rounded-none border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
              <Image size={12} />
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Kondisi (In / Out)",
    cell: ({ row }) => {
      const kondisiMasuk = row.original.kondisi_masuk || "-";
      const kondisiKeluar = row.original.kondisi_keluar || "-";

      const isMasukClean = kondisiMasuk.toLowerCase() === "bersih";
      const isKeluarClean = kondisiKeluar.toLowerCase() === "bersih";

      return (
        <div className="flex items-center gap-1.5 py-1 justify-start">
          <Badge
            variant="outline"
            className={`font-mono font-black text-xs px-2 py-0.5 rounded-none border-2 shadow-none ${
              isMasukClean
                ? "bg-white dark:bg-zinc-900 text-emerald-600 border-zinc-950 dark:border-zinc-800"
                : "bg-white dark:bg-zinc-900 text-amber-600 border-zinc-950 dark:border-zinc-800"
            }`}
          >
            In: {kondisiMasuk}
          </Badge>

          <Badge
            variant="outline"
            className={`font-mono font-black text-xs px-2 py-0.5 rounded-none border-2 shadow-none ${
              isKeluarClean
                ? "bg-white dark:bg-zinc-900 text-emerald-600 border-zinc-950 dark:border-zinc-800"
                : "bg-white dark:bg-zinc-900 text-amber-600 border-zinc-950 dark:border-zinc-800"
            }`}
          >
            Out: {kondisiKeluar}
          </Badge>
        </div>
      );
    },
  },
];