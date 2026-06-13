import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  MessageSquare, 
  Image as ImageIcon,
  Clock,
  User as UserIcon,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "../../../components/ui/separator";

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
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
            KELAS: {row.original.kelas_mahasiswa || "N/A"}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "nama_alat",
    header: "Informasi Alat",
    cell: ({ row }) => (
      <div className="space-y-2 py-1 text-left">
        <div className="bg-white border-2 border-zinc-950 rounded-none px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-xs font-sans font-black text-zinc-900 w-fit">
          {row.original.nama_alat || "N/A"}
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-50 border-2 border-zinc-950 px-2 py-0.5 rounded-none w-fit shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
          <Tag size={10} className="text-zinc-500" />
          <span className="text-[10px] font-mono font-black text-zinc-800 tracking-wider">
            {row.original.kode_tag || "No tag"}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://api.tugasakhirr.com/uploads/${path.replace(/\\/g, "/")}`;
  };

  const images = [
    { url: getImageUrl(row.original.foto_before), label: "Before" },
    { url: getImageUrl(row.original.foto_after), label: "After" },
  ];

      return (
        <div className="flex gap-3 py-1 justify-start">
          {images.map((img, idx) => (
            <div key={idx} className="h-12 w-20 rounded-none border-2 border-zinc-950 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] overflow-hidden shrink-0" onClick={() => img.url && setSelectedImg(img.url)}>
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
    accessorKey: "detail_kerusakan",
    header: "Detail Kerusakan",
    cell: ({ row }) => {
      const formatDateTime = (dateString: any) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", " •");
      };

      return (
        <div className="flex flex-col gap-3 min-w-[260px] p-4 bg-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 border-2 border-zinc-950 text-red-500 rounded-none shrink-0 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              <AlertTriangle size={15} />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[9px] font-mono font-black tracking-widest text-red-600 uppercase">Kendala</span>
              <p className="text-xs font-sans font-bold text-zinc-900 leading-snug">{row.original.deskripsi_kerusakan || "Tidak ada deskripsi"}</p>
            </div>
          </div>
          <Separator className="bg-zinc-200 h-0.5" />
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
            <Clock size={11} />
            <span>Dilaporkan: {formatDateTime(row.original.waktu_kembali)}</span>
          </div>
        </div>
      );
    },
  },
];