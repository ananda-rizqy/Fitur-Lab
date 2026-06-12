import { useEffect, useState, useMemo } from "react";
import api from "../../../services/api";
import {
  AlertCircle,
  Check,
  Clock,
  Inbox,
  Activity,
  Calendar as CalendarIcon,
  Loader2,
  X,
  SlidersHorizontal,
  Zap,
  ZapOff,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { PageLayout } from "../../../layouts/PageLayout";
import { OverlayModal } from "../../../components/atoms/OverlayModal";
import { LoanPagination } from "../../../components/organism/LoanPagination";

export function PersetujuanPinjamPage() {
  const [dataPinjam, setDataPinjam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [alasanTolak, setAlasanTolak] = useState("");

  // State Fitur Filter Baru
  const [classFilter, setClassFilter] = useState<string>("all");
  const [accStatusFilter, setAccStatusFilter] = useState<string>("all");

  // State Fitur Auto ACC & Paginasi
  const [isAutoAccActive, setIsAutoAccActive] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/peminjaman/semua?t=${Date.now()}`);
      const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setDataPinjam(rawData);

      // Logika Pemicu Fitur Auto ACC jika diaktifkan oleh Tendik/Staff
      if (isAutoAccActive) {
        const pendingItems = rawData.filter((item: any) => {
          const st = item.status?.toLowerCase().trim();
          return st === "pending" || st === "menunggu" || st === "dipesan";
        });

        if (pendingItems.length > 0) {
          triggerAutoApproval(pendingItems);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data peminjaman:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, [isAutoAccActive]);

  // Fungsi Eksekusi Auto ACC Berurutan
  const triggerAutoApproval = async (items: any[]) => {
    for (const item of items) {
      try {
        await api.post(`/peminjaman/${item.id}/setujui`);
      } catch (err) {
        console.error(`Gagal otomatis menyetujui ID #${item.id}:`, err);
      }
    }
    fetchPeminjaman();
  };

  const handleSetujui = async (id: number, currentStatus: string) => {
    const isBooking =
      currentStatus === "booking" || currentStatus === "pesanan";

    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      text: isBooking
        ? "Setujui pesanan ini? Status berkas akan dialihkan menjadi 'Terjadwal'."
        : "Setujui peminjaman langsung? Stok unit alat akan langsung berkurang.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#18181b",
      cancelButtonColor: "#e4e4e7",
      confirmButtonText: "Ya, setujui!",
      cancelButtonText: "Batal",
      customClass: {
        cancelButton:
          "text-zinc-900 font-mono font-black border-2 border-zinc-950 rounded-none",
        confirmButton: "rounded-none font-mono font-black",
      },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(id);
      await api.post(`/peminjaman/${id}/setujui`);
      Swal.fire({
        title: "Berhasil!",
        text: "Pengajuan peminjaman telah disetujui.",
        icon: "success",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
      fetchPeminjaman();
    } catch (err: any) {
      Swal.fire({
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal menyetujui tindakan.",
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (id: number) => {
    setSelectedId(id);
    setIsRejectModalOpen(true);
    setAlasanTolak("");
  };

  const confirmTolak = async () => {
    if (!alasanTolak.trim() || !selectedId) return;

    try {
      setProcessing(selectedId);
      await api.post(`/peminjaman/${selectedId}/tolak`, {
        alasan: alasanTolak,
      });
      setIsRejectModalOpen(false);
      Swal.fire({
        title: "Berkas ditolak",
        text: "Pengajuan peminjaman resmi ditolak.",
        icon: "info",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
      fetchPeminjaman();
    } catch (err: any) {
      Swal.fire({
        title: "Gagal!",
        text: err.response?.data?.message || "Gagal menolak berkas.",
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
    } finally {
      setProcessing(null);
      setSelectedId(null);
    }
  };

  // Ekstraksi Daftar Kelas Unik untuk Dropdown Pilihan
  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    dataPinjam.forEach((item: any) => {
      if (item.user?.kelas) classes.add(item.user.kelas.trim());
    });
    return Array.from(classes);
  }, [dataPinjam]);

  // Logika Filter Multi-Kriteria (Kelas & Status Belum ACC)
  const filteredData = useMemo(() => {
    return dataPinjam.filter((item: any) => {
      // 1. Filter Berdasarkan Kelas
      if (classFilter !== "all" && item.user?.kelas !== classFilter) {
        return false;
      }

      // 2. Filter Berdasarkan Status ACC
      if (accStatusFilter === "unapproved") {
        const st = item.status?.toLowerCase().trim();
        const isUnapproved =
          st === "pending" || st === "menunggu" || st === "dipesan";
        if (!isUnapproved) return false;
      }

      return true;
    });
  }, [dataPinjam, classFilter, accStatusFilter]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const pending = filteredData.filter(
      (item: any) => item.status === "pending",
    ).length;
    const booking = filteredData.filter(
      (item: any) => item.status === "booking" || item.status === "pesanan",
    ).length;
    const approved = filteredData.filter(
      (item: any) => item.status === "approved" || item.status === "disetujui",
    ).length;
    const ongoing = filteredData.filter(
      (item: any) => item.status === "ongoing",
    ).length;

    return { total, pending, approved, ongoing, booking };
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Transformasi Data Terpaginasi untuk Render Baris Tabel
  const paginatedData = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(offset, offset + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <PageLayout
      pageTitle="Persetujuan Alat"
      pageDescription="Validasi berkas permohonan praktikum mahasiswa, verifikasi ketersediaan stok, dan eksekusi tindakan persetujuan."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 w-full">
            <Loader2
              className="animate-spin text-zinc-950 dark:text-zinc-50"
              size={28}
            />
            <p className="text-[10px] font-mono font-black tracking-widest text-zinc-400 uppercase">
              Sinkronisasi parameter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            <StatCard
              title="Total log"
              value={stats.total}
              icon={<Inbox size={14} />}
            />
            <StatCard
              title="Booking"
              value={stats.booking}
              icon={<CalendarIcon size={14} />}
            />
            <StatCard
              title="Menunggu"
              value={stats.pending}
              icon={<Clock size={14} />}
            />
            <StatCard
              title="Disetujui"
              value={stats.approved}
              icon={<Check size={14} />}
            />
            <StatCard
              title="Berlangsung"
              value={stats.ongoing}
              icon={<Activity size={14} />}
            />
          </div>
        )}

        {/* PANEL BARU: KOMPONEN FILTER DAN TOMBOL TOGGLE AUTO ACC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 w-full">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase pl-0.5">
              Filter kelas:
            </label>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 px-3 bg-white dark:bg-zinc-950 rounded-none border-2 border-zinc-950 dark:border-zinc-800 text-xs font-mono font-black tracking-wide appearance-none outline-none text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <option value="all">Semua kelas</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase pl-0.5">
              Filter status persetujuan:
            </label>
            <select
              value={accStatusFilter}
              onChange={(e) => {
                setAccStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 px-3 bg-white dark:bg-zinc-950 rounded-none border-2 border-zinc-950 dark:border-zinc-800 text-xs font-mono font-black tracking-wide appearance-none outline-none text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
            >
              <option value="all">Semua status</option>
              <option value="unapproved">Belum di acc</option>
            </select>
          </div>

          <div className="text-left">
            <Button
              variant="brutal"
              type="button"
              onClick={() => setIsAutoAccActive(!isAutoAccActive)}
              className={`w-full h-11 text-[10px] font-mono font-black gap-2 rounded-none transition-all border-2 border-zinc-950 uppercase tracking-wider ${
                isAutoAccActive
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-none"
                  : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white"
              }`}
            >
              {isAutoAccActive ? (
                <>
                  <Zap size={13} className="animate-bounce" /> Auto acc aktif
                </>
              ) : (
                <>
                  <ZapOff size={13} /> Aktifkan auto acc
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Laboratorium</TableHead>
                <TableHead>Manifest alat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-center">
                  Aksi manajemen
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono font-black text-zinc-400 text-xs pl-6">
                #{item.id}
              </TableCell>
              
              {/* 1. PERBAIKAN: Menampilkan Nama, NIM, dan Kelas */}
              <TableCell>
                <div className="font-mono font-black text-xs text-zinc-900 dark:text-zinc-100">
                  {item.nama_mahasiswa || "Nama pengaju"}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold mt-0.5">
                  NIM: {item.nim_mahasiswa || "---"} • Kelas: {item.kelas_mahasiswa || "---"}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-sans font-black text-zinc-800 dark:text-zinc-200 text-xs">
                  {item.ruangan_lab}
                </div>
                {/* 2. PERBAIKAN: Menampilkan Tujuan Penggunaan */}
                <div className="text-[10px] font-sans text-zinc-400 dark:text-zinc-500 truncate max-w-[140px] mt-0.5 font-medium">
                  Tujuan: {item.tujuan_penggunaan || "-"}
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1.5 max-w-[180px]">
                  {/* Pastikan struktur data details Anda tetap sinkron dengan API */}
                  {item.details?.map((det: any) => (
                    <div
                      key={det.id}
                      className="text-[10px] font-mono font-black text-zinc-600 dark:text-zinc-400 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-none px-2 py-0.5 shadow-none"
                    >
                      <span className="truncate pr-1">{det.alat?.nama_alat}</span>
                      <span className="text-zinc-900 dark:text-zinc-100 shrink-0">x{det.jumlah_pinjam}</span>
                    </div>
                  ))}
                </div>
              </TableCell>
              
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex items-center justify-center gap-2 min-w-[160px]">
                      {["pending", "menunggu"].includes(item.status?.toLowerCase().trim()) ? (
                        <>
                          <Button
                            onClick={() => handleSetujui(item.id, item.status)}
                            disabled={processing === item.id}
                            variant="brutal"
                            className="flex-1 h-8 px-3 rounded-none bg-zinc-950 text-white text-[9px] font-mono font-black tracking-wider shadow-none"
                          >
                            {processing === item.id ? (
                              <Loader2 className="animate-spin h-3 w-3" />
                            ) : (
                              <div className="flex items-center gap-1">
                                <Check size={11} />
                                <span>Setujui</span>
                              </div>
                            )}
                          </Button>

                          <Button
                            onClick={() => openRejectModal(item.id)}
                            disabled={processing === item.id}
                            variant="brutal"
                            className="flex-1 h-8 px-3 rounded-none bg-red-500 hover:bg-red-600 text-white text-[9px] font-mono font-black tracking-wider shadow-none border-zinc-950"
                          >
                            <X size={11} className="mr-0.5" />
                            <span>Tolak</span>
                          </Button>
                        </>
                      ) : (
                        <span className="text-[10px] font-mono font-black text-zinc-300 dark:text-zinc-700 tracking-widest py-1">
                          Selesai evaluasi
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && !loading && (
            <div className="p-16 text-center text-zinc-400 dark:text-zinc-600 font-mono text-[10px] font-black uppercase tracking-widest border-2 border-t-0 border-zinc-950 dark:border-zinc-800">
              Tidak ada antrean pengajuan logbook
            </div>
          )}
        </div>

        {/* SEKTOR PAGINASI BARU */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4 w-full">
          <span className="text-xs text-zinc-400 font-mono font-black uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <LoanPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <OverlayModal
          isOpen={isRejectModalOpen}
          onClose={() => !processing && setIsRejectModalOpen(false)}
          title="Reject Loan Form"
        >
          <div className="p-6 pb-4 flex flex-row items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="text-left">
              <h2 className="text-lg font-mono font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                Tolak berkas permohonan
              </h2>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-black uppercase mt-0.5 tracking-wider">
                Log id target: #{selectedId}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsRejectModalOpen(false)}
              variant="brutal"
              className="bg-red-500 h-9 w-9 px-0 flex items-center justify-center rounded-none shadow-none shrink-0"
            >
              <X size={14} />
            </Button>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 text-left">
            <textarea
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              placeholder="Tulis alasan penolakan inventaris secara detail..."
              className="w-full h-28 p-4 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none outline-none font-mono font-black text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 resize-none transition-colors"
            />
          </div>

          <div className="p-4 border-t-2 border-zinc-950 dark:border-zinc-800 flex gap-3 justify-end bg-zinc-50 dark:bg-zinc-950">
            <Button
              onClick={() => setIsRejectModalOpen(false)}
              disabled={processing !== null}
              variant="brutal"
              className="rounded-none h-11 px-4 font-mono font-black text-xs tracking-wider uppercase"
            >
              Batal
            </Button>
            <Button
              onClick={confirmTolak}
              disabled={!alasanTolak.trim() || processing !== null}
              variant="brutal"
              className="bg-zinc-950 text-white h-11 px-5 rounded-none font-mono font-black text-xs tracking-wider uppercase"
            >
              {processing ? "Memproses..." : "Konfirmasi tolak"}
            </Button>
          </div>
        </OverlayModal>
      </div>
    </PageLayout>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none text-left">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-0.5">
            {title}
          </p>
          <p className="text-xl font-mono font-black text-zinc-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="w-8 h-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 shadow-none">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "text-amber-600 border-zinc-950 dark:border-zinc-800",
    booking: "text-zinc-800 border-zinc-950 dark:border-zinc-800",
    pesanan: "text-zinc-800 border-zinc-950 dark:border-zinc-800",
    approved: "text-emerald-600 border-zinc-950 dark:border-zinc-800",
    disetujui: "text-emerald-600 border-zinc-950 dark:border-zinc-800",
    ongoing: "text-purple-600 border-zinc-950 dark:border-zinc-800",
    rejected: "text-red-500 border-zinc-950 dark:border-zinc-800",
  };

  const label =
    status === "approved" || status === "disetujui" ? "Terjadwal" : status;

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 rounded-none text-[9px] font-mono font-black uppercase tracking-widest border-2 bg-white dark:bg-zinc-900 shadow-none ${styles[status?.toLowerCase().trim()] || "text-zinc-400 border-zinc-300"}`}
    >
      {label}
    </Badge>
  );
}
