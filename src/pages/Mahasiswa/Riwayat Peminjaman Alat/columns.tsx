import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, MessageSquare, ImageIcon, MapPin, BookOpen} from "lucide-react";

// 🌟 Fungsi untuk memetakan ID status menjadi label teks yang sesuai
const getStatusLabel = (statusId: number) => {
  switch (Number(statusId)) {
    case 1: return "Pending";
    case 2: return "Disetujui";
    case 3: return "Ditolak";
    case 4: return "Selesai";
    case 5: return "Berlangsung";
    case 6: return "Menunggu Pengecekan";
    default: return "Unknown";
  }
};

// 🌟 Fungsi untuk memetakan ID ruangan lab menjadi nama ruangan
const getRuanganLabName = (ruanganId: number | null) => {
  if (!ruanganId) return "Tidak Ditentukan";
  switch (Number(ruanganId)) {
    case 1: return "Lab. TK Barat I/01";
    case 2: return "Lab. TK Barat I/02";
    case 3: return "Lab. TK Barat I/04";
    case 4: return "Lab. TK Timur I/01";
    case 5: return "Lab. TK Timur I/02";
    case 6: return "Lab. TK Timur II/01";
    default: return `Lab ID #${ruanganId}`;
  }
};
 
export const getColumns = (
  setSelectedImg: (url: string) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[10px] font-bold uppercase whitespace-nowrap px-2">
        ID <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-black whitespace-nowrap">#{row.getValue("id")}</span>,
  },
  {
    accessorKey: "details",
    header: "Informasi Alat, Lab & Matkul",
    cell: ({ row }) => {
      const details = row.original.details || [];
      const ruanganName = getRuanganLabName(row.original.ruangan_lab_id);
      const namaMatkul = row.original.nama_matkul;
      const kodeMatkul = row.original.kode_matkul;

      return (
        <div className="space-y-2 min-w-[180px] md:min-w-[250px] whitespace-normal">
          {/* Daftar Alat */}
          <div className="flex flex-wrap gap-1.5">
            {details.map((d: any, i: number) => (
              <div key={i} className="border-2 border-zinc-900 px-2 py-1 shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] bg-white max-w-full">
                <p className="text-[10px] font-black uppercase truncate">{d.alat?.nama_alat}</p>
                <p className="text-[9px] font-mono font-bold text-zinc-500 truncate">{d.alat?.kode_tag}</p>
              </div>
            ))}
          </div>

          {/* Tujuan Penggunaan */}
          <div className="flex items-start gap-1.5 text-[10px] font-mono border-2 border-zinc-900 p-1.5 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] w-full">
            <MessageSquare size={12} className="shrink-0 mt-0.5" />
            <span className="break-words line-clamp-3 sm:line-clamp-none leading-tight">{row.original.tujuan}</span>
          </div>

          {/* Lokasi Ruangan Lab */}
          <div className="flex items-start gap-1.5 text-[10px] font-mono border-2 border-zinc-900 p-1.5 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] w-full">
            <MapPin size={12} className="shrink-0 mt-0.5" />
            <span className="font-bold break-words leading-tight">{ruanganName}</span>
          </div>

          {/* 🌟 Informasi Mata Kuliah & Kode Matkul */}
          {namaMatkul && namaMatkul !== "-" && (
            <div className="flex items-start gap-1.5 text-[10px] font-mono border-2 border-zinc-900 p-1.5 bg-blue-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] w-full text-blue-900">
              <BookOpen size={12} className="shrink-0 mt-0.5 text-blue-700" />
              <span className="font-black break-words leading-tight">
                {namaMatkul} {kodeMatkul && kodeMatkul !== "-" ? `(${kodeMatkul})` : ""}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const renderImg = (src: string | null) => src ? (
        <img 
          src={src} 
          className="h-12 w-12 sm:h-14 sm:w-14 object-cover border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] cursor-pointer hover:scale-105 transition-transform shrink-0" 
          onClick={() => setSelectedImg(src)} 
        />
      ) : (
        <div className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-dashed border-zinc-400 flex items-center justify-center bg-zinc-50 shrink-0">
          <ImageIcon size={18} className="text-zinc-400" />
        </div>
      );
      // 🌟 Tambahkan flex-wrap agar gambar turun ke bawah jika layar terlalu sempit
      return <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-start min-w-[100px]">{renderImg(row.original.foto_before)}{renderImg(row.original.foto_after)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const statusId = Number(row.original.status_id);
      const statusLabel = getStatusLabel(statusId);
      const kondisi = row.original.kondisi_kembali;
      // 🌟 Pastikan badge memiliki text-center dan bisa menyesuaikan lebar
      const badgeClass = "rounded-none border-2 border-zinc-900 font-black text-[9px] uppercase shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] px-2 py-1 text-center w-full sm:w-auto break-words whitespace-normal";
      
      let statusColor = "bg-zinc-200 text-zinc-950"; 
      if (statusId === 1) statusColor = "bg-amber-300 text-zinc-950";      // Pending
      else if (statusId === 2) statusColor = "bg-sky-300 text-zinc-950";     // Disetujui
      else if (statusId === 3) statusColor = "bg-rose-400 text-zinc-950";    // Ditolak
      else if (statusId === 4) statusColor = "bg-army-400 text-zinc-950"; // Selesai
      else if (statusId === 5) statusColor = "bg-blue-500 text-white";       // Berlangsung
      else if (statusId === 6) statusColor = "bg-purple-300 text-zinc-950";  // Menunggu Pengecekan

      return (
        <div className="flex flex-col gap-2 items-start font-mono min-w-[110px]">
          <Badge className={`${badgeClass} ${statusColor}`}>
            {statusLabel}
          </Badge>
          {kondisi && (
            <Badge className={`${badgeClass} ${kondisi === "rusak" ? "bg-rose-500 text-white" : "bg-emerald-300 text-zinc-950"}`}>
              {kondisi === "rusak" ? "✗ Unit Rusak" : "✓ Unit Baik"}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "approved",
    header: "Approved By",
    cell: ({ row }) => <span className="text-xs font-bold font-mono whitespace-nowrap">{row.original.penerima?.name || "By Sistem"}</span>,
  },
  {
    accessorKey: "waktu",
    header: "Timeline",
    cell: ({ row }) => {
      const format = (d: string | null) => {
        if (!d) return "-";
        const date = new Date(d);
        return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) + 
               ", " + date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
      };
      // 🌟 Tambahkan whitespace-normal dan break-words agar teks waktu bisa memisah baris (wrap) jika perlu
      const cardStyle = "border-2 border-zinc-900 p-2 text-[10px] font-mono shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] whitespace-normal break-words";
      
      return (
        // 🌟 Kurangi min-w agar lebih ramah untuk layar kecil
        <div className="flex flex-col gap-2 w-full min-w-[120px] sm:min-w-[140px]">
          <div className={`${cardStyle} bg-emerald-50`}>
            <span className="font-bold">IN:</span> {format(row.original.waktu_pinjam)}
          </div>

          <div className={`${cardStyle} ${row.original.waktu_selesai_aktual ? "bg-slate-50" : "bg-amber-50"}`}>
            <span className="font-bold">OUT:</span> {row.original.waktu_selesai_aktual ? format(row.original.waktu_selesai_aktual) : "Belum Kembali"}
          </div>
        </div>
      );
    },
  },
];