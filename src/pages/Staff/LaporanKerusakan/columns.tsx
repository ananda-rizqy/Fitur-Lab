import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  Image as ImageIcon,
  Clock,
  User as UserIcon,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "../../../components/ui/separator";

// Helper untuk format tanggal & waktu
const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " •");
};

// Helper untuk membersihkan format tag array/string JSON
const parseTagList = (tagList: any): string => {
  if (!tagList) return "";
  try {
    if (Array.isArray(tagList)) {
      return tagList.join(", ");
    }
    if (typeof tagList === "string" && tagList.trim() !== "") {
      const parsed = JSON.parse(tagList);
      return Array.isArray(parsed) ? parsed.join(", ") : parsed;
    }
  } catch (e) {
    // Fallback jika string bukan JSON valid
  }
  return String(tagList).replace(/[\[\]"'\\]/g, "");
};

// Helper untuk mendapatkan URL gambar yang valid
const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://api.tugasakhirr.com/storage/${path.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

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
          {row.original.kelas_mahasiswa && (
            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
              KELAS: {row.original.kelas_mahasiswa}
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
      
      return (
        <div className="space-y-3 py-1 text-left">
          {details.map((item: any, idx: number) => {
            const displayTags = parseTagList(item.kode_tag_list);

            return (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="bg-white border-2 border-zinc-950 rounded-none px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-xs font-sans font-black text-zinc-900 w-fit uppercase">
                  {item.nama_item || "N/A"}{" "}
                  <span className="text-zinc-500 ml-1 font-mono">(x{item.qty})</span>
                </div>
                
                {displayTags && displayTags.trim() !== "" && (
                  <div className="flex items-center gap-1.5 bg-zinc-50 border-2 border-zinc-950 px-2 py-0.5 rounded-none w-fit shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
                    <Tag size={10} className="text-zinc-500 shrink-0" />
                    <span className="text-[10px] font-mono font-black text-zinc-800 tracking-wider uppercase">
                      {displayTags}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const images = [
        { url: getImageUrl(row.original.foto_before), label: "Before" },
        { url: getImageUrl(row.original.foto_after), label: "After" },
      ];

      return (
        <div className="flex gap-3 py-1 justify-start">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="h-12 w-20 rounded-none border-2 border-zinc-950 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] overflow-hidden shrink-0 relative group flex items-center justify-center" 
              onClick={() => img.url && setSelectedImg(img.url)}
              title={`Foto ${img.label}`}
            >
              {img.url ? (
                <>
                  <img 
                    src={img.url} 
                    className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                    alt={img.label} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/100x100/f4f4f5/a1a1aa?text=${img.label}+Error`;
                    }}
                  />
                  <div className="absolute bottom-0 left-0 bg-zinc-950 text-white text-[8px] px-1 font-mono font-bold uppercase opacity-90">
                    {img.label}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-300">
                  <ImageIcon size={13} />
                  <span className="text-[7px] font-mono font-bold uppercase mt-0.5">{img.label} Null</span>
                </div>
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
    cell: ({ row }) => (
      <div className="flex flex-col gap-3 min-w-[260px] p-4 bg-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 border-2 border-zinc-950 text-red-500 rounded-none shrink-0 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <AlertTriangle size={15} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-[9px] font-mono font-black tracking-widest text-red-600 uppercase">
              Kendala
            </span>
            <p className="text-xs font-sans font-bold text-zinc-900 leading-snug">
              {row.original.deskripsi_kerusakan || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
        <Separator className="bg-zinc-200 h-0.5" />
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
          <Clock size={11} />
          <span>Dilaporkan: {formatDateTime(row.original.waktu_selesai_aktual)}</span>
        </div>
      </div>
    ),
  },
];