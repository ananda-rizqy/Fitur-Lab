import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, Wrench, User as UserIcon, BookOpen } from "lucide-react";

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
    header: "Peminjam, Lab & Matkul",
    cell: ({ row }) => {
      const namaMatkul = row.original.nama_matkul;
      const kodeMatkul = row.original.kode_matkul;

      return (
        <div className="flex items-start gap-3 py-1">
          <div className="h-8 w-8 rounded-none bg-zinc-50 flex items-center justify-center border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] shrink-0 mt-0.5">
            <UserIcon size={13} />
          </div>
          <div className="text-left space-y-1">
            <div>
              <div className="font-mono font-black text-xs">{row.original.nama_mahasiswa || "N/A"}</div>
              <div className="text-[10px] text-zinc-400 font-bold">NIM: {row.original.nim_mahasiswa || "-"}</div>
              <div className="text-[10px] text-zinc-400 font-bold">KELAS: {row.original.kelas_mahasiswa || "N/A"}</div>
            </div>

            {/* Badge Ruangan Lab */}
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-500 font-black tracking-wide bg-emerald-50 px-1 w-fit border border-emerald-200">
              📍 {row.original.ruangan_lab || "NO LAB"}
            </div>

            {/* Informasi Mata Kuliah & Kode Matkul */}
            {namaMatkul && namaMatkul !== "-" && (
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 w-fit border border-blue-200 font-black tracking-wide">
                <BookOpen size={10} className="shrink-0 text-blue-600" />
                <span>{namaMatkul} {kodeMatkul && kodeMatkul !== "-" ? `(${kodeMatkul})` : ""}</span>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "details",
    header: "Detail Alat & Tujuan",
    cell: ({ row }) => (
      <div className="space-y-2 py-1 text-left">
        {/* Bagian Daftar Alat (Perulangan) */}
        <div className="space-y-1">
          {row.original.details?.map((d: any, i: number) => (
            <div key={i} className="bg-white border-2 border-zinc-950 rounded-none px-2 py-1 text-[10px] font-sans">
              <div className="font-black">
                <Wrench size={10} className="inline mr-1" /> 
                {d.alat?.nama_alat || "Alat"} ({d.jumlah_pinjam ?? d.qty ?? 1})
              </div>
              <div className="text-zinc-500 italic">
                Tag: {d.alat?.kode_tag || "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Bagian Tujuan Penggunaan */}
        {(row.original.tujuan_penggunaan || row.original.tujuan) && (
          <div className="text-[10px] bg-zinc-100 p-1.5 border-l-2 border-zinc-950 italic text-zinc-600 font-mono">
            <strong>Tujuan:</strong> {row.original.tujuan_penggunaan || row.original.tujuan}
          </div>
        )}
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
    cell: ({ row }) => {
      const statusId = Number(row.original.status_id);
      const statusLabel = getStatusLabel(statusId);
      
      // Penentuan warna badge berdasarkan ID status real
      let badgeColor = "bg-zinc-200 text-zinc-950";
      if (statusId === 1) badgeColor = "bg-amber-300 text-zinc-950";       // Pending
      else if (statusId === 2) badgeColor = "bg-sky-300 text-zinc-950";     // Disetujui
      else if (statusId === 3) badgeColor = "bg-rose-400 text-zinc-950";    // Ditolak
      else if (statusId === 4) badgeColor = "bg-emerald-300 text-zinc-950"; // Selesai
      else if (statusId === 5) badgeColor = "bg-blue-500 text-white";       // Berlangsung
      else if (statusId === 6) badgeColor = "bg-purple-300 text-zinc-950";  // Menunggu Pengecekan

      return (
        <div className="flex flex-col gap-1 items-start text-left">
          <Badge variant="outline" className={`font-mono font-black text-[9px] uppercase border-2 border-zinc-950 ${badgeColor}`}>
            {statusLabel}
          </Badge>
          <div className="text-[9px] font-bold text-zinc-500 uppercase">Kondisi: {row.original.kondisi_kembali || "-"}</div>
          <div className="text-[9px] text-zinc-500">
            Penerima: {row.original.penerima?.name ? (
              <span className="font-bold text-zinc-900">{row.original.penerima.name}</span>
            ) : (
              <span className="text-amber-600 font-bold">BY SISTEM</span>
            )}
          </div>
        </div>
      );
    },
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
          {row.original.waktu_kembali || row.original.waktu_selesai_aktual ? new Date(row.original.waktu_kembali || row.original.waktu_selesai_aktual).toLocaleString('id-ID', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
          }) : <span className="italic">Belum kembali</span>}
        </div>
      </div>
    ),
  },
];