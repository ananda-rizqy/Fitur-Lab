import { Box, Clock, MapPin, Tag, Layers, Calendar, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

// 🌟 Helper untuk menerjemahkan ruangan_lab_id menjadi nama ruangan yang akurat
const getNamaRuangan = (id: number | string) => {
  switch (Number(id)) {
    case 1: return "Lab. TK Barat I/01";
    case 2: return "Lab. TK Barat I/02";
    case 3: return "Lab. TK Barat I/04";
    case 4: return "Lab. TK Timur I/01";
    case 5: return "Lab. TK Timur I/02";
    case 6: return "Lab. TK Timur II/01"; // Sesuaikan dengan ID 6 Anda
    default: return `Laboratorium (ID: ${id})`;
  }
};
  
export default function DetailPeminjamanModal({
  isOpen,
  onClose,
  data,
}: ModalProps) {
  if (!data) return null;

  const getCleanImageUrl = (path: string | null) => {
    if (!path) return "";
    const cleanPath = path.replace(/\\/g, "");
    if (cleanPath.startsWith("http")) return cleanPath;
    return `http://localhost:8000/storage/${cleanPath.replace(/^\/+/, "")}`;
  };

  const currentStatus = (data.status || "").toLowerCase().trim();
  const isReturned =
    currentStatus === "returned" ||
    currentStatus === "dikembalikan" ||
    currentStatus === "selesai";
  const isOngoing =
    currentStatus === "ongoing" ||
    currentStatus === "dipinjam" ||
    currentStatus === "berlangsung";
  const isRejected =
    currentStatus === "rejected" || currentStatus === "ditolak";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 w-full max-w-3xl! overflow-hidden border-2 border-zinc-950 dark:border-zinc-800 flex flex-col focus-visible:outline-none animate-in fade-in zoom-in-95 duration-150 rounded-none dark:shadow-none max-h-[95vh]">
        <DialogHeader className="p-5 flex flex-row justify-between items-center text-white border-b-2 border-zinc-950 space-y-0 shrink-0">
          <div className="text-left">
            <DialogTitle className="text-xl font-mono font-black tracking-widest text-zinc-900 dark:text-white capitalize">
              Detail Peminjaman
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 font-mono font-bold tracking-widest mt-0.5">
              Registration ID: #{data.id}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y-2 md:divide-y-0 md:divide-x-2 divide-zinc-950 dark:divide-zinc-800 min-h-0">
          <div className="md:col-span-7 p-6 space-y-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-zinc-200 dark:border-zinc-800 pb-2 shrink-0">
              <p className="text-xs font-mono font-black text-zinc-900 dark:text-white tracking-widest flex items-center gap-2">
                <Box size={14} className="text-zinc-400 shrink-0" />
                <span>Daftar Inventaris / Alat</span>
              </p>
              <span className="font-mono font-black text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                {data.details?.length || 0} Items
              </span>
            </div>

            {/* left section */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[340px] md:max-h-[380px] scrollbar-none">
              {data.details && data.details.length > 0 ? (
                data.details.map((det: any) => {
                  const isBahan = det.tipe_item === 'bahan';
                  const namaItem = isBahan
                    ? (det.bahan?.nama_bahan || "Bahan Laboratorium")
                    : (det.alat?.nama_alat || "Alat Laboratorium");

                  let parsedTags: string[] = [];
                  try {
                    if (det.kode_tag_list) {
                      parsedTags = typeof det.kode_tag_list === "string" 
                        ? JSON.parse(det.kode_tag_list) 
                        : det.kode_tag_list;
                    }
                  } catch (e) {
                    parsedTags = [];
                  }

                  return (
                    <Card
                      key={det.id}
                      className="bg-zinc-50 dark:bg-zinc-950/30 p-3.5 border-2 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-950 dark:hover:border-zinc-600 transition-all shadow-none hover:translate-x-0 hover:translate-y-0 flex flex-row select-none rounded-none"
                    >
                      <div className="overflow-hidden flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {det.tipe_item || "alat"}
                          </span>
                          <p className="font-sans font-black text-zinc-900 dark:text-zinc-100 text-xs leading-none truncate tracking-tight">
                            {namaItem}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {parsedTags && parsedTags.length > 0 ? (
                            parsedTags.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 text-[8px] bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-300 px-2 py-0.5 font-mono font-black tracking-tight border border-zinc-800 dark:border-zinc-700"
                              >
                                <Tag size={8} className="shrink-0" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[8px] bg-zinc-200 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 font-mono font-black">
                              <Layers size={8} className="shrink-0" />
                              {isBahan ? "Stok Satuan" : (det.alat?.is_asset ? det.alat.kode_tag : "Non-Aset")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-zinc-900 w-11 h-11 flex flex-col items-center justify-center font-mono font-black text-zinc-900 dark:text-white shrink-0">
                        <span className="text-[7px] text-zinc-400 font-sans font-bold leading-none mb-0.5">
                          Qty
                        </span>
                        <span className="text-xs leading-none font-black font-mono">
                          {det.qty || det.jumlah_pinjam}X
                        </span>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50">
                  <p className="text-xs italic text-zinc-400 dark:text-zinc-500 font-medium">
                    Tidak ada daftar inventaris terlampir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* right section*/}
          <div className="md:col-span-5 p-6 bg-zinc-50/60 dark:bg-zinc-950/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-mono font-black text-zinc-500 tracking-widest uppercase">
                  Status Peminjaman:
                </span>
                <Badge
                  variant="outline"
                  className={`font-mono font-black text-xs px-3 py-1.5 border-2 tracking-widest uppercase rounded-none justify-center ${
                    isReturned
                      ? "bg-emerald-500 text-white border-zinc-950"
                      : isOngoing
                        ? "bg-amber-400 text-zinc-950 border-zinc-950 animate-pulse"
                        : isRejected
                          ? "bg-red-500 text-white border-zinc-950"
                          : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-950 dark:border-zinc-700"
                  }`}
                >
                  {data.status}
                </Badge>
              </div>

              {data.foto_before ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-mono font-black text-zinc-500 tracking-widest uppercase">
                    Foto Kondisi Awal (Before)
                  </p>
                  <div className="relative border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden bg-zinc-100 h-28">
                    <img
                      src={getCleanImageUrl(data.foto_before)}
                      alt="Bukti Serah Terima Awal"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2.5 pt-2 border-t-2 border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
                <div className="flex items-start gap-2.5">
                  {/* <Calendar size={13} className="text-zinc-500 shrink-0 mt-0.5" /> */}
                  {/* <div className="flex flex-col">
                    <span className="font-black text-zinc-400 uppercase tracking-wider text-[9px]">Tanggal Pengajuan</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100">
                      {data.created_at ? new Date(data.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) + " WIB" : "-"}
                    </span>
                  </div> */}
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-400 uppercase tracking-wider text-[9px]">Estimasi Penggunaan</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100">
                      {data.waktu_mulai ? new Date(data.waktu_mulai).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-"} s/d {data.waktu_selesai ? new Date(data.waktu_selesai).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-400 uppercase tracking-wider text-[9px]">Waktu Ambil (Foto Before)</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100">
                      {data.waktu_pinjam ? new Date(data.waktu_pinjam).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) + " WIB" : "Belum Diambil"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-400 uppercase tracking-wider text-[9px]">Ruangan Lab</span>
                    <span className="font-black text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
                      {data.ruanganLab?.nama_ruangan || data.ruangan_lab || getNamaRuangan(data.ruangan_lab_id)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}