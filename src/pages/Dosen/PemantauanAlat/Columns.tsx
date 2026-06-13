import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, Wrench, User as UserIcon } from "lucide-react";

const getImageUrl = (path: string) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `https://api.tugasakhirr.com/storage/${path}`;
};

export const getColumns = (setSelectedImg: (url: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[10px] font-mono font-black text-zinc-400">
        ID <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-black text-zinc-400 ml-3">#{row.original.id}</span>,
  },
  {
    accessorKey: "nama_mahasiswa",
    header: "Peminjam",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="h-8 w-8 rounded-none bg-zinc-50 flex items-center justify-center border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
          <UserIcon size={13} />
        </div>
        <div className="text-left">
          <div className="font-mono font-black text-xs">{row.original.nama_mahasiswa || "N/A"}</div>
          <div className="text-[10px] text-zinc-400 font-bold">NIM: {row.original.nim_mahasiswa || "-"}</div>
          <div className="text-[10px] text-zinc-500 italic">Tujuan: {row.original.tujuan_penggunaan}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Detail Alat & Kode Tag",
    cell: ({ row }) => (
      <div className="space-y-1 py-1 text-left">
        {row.original.details?.map((d: any, i: number) => (
          <div key={i} className="bg-white border-2 border-zinc-950 rounded-none px-2 py-1 text-[10px] font-sans">
            <div className="font-black"><Wrench size={10} className="inline mr-1" /> {d.alat?.nama_alat || "Alat"} ({d.jumlah_pinjam})</div>
            <div className="text-zinc-500 italic">Tag: {d.alat?.kode_tag || "-"}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const imgBefore = getImageUrl(row.original.foto_before);
      const imgAfter = getImageUrl(row.original.foto_after);
      return (
        <div className="flex gap-2">
          {row.original.foto_before && (
            <div className="h-10 w-10 border-2 border-zinc-950 cursor-pointer overflow-hidden" onClick={() => setSelectedImg(imgBefore)}>
              <img src={imgBefore} className="h-full w-full object-cover" alt="Before" />
            </div>
          )}
          {row.original.foto_after && (
            <div className="h-10 w-10 border-2 border-zinc-950 cursor-pointer overflow-hidden" onClick={() => setSelectedImg(imgAfter)}>
              <img src={imgAfter} className="h-full w-full object-cover" alt="After" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status & Penerima",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 items-start text-left">
        <Badge variant="outline" className="font-mono font-black text-[9px] uppercase border-2">{row.original.status}</Badge>
        <div className="text-[9px] font-bold text-zinc-500 uppercase">Kondisi: {row.original.kondisi_kembali || "-"}</div>
        <div className="text-[9px] text-zinc-500">
          Penerima: {row.original.penerima?.name ? (
            <span className="font-bold text-zinc-900">{row.original.penerima.name}</span>
          ) : (
            <span className="text-amber-600 font-bold">BY SISTEM</span>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "waktu_pinjam",
    header: "Timeline",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 text-[10px] font-mono text-left">
        <div className="flex items-center gap-1.5 text-zinc-900">
          <span className="font-bold">Pinjam:</span>
          {row.original.waktu_pinjam ? new Date(row.original.waktu_pinjam).toLocaleString('id-ID', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
          }) : "-"}
        </div>
        <div className="flex items-center gap-1.5 text-zinc-500">
          <span className="font-bold">Kembali:</span>
          {row.original.waktu_kembali ? new Date(row.original.waktu_kembali).toLocaleString('id-ID', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
          }) : <span className="italic">Belum kembali</span>}
        </div>
      </div>
    ),
  },
];