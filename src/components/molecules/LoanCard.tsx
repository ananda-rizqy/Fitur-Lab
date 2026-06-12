import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Loader2,
  Camera,
  Calendar,
  Hash,
  ArrowRight,
  Quote,
} from "lucide-react";

interface LoanCardProps {
  item: any;
  uploading: boolean;
  onCardClick: (item: any) => void;
  onFileChange: (id: number, e?: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LoanCard({
  item,
  uploading,
  onCardClick,
  onFileChange,
}: LoanCardProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-400 text-zinc-950 border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "approved":
        return "bg-emerald-500 text-white border-zinc-950 font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      case "ongoing":
        return "bg-blue-500 text-white border-zinc-950 animate-pulse font-black shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]";
      default:
        return "bg-zinc-100 text-zinc-400 border-zinc-300";
    }
  };

  return (
    <Card
      variant="brutal"
      onClick={() => onCardClick(item)}
      className="p-5 lg:p-6  cursor-pointer text-left shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]! active:translate-x-0! active:translate-y-0! active:shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]!"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="gap-1 border-2 border-zinc-950 bg-zinc-950 text-white font-mono font-black py-0.5 px-2.5  text-[9px] shadow-none"
            >
              <Hash size={10} /> {item.id}
            </Badge>

            {item.penerima?.name && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold  tracking-wider">
                ACC:{" "}
                <b className="text-zinc-800 dark:text-zinc-200 font-black font-mono">
                  {item.penerima.name}
                </b>
              </span>
            )}

            <Badge
              variant="outline"
              className={`text-xs font-mono font-black tracking-widest  py-0.5 px-2.5 border-2 ${getStatusStyle(item.status)}`}
            >
              {item.status}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100  tracking-widest ">
              Ruangan : {item.ruangan_lab || "Laboratorium"}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium flex items-start gap-1 mt-1">
              Tujuan Penggunaaan : {item.tujuan_penggunaan}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.details?.map((det: any) => (
              <div
                key={det.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 "
              >
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200  font-sans">
                  {det.alat?.nama_alat}
                </span>
                <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 font-mono">
                  ×{det.jumlah_pinjam}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between items-start lg:items-end min-w-[180px] gap-4">
          <div className="lg:text-right space-y-1">
            <p className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500  tracking-widest">
              Registration Date
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800  text-zinc-900 dark:text-zinc-200 font-mono text-[10px] font-black ">
              <Calendar size={11} />
              {item.created_at
                ? new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </div>
          </div>

          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            {item.status === "approved" ? (
  <Button
    variant="brutal"
    color="blue"
    className={`w-full h-11 text-[10px] font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer 
      ${uploading ? "opacity-40 pointer-events-none" : ""}`}
    onClick={(e) => {
      e.stopPropagation(); // Mencegah klik kartu (Modal Detail)
      onFileChange(item.id); // Langsung panggil fungsi tanpa event file
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
        <span>Ambil & Foto Alat</span>
      </>
    )}
  </Button>
) : (
  <Button variant="brutal" onClick={() => onCardClick(item)}>
    <span>Lihat Detail</span>
    <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
  </Button>
)}
          </div>
        </div>
      </div>
    </Card>
  );
}
