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
        className="text-[10px] font-mono font-black tracking-wider text-zinc-400 hover:text-zinc-900 rounded-none transition-all"
      >
        ID <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-black text-zinc-400 ml-3">
        #{row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "nama_mahasiswa",
    header: "Peminjam",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1 text-left">
        <div className="h-8 w-8 rounded-none bg-zinc-50 flex items-center justify-center text-zinc-900 border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] shrink-0">
          <UserIcon size={13} />
        </div>
        <div>
          <div className="font-mono font-black text-zinc-900 text-xs tracking-tight">
            {row.original.nama_mahasiswa || "N/A"}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 font-bold tracking-wide mt-0.5">
            NIM: {row.original.nim_mahasiswa || "---"}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 font-bold tracking-wide mt-0.5">
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
        <div className="bg-white border-2 border-zinc-950 rounded-none px-2.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-xs font-sans font-black text-zinc-900 leading-tight">
          {row.original.laboratorium || "N/A"}
        </div>
        {row.original.keperluan && (
          <div className="flex items-start gap-1.5 text-[10px] font-sans font-medium text-zinc-500 bg-zinc-50 p-2 border-2 border-dashed border-zinc-200 rounded-none">
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
            <div key={idx} className="h-10 w-14 rounded-none border-2 border-zinc-950 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] overflow-hidden shrink-0" onClick={() => img.url && setSelectedImg(img.url)}>
              {img.url ? (
                <img src={img.url} className="h-full w-full object-cover" alt={img.label} loading="lazy" />
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
    accessorKey: "kondisi_masuk",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const isSelesai = row.original.kondisi_keluar !== "SEDANG DIGUNAKAN" && row.original.kondisi_keluar !== "-";
      return (
        <div className="flex flex-col gap-2 items-start py-1 text-left">
          <Badge variant="outline" className={`px-2 py-0.5 rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] uppercase ${isSelesai ? "text-zinc-500 border-zinc-950" : "text-amber-600 border-zinc-950 animate-pulse"}`}>
            <Circle size={6} className="mr-1.5 fill-current" /> {isSelesai ? "Selesai" : "Ongoing"}
          </Badge>
          <div className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
            IN: <span className={row.original.kondisi_masuk === "Bersih" ? "text-emerald-600" : "text-red-500"}>{row.original.kondisi_masuk}</span>
          </div>
          {row.original.kondisi_keluar !== "SEDANG DIGUNAKAN" && row.original.kondisi_keluar !== "-" && (
            <Badge variant="outline" className="px-2 py-0.5 rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] text-emerald-600 border-zinc-950">
              OUT: ✓ {row.original.kondisi_keluar}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "timeline",
    header: "Timeline",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 min-w-[140px] py-1 text-left">
        <div className="flex items-center justify-between bg-white p-2 border-2 border-zinc-950 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono font-black text-emerald-600 uppercase">In</span>
            <span className="text-[10px] font-mono font-bold text-zinc-700">{row.original.waktu_masuk}</span>
          </div>
          <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
        </div>
        <div className="flex items-center justify-between bg-white p-2 border-2 border-zinc-950 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono font-black text-zinc-400 uppercase">Out</span>
            <span className="text-[10px] font-mono font-bold text-zinc-700">{row.original.waktu_keluar}</span>
          </div>
          <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
        </div>
      </div>
    ),
  },
];