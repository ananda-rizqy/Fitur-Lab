import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  User as UserIcon,
  Circle, 
} from "lucide-react";

export const getColumns = (
  setSelectedImg: (url: string) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-mono font-black tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-none transition-all"
      >
        ID <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-black text-zinc-400 dark:text-zinc-500 ml-3">
        #{row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "nama_mahasiswa",
    header: "Peminjam",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1 text-left">
        <div className="h-8 w-8 rounded-none bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] shrink-0">
          <UserIcon size={13} />
        </div>
        <div>
          <div className="font-mono font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">
            {row.original.nama_mahasiswa || "N/A"}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
            NIM: {row.original.nim_nip || "---"}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
            KELAS: {row.original.kelas_mahasiswa || "N/A"}
            </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "laboratorium",
    header: "Lab & Keperluan",
    cell: ({ row }) => (
      <div className="space-y-2 max-w-[220px] py-1 text-left">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none px-2.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-xs font-sans font-black text-zinc-900 dark:text-zinc-100 leading-tight">
          {row.original.laboratorium || "N/A"}
        </div>
        {row.original.keperluan && (
          <div className="flex items-start gap-1.5 text-[10px] font-sans font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 p-2 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-none">
            <MessageSquare size={11} className="mt-0.5 text-zinc-400 shrink-0" />
            <span className="line-clamp-2">"{row.original.keperluan}"</span>
          </div>
        )}
      </div>
    ),
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const images = [
        { url: row.original.foto_before, label: "Before" },
        { url: row.original.foto_after, label: "After" },
      ];
      return (
        <div className="flex gap-3 py-1 justify-start">
          {images.map((img, idx) => (
            <div key={idx} className="h-10 w-14 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] overflow-hidden shrink-0" onClick={() => img.url && setSelectedImg(img.url)}>
              {img.url ? (
                <img src={img.url} className="h-full w-full object-cover transition-all" alt={img.label} loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400"><ImageIcon size={13} /></div>
              )}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const hasCheckedOut = !!row.original.waktu_keluar;
      const status = hasCheckedOut ? "Selesai" : (row.original.status || "Ongoing");
      const isSelesai = status.toLowerCase() === "selesai";

      const kondisiMasuk = row.original.kondisi_masuk;
      const kondisiKeluar = row.original.kondisi_keluar;

      return (
        <div className="flex flex-col gap-2 items-start py-1 text-left">
          {/* Status Utama */}
          <Badge variant="outline" className={`px-2 py-0.5 rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] uppercase ${isSelesai ? "text-zinc-500 border-zinc-950" : "text-amber-600 border-zinc-950 animate-pulse"}`}>
            <Circle size={6} className="mr-1.5 fill-current" /> {status}
          </Badge>

          {/* Kondisi Masuk */}
          {kondisiMasuk && (
            <div className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              IN: <span className={kondisiMasuk.toLowerCase() === "bersih" ? "text-emerald-600" : "text-red-500"}>
                {kondisiMasuk}
              </span>
            </div>
          )}

          {/* Kondisi Keluar */}
          {kondisiKeluar && (
            <Badge variant="outline" className={`px-2 py-0.5 rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] uppercase ${kondisiKeluar.toLowerCase() === "bersih" ? "text-emerald-600 border-zinc-950" : "text-red-500 border-zinc-950"}`}>
              {kondisiKeluar.toLowerCase() === "bersih" ? `OUT: ✓ ${kondisiKeluar}` : `OUT: ✗ ${kondisiKeluar}`}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "timeline",
    header: "Timeline",
    cell: ({ row }) => {
      const formatTime = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        
        return `${d}/${m}/${y}, ${hh}.${mm}`;
      };

      const inTime = formatTime(row.original.waktu_masuk);
      const outTime = formatTime(row.original.waktu_keluar);

      return (
        <div className="flex flex-col gap-2 min-w-[140px] py-1 text-left">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-black text-emerald-600 uppercase">Check-in</span>
              <span className="text-[10px] font-mono font-bold text-zinc-700">{inTime || "-"}</span>
            </div>
            <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
          </div>
          <div className={`flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] ${row.original.waktu_keluar ? "border-zinc-950" : "border-dashed border-zinc-300"}`}>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-black text-zinc-400 uppercase">Check-out</span>
              <span className="text-[10px] font-mono font-bold text-zinc-700">{outTime || "Pending"}</span>
            </div>
            <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
          </div>
        </div>
      );
    },
  },
];