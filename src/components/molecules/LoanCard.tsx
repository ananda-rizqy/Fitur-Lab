import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Loader2,
  Camera,
  Calendar,
  Hash, 
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";

interface LoanCardProps {
  item: any;
  uploading: boolean;
  onCardClick: (item: any) => void;
  onFileChange?: (id: number, e?: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LoanCard({
  item,
  uploading,
  onCardClick,
  onFileChange,
}: LoanCardProps) {
  const getStatusStyle = (status: string) => {
    const st = (status || "").toLowerCase().trim();
    switch (st) {
      case "pending":
      case "menunggu":
        return "bg-amber-400 text-zinc-950 border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "approved":
      case "disetujui":
      case "dipesan":
        return "bg-emerald-500 text-white border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "ongoing":
      case "berlangsung":
        return "bg-blue-500 text-white border-zinc-950 animate-pulse font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "selesai":
        return "bg-purple-500 text-white border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "ditolak":
      case "rejected":
        return "bg-red-500 text-white border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      default:
        return "bg-zinc-100 text-zinc-400 border-zinc-300";
    }
  };

  const currentStatus = (item.status || "pending").toLowerCase().trim();
  const isApproved = currentStatus === "approved" || currentStatus === "disetujui" || currentStatus === "dipesan";
  
  const namaMatkul = item.nama_matkul;
  const kodeMatkul = item.kode_matkul;
  const createdAtValue = item.created_at || (item.details && item.details[0]?.created_at);

  // 🌟 State Waktu
  const [isTimeAllowed, setIsTimeAllowed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [unlockTimeText, setUnlockTimeText] = useState("");

  useEffect(() => {
    if (!item.waktu_mulai) {
      setIsTimeAllowed(true);
      return;
    }

    const checkTime = () => {
      const now = new Date().getTime();
      
      // PARSING WAKTU MULAI SECARA MANUAL AGAR AKURAT DI SEMUA BROWSER
      const [datePart, timePart] = item.waktu_mulai.split(' ');
      const [y, m, d] = datePart.split('-');
      const [hr, min, sec] = timePart.split(':');
      const waktuMulai = new Date(Number(y), Number(m)-1, Number(d), Number(hr), Number(min), Number(sec)).getTime();
      
      // PARSING WAKTU SELESAI
      let waktuSelesai = Infinity;
      if (item.waktu_selesai) {
          const [sdPart, stPart] = item.waktu_selesai.split(' ');
          const [sy, sm, sd] = sdPart.split('-');
          const [shr, smin, ssec] = stPart.split(':');
          waktuSelesai = new Date(Number(sy), Number(sm)-1, Number(sd), Number(shr), Number(smin), Number(ssec)).getTime();
      }
      
      // Ubah jadi 0 jika ingin tombol HANYA muncul tepat di jam jadwal
      const menitToleransi = 10; 
      const toleransiMs = menitToleransi * 60 * 1000;

      const unlockDate = new Date(waktuMulai - toleransiMs);
      
      const tanggalFormat = unlockDate.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
      const jamFormat = unlockDate.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setUnlockTimeText(`${tanggalFormat}, ${jamFormat}`);
      if (now > waktuSelesai) {
          setIsExpired(true);
          setIsTimeAllowed(false);
      } else if (now >= (waktuMulai - toleransiMs)) {
          setIsExpired(false);
          setIsTimeAllowed(true);
      } else {
          setIsExpired(false);
          setIsTimeAllowed(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000); 
    return () => clearInterval(interval);
  }, [item.waktu_mulai, item.waktu_selesai]);

  return (
    <Card
      variant="brutal"
      onClick={() => onCardClick(item)}
      className="p-5 lg:p-6 cursor-pointer text-left shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]! active:translate-x-0! active:translate-y-0! active:shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]!"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="gap-1 border-2 border-zinc-950 bg-zinc-950 text-white font-mono font-black py-0.5 px-2.5 text-[9px] shadow-none"
            >
              <Hash size={10} /> {item.id}
            </Badge>

            {item.penerima?.name && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider">
                ACC:{" "}
                <b className="text-zinc-800 dark:text-zinc-200 font-black font-mono">
                  {item.penerima.name}
                </b>
              </span>
            )}

            <Badge
              variant="outline"
              className={`text-xs font-mono font-black tracking-widest py-0.5 px-2.5 border-2 uppercase ${getStatusStyle(item.status)}`}
            >
              {item.status}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100 tracking-widest">
              Ruangan : {item.ruangan_lab || "Laboratorium"}
            </h3>

            {namaMatkul && namaMatkul !== "-" && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-blue-800 bg-blue-50 px-2 py-1 w-fit border border-blue-200 font-black tracking-wide">
                <BookOpen size={13} className="shrink-0 text-blue-600" />
                <span>{namaMatkul} {kodeMatkul && kodeMatkul !== "-" ? `(${kodeMatkul})` : ""}</span>
              </div>
            )}

            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium flex items-start gap-1 pt-1">
              Tujuan Penggunaan : {item.tujuan || item.tujuan_penggunaan || "-"}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.details?.map((det: any) => {
              const isBahan = det.tipe_item === 'bahan';
              const namaItem = isBahan
                ? (det.bahan?.nama_bahan || det.nama_bahan || "Bahan Lab")
                : (det.alat?.nama_alat || det.nama_alat || "Alat Lab");
              const jumlahPinjam = det.qty || det.jumlah_pinjam || 1;

              return (
                <div
                  key={det.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800"
                >
                  <span className="text-[9px] font-mono font-black uppercase px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {det.tipe_item || "alat"}
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-sans">
                    {namaItem}
                  </span>
                  <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 font-mono">
                    ×{jumlahPinjam}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-between items-start lg:items-end min-w-[180px] gap-4">
          <div className="lg:text-right space-y-1 w-full">
            <p className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest">
              Registration Date
            </p>
            <div className="inline-flex items-center justify-end gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 font-mono text-[10px] font-black w-full lg:w-fit">
              <Calendar size={11} className="shrink-0" />
              <span>
                {createdAtValue
                  ? new Date(createdAtValue).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB"
                  : "-"}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {/* KONDISI 1: JIKA WAKTU SUDAH LEWAT HABIS */}
            {isApproved && onFileChange && !item.foto_before && isExpired ? (
              <div className="w-full h-11 text-[9px] font-mono font-black tracking-wider flex items-center justify-center gap-1.5 bg-red-100 dark:bg-red-950/30 text-red-600 border-2 border-red-500">
                <Clock size={12} />
                <span>Waktu Peminjaman Berakhir</span>
              </div>
            ) 
            /* KONDISI 2: JIKA SUDAH TEPAT WAKTUNYA (Tombol Hijau) */
            : isApproved && onFileChange && !item.foto_before && isTimeAllowed ? (
              <Button
                variant="brutal"
                className={`w-full h-11 text-[10px] font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]
                  ${uploading ? "opacity-40 pointer-events-none" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(item.id);
                }}
                disabled={!!uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Camera size={13} />
                    <span>Ambil Foto Kondisi Awal</span>
                  </>
                )}
              </Button>
            ) 
            /* KONDISI 3: JIKA BELUM WAKTUNYA (Tombol Info Abu-Abu) */
            : isApproved && onFileChange && !item.foto_before && !isTimeAllowed ? (
              <div className="w-full h-11 text-[9px] font-mono font-black tracking-wider flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-2 border-zinc-300 dark:border-zinc-700 px-2 text-center">
                <Clock size={12} className="shrink-0" />
                <span>Dibuka: {unlockTimeText} WIB</span>
              </div>
            ) : null}

            <Button 
              variant="brutal" 
              onClick={() => onCardClick(item)}
              className="w-full h-10 text-[10px] font-mono font-black tracking-widest flex items-center justify-center gap-2 border-2 border-zinc-950 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]"
            >
              <span>Lihat Detail</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}