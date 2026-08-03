import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  User as UserIcon,
  BookOpen,
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
    header: "Peminjam, Lab & Matkul",
    cell: ({ row }) => (
      <div className="flex items-start gap-3 py-1 text-left">
        <div className="h-8 w-8 rounded-none bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] shrink-0 mt-0.5">
          <UserIcon size={13} />
        </div>   
        <div className="space-y-1">
          <div>
            <div className="font-mono font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">
              {row.original.nama_mahasiswa || "N/A"}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
              NIM: {row.original.nim_mahasiswa || "---"}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
              KELAS: {row.original.kelas_mahasiswa || "N/A"}
            </div>
          </div>

          {/* Badge Ruangan Lab */}
          <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-500 font-black tracking-wide bg-emerald-50 px-1.5 py-0.5 w-fit border border-emerald-200">
            📍 {row.original.ruangan_lab || "Tidak ada lab"}
          </div>

          {/* 🌟 Informasi Mata Kuliah & Kode Matkul */}
          {row.original.nama_matkul && row.original.nama_matkul !== "-" && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-700 dark:text-blue-400 font-black tracking-wide bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 w-fit border border-blue-200 dark:border-blue-800">
              <BookOpen size={10} className="shrink-0" />
              <span>{row.original.nama_matkul} ({row.original.kode_matkul || "-"})</span>
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Informasi Alat",
    cell: ({ row }) => {
      const details = row.original.details || [];
      const tujuan = row.original.tujuan || "-";
      return (
        <div className="space-y-2 max-w-[220px] py-1 text-left">
          {/* Daftar Alat */}
          <div className="flex flex-wrap gap-1.5">
            {details.length > 0 ? (
              details.map((d: any, i: number) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]"
                >
                  <p className="text-xs font-sans font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                    {d.alat?.nama_alat || "Alat tidak bernama"}
                  </p>
                  <p className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 tracking-wide mt-0.5">
                    {d.alat?.kode_tag || "No tag"}
                  </p>
                </div>
              ))
            ) : (
              <span className="text-[10px] font-mono text-zinc-400">Tidak ada detail alat</span>
            )}
          </div>

          {/* Tujuan Penggunaan */}
          <div className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 p-2 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <MessageSquare size={12} className="text-zinc-500 mt-0.5 shrink-0" />
            <p className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 leading-tight break-all">
              {tujuan}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const getImageUrl = (path: string) => path;
      const images = [
        { url: row.original.foto_before ? getImageUrl(row.original.foto_before) : null, label: "Before" },
        { url: row.original.foto_after ? getImageUrl(row.original.foto_after) : null, label: "After" },
      ];
      return (
        <div className="flex gap-3 py-1 justify-start">
          {images.map((img, idx) => (
            <div key={idx} className="h-10 w-14 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] overflow-hidden shrink-0" onClick={() => img.url && setSelectedImg(img.url)}>
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
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const status = row.original.status || "Ongoing";
      const kondisi = row.original.kondisi_kembali;
      return (
        <div className="flex flex-col gap-2 items-start py-1 text-left">
          <Badge variant="outline" className="px-2 py-0.5 rounded-none border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] uppercase text-zinc-900">
            {status}
          </Badge>
          {kondisi && (
            <Badge variant="outline" className={`px-2 py-0.5 rounded-none border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] font-mono font-black text-[9px] uppercase ${kondisi.toLowerCase() === "rusak" ? "text-red-500" : "text-emerald-600"}`}>
              {kondisi.toLowerCase() === "rusak" ? "✗ Rusak" : "✓ Baik"}
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
      const inTime = row.original.waktu_pinjam ? new Date(row.original.waktu_pinjam).toLocaleString("id-ID") : "-";
      const outTime = row.original.waktu_selesai_aktual 
        ? new Date(row.original.waktu_selesai_aktual).toLocaleString("id-ID") 
        : "Pending";
      return (
        <div className="flex flex-col gap-2 min-w-[140px] py-1 text-left">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <div className="flex flex-col"><span className="text-[8px] font-mono font-black text-emerald-600 uppercase">Check-in</span><span className="text-[10px] font-mono font-bold text-zinc-700">{inTime}</span></div>
            <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 border-zinc-950 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <div className="flex flex-col"><span className="text-[8px] font-mono font-black text-zinc-400 uppercase">Check-out</span><span className="text-[10px] font-mono font-bold text-zinc-700">{outTime}</span></div>
            <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
          </div>
        </div>
      );
    },
  },
]; 