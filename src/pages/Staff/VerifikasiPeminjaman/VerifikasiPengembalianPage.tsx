import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { 
  CheckSquare, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  CalendarClock,
  Info,
  X,
  ZoomIn
} from "lucide-react";

import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PageLayout } from "../../../layouts/PageLayout";

type DetailPeminjaman = {
  id: number;
  qty: number;
  kode_tag_list: string | string[];
  alat: {
    id: number;
    nama_alat: string;
    kode_tag?: string;
  };
};

type ReturnRequest = {
  id: number;
  ruangan_lab: string;
  status: string;
  kondisi_kembali: string;
  deskripsi_kerusakan: string | null;
  foto_after: string | null;
  waktu_mulai: string;
  nama_mahasiswa?: string;
  nim_mahasiswa?: string;
  kelas_mahasiswa?: string;
  user?: {
    name: string;
    nim_nip: string;
  };
  details: DetailPeminjaman[];
};

export default function VerifikasiPengembalianPage() {
  const [pendingReturns, setPendingReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  
  // 🌟 State untuk mengontrol Preview Foto / Lightbox
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchPendingReturns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/peminjaman"); 
      const rawData = res.data?.data || res.data || [];

      const pending = rawData.filter(
        (item: any) => item.status?.toLowerCase() === "menunggu_pengecekan"
      );

      setPendingReturns(pending);
    } catch (err) {
      console.error("Gagal mengambil data pengembalian:", err);
      setPendingReturns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingReturns();
  }, [fetchPendingReturns]);

  const handleAcc = async (id: number) => {
    const result = await Swal.fire({
      title: "Verifikasi Pengembalian?",
      text: "Pastikan kondisi fisik alat sudah sesuai dengan foto dan catatan mahasiswa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Selesai!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#09090b",
      cancelButtonColor: "#d4d4d8",
    });

    if (result.isConfirmed) {
      try {
        setVerifyingId(id);
        const res = await api.post(`/peminjaman/acc-kembali/${id}`);

        if (res.status === 200) {
          Swal.fire({
            title: "Terkonfirmasi",
            text: "Peminjaman telah dinyatakan selesai.",
            icon: "success",
            confirmButtonColor: "#09090b",
          });
          fetchPendingReturns();
        }
      } catch (error: any) {
        Swal.fire(
          "Gagal",
          error.response?.data?.message || "Terjadi kesalahan server.",
          "error"
        );
      } finally {
        setVerifyingId(null);
      }
    }
  };

  const getImageUrl = (path: string | null) => {
  if (!path) return "";
  return path;
  };

  const formatTagList = (tagList: any) => {
    if (!tagList) return "-";
    if (Array.isArray(tagList)) return tagList.join(", ");
    try {
      const parsed = JSON.parse(tagList);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch (e) {
      return tagList;
    }
    return tagList;
  };

  return (
    <PageLayout
      pageTitle="Verifikasi Pengembalian Alat"
      pageDescription="Cek dan validasi kondisi inventaris laboratorium yang dikembalikan oleh mahasiswa."
    >
      <div className="py-6 w-full space-y-8 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        
        {/* HEADER STATISTIK */}
        <div className="flex gap-3 text-right">
          <div className="bg-amber-100 border-2 border-amber-900 px-4 h-11 flex flex-col justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(120,53,15,1)]">
            <p className="text-[10px] font-mono font-black text-amber-800 tracking-widest uppercase">
              Menunggu Pengecekan
            </p>
            <p className="text-sm font-mono font-black text-amber-950">
              {pendingReturns.length} BERKAS
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-3 w-full">
            <Loader2 className="animate-spin text-zinc-950 dark:text-zinc-50" size={28} />
            <p className="text-xs font-mono font-black tracking-widest text-zinc-400">
              Memuat Antrean Pengembalian...
            </p>
          </div>
        ) : pendingReturns.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-800 p-8 rounded-none w-full">
            <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 mx-auto mb-4 rounded-none shadow-none">
              <CheckSquare size={20} />
            </div>
            <h3 className="font-mono font-black text-zinc-800 dark:text-zinc-200 tracking-widest text-sm">
              Antrean Kosong
            </h3>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1.5 font-medium max-w-xs mx-auto">
              Saat ini tidak ada alat yang menunggu untuk diverifikasi pengembaliannya.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 w-full">
            {pendingReturns.map((item) => (
              <Card
                key={item.id}
                variant="brutal"
                animate={false}
                className="p-0 border-2 border-zinc-950 dark:border-zinc-800 rounded-none overflow-hidden flex flex-col lg:flex-row py-0 w-full shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]"
              >
                {/* BAGIAN KIRI: Info Mahasiswa & Alat */}
                <div className="lg:w-1/2 p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-900 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-zinc-950">
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-300 dark:border-zinc-800">
                      <span className="bg-amber-200 text-amber-950 font-mono text-[10px] font-black px-2.5 py-1.5 rounded-none tracking-widest border border-amber-900 uppercase shadow-[2px_2px_0px_0px_rgba(120,53,15,1)]">
                        ID REG: #{item.id}
                      </span>
                      <span className="text-xs text-zinc-600 font-mono font-black tracking-wider flex items-center gap-1.5">
                        <CalendarClock size={14} />
                        {new Date(item.waktu_mulai).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-1 mb-6">
                      <span className="text-[10px] font-mono font-black tracking-widest text-zinc-400 uppercase">
                        Identitas Mahasiswa
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <User size={16} className="text-zinc-900 dark:text-zinc-100" />
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase">
                          {item.nama_mahasiswa || item.user?.name || "Nama Mahasiswa"}
                        </span>
                        <span className="text-xs font-mono font-black text-blue-700 bg-blue-100 border border-blue-300 px-2 py-0.5">
                          {item.kelas_mahasiswa || "KELAS TIDAK ADA"}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5">
                          NIM: {item.nim_mahasiswa || item.user?.nim_nip || "-"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xs font-mono font-black mb-3 tracking-widest text-zinc-400 uppercase">
                      Daftar Alat Dikembalikan
                    </h3>
                    <div className="space-y-2">
                      {item.details?.map((det: any) => (
                        <div
                          key={det.id}
                          className="flex justify-between p-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-none items-center"
                        >
                          <div>
                            <span className="font-black text-xs tracking-wide text-zinc-900 dark:text-zinc-200 uppercase block">
                              {det.alat?.nama_alat || "Item Inventaris"}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 mt-1 inline-block">
                              TAG: {formatTagList(det.kode_tag_list)}
                            </span>
                          </div>
                          <span className="text-white font-mono font-black text-xs bg-zinc-950 px-2.5 py-1 rounded-none">
                            QTY: {det.qty || det.jumlah_pinjam}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BAGIAN KANAN: Bukti Foto, Kondisi & Aksi */}
                <div className="lg:w-1/2 p-6 lg:p-8 bg-zinc-950 text-zinc-100 space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-mono font-black tracking-widest text-zinc-400 uppercase mb-3">
                      Laporan Kondisi Alat
                    </h3>
                    
                    <div className={`p-4 border-2 rounded-none flex gap-3 items-start ${
                      item.kondisi_kembali === 'rusak' 
                        ? 'border-red-500 bg-red-950/30' 
                        : 'border-emerald-500 bg-emerald-950/30'
                    }`}>
                      {item.kondisi_kembali === 'rusak' ? (
                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                      ) : (
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                      )}
                      <div>
                        <p className={`text-xs font-mono font-black uppercase tracking-wider ${
                          item.kondisi_kembali === 'rusak' ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          Kondisi {item.kondisi_kembali}
                        </p>
                        {item.kondisi_kembali === 'rusak' && item.deskripsi_kerusakan && (
                          <p className="text-xs text-red-200/70 mt-1.5 leading-relaxed font-medium">
                            "{item.deskripsi_kerusakan}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <span className="text-[10px] font-mono font-black tracking-widest text-zinc-400 uppercase block mb-2">
                        Foto Bukti Pengembalian (Klik untuk memperbesar)
                      </span>
                      {/* 🌟 Bungkus dengan onClick untuk membuka preview foto */}
                      <div 
                        onClick={() => item.foto_after && setPreviewImage(getImageUrl(item.foto_after))}
                        className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden group relative cursor-pointer"
                      >
                        {item.foto_after ? (
                          <img 
                            src={getImageUrl(item.foto_after)} 
                            alt="Bukti" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
                            Tidak Ada Foto
                          </div>
                        )}
                        {item.foto_after && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <ZoomIn size={24} className="text-white mb-2" />
                            <span className="text-xs font-mono font-bold text-white tracking-widest">
                              PERBESAR FOTO
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleAcc(item.id)}
                    disabled={verifyingId === item.id}
                    className="w-full h-12 bg-white hover:bg-zinc-200 text-zinc-950"
                    variant="brutal"
                  >
                    {verifyingId === item.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Memverifikasi...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 font-black tracking-widest">
                        <CheckSquare size={16} />
                        <span>Verifikasi & Selesai</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 MODAL PREVIEW / LIGHTBOX FOTO */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-zinc-300 bg-zinc-900 border border-zinc-700 p-2 rounded-none transition-colors"
              title="Tutup"
            >
              <X size={20} />
            </button>
            <img 
              src={previewImage} 
              alt="Preview Besar" 
              className="max-w-full max-h-[85vh] object-contain border-2 border-zinc-800 shadow-2xl bg-zinc-950"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-zinc-400 text-xs font-mono mt-3 tracking-widest uppercase">
              Tekan di luar gambar atau tombol X untuk menutup
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}