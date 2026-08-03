import { useEffect, useState, useMemo } from "react";
import api from "../../../services/api";
import {
  Check,
  Clock,
  Inbox,
  Activity,
  Loader2,
  X,
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
import { Input } from "../../../components/ui/input";
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
  const [lastCount, setLastCount] = useState<number>(0);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [accStatusFilter, setAccStatusFilter] = useState<string>("all");
  
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchPeminjaman = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await api.get(`/peminjaman/semua?t=${Date.now()}`);
      const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
      
      if (lastCount > 0 && rawData.length > lastCount) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Peminjaman Baru!", { 
              body: `Ada ${rawData.length - lastCount} pengajuan peminjaman baru masuk.` 
          });
        }
      }
      
      setLastCount(rawData.length);
      setDataPinjam(rawData);
    } catch (err) {
      console.error("Gagal mengambil data peminjaman:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
   
    fetchPeminjaman(true);
    const interval = setInterval(() => fetchPeminjaman(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // 🌟 PERBAIKAN: Menghilangkan parameter jenisPeminjaman karena sudah tidak dipakai
  const handleSetujui = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      text: "Setujui pengajuan peminjaman ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#18181b",
      customClass: { confirmButton: "rounded-none font-mono", cancelButton: "rounded-none font-mono" },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(id);
      await api.patch(`/peminjaman/${id}/status`, { status_id: 2 });
      Swal.fire("Berhasil!", "Pengajuan disetujui.", "success");
      fetchPeminjaman(false);
    } catch (err: any) {
      Swal.fire("Gagal!", err.response?.data?.message || "Terjadi kesalahan.", "error");
    } finally {
      setProcessing(null);
    }
  };

  const confirmTolak = async () => {
    if (!alasanTolak.trim() || !selectedId) return;
    try {
      setProcessing(selectedId);
      await api.patch(`/peminjaman/${selectedId}/status`, { 
        status_id: 3, 
        alasan_penolakan: alasanTolak 
      });
      setIsRejectModalOpen(false);
      setAlasanTolak("");
      Swal.fire("Berkas ditolak", "Pengajuan resmi ditolak.", "info");
      fetchPeminjaman(false);
    } catch (err: any) {
      Swal.fire("Gagal!", err.response?.data?.message || "Gagal menolak berkas.", "error");
    } finally {
      setProcessing(null);
      setSelectedId(null);
    }
  };

  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    dataPinjam.forEach((item: any) => { if (item.kelas_mahasiswa) classes.add(item.kelas_mahasiswa.trim()); });
    return Array.from(classes);
  }, [dataPinjam]);

  const filteredData = useMemo(() => {
    return dataPinjam.filter((item: any) => {
      if (classFilter !== "all" && item.kelas_mahasiswa !== classFilter) return false;
      
      if (accStatusFilter === "unapproved") {
        const st = item.status?.toLowerCase().trim();
        if (!(st === "pending" || st === "menunggu" || st === "dipesan")) return false;
      }

      if (startDateFilter || endDateFilter) {
        if (!item.waktu_mulai && !item.waktu_selesai) return false;

        try {
          const itemStart = item.waktu_mulai ? new Date(item.waktu_mulai).setHours(0,0,0,0) : null;
          const itemEnd = item.waktu_selesai ? new Date(item.waktu_selesai).setHours(23,59,59,999) : itemStart;

          if (startDateFilter) {
            const filterStart = new Date(startDateFilter).setHours(0,0,0,0);
            if (itemEnd && itemEnd < filterStart) return false;
          }

          if (endDateFilter) {
            const filterEnd = new Date(endDateFilter).setHours(23,59,59,999);
            if (itemStart && itemStart > filterEnd) return false;
          }
        } catch (e) {
          return false;
        }
      }

      return true;
    });
  }, [dataPinjam, classFilter, accStatusFilter, startDateFilter, endDateFilter]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    menunggu: filteredData.filter((i: any) => 
      ["pending", "menunggu"].includes(i.status?.toLowerCase())
    ).length,
    selesai: filteredData.filter((i: any) => 
      ["approved", "disetujui", "selesai"].includes(i.status?.toLowerCase())
    ).length,
    berlangsung: filteredData.filter((i: any) => 
      i.status?.toLowerCase() === "ongoing" || i.status?.toLowerCase() === "berlangsung"
    ).length,
  }), [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredData, currentPage]);

  const resetFilters = () => {
    setClassFilter("all");
    setAccStatusFilter("all");
    setStartDateFilter("");
    setEndDateFilter("");
    setCurrentPage(1);
  };

  return (
    <PageLayout pageTitle="Persetujuan Alat" pageDescription="Validasi permohonan secara real-time.">
      <div className="py-6 space-y-6 antialiased bg-white dark:bg-zinc-950 text-left">
        {loading ? (
            <div className="py-20 flex flex-col items-center gap-2"><Loader2 className="animate-spin" size={28} /><p className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">Sinkronisasi...</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Log" value={stats.total} icon={<Inbox size={14} />} />
            <StatCard title="Menunggu" value={stats.menunggu} icon={<Clock size={14} />} />
            <StatCard title="Disetujui" value={stats.selesai} icon={<Check size={14} />} />
            <StatCard title="Berlangsung" value={stats.berlangsung} icon={<Activity size={14} />} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 items-end">
          
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-500">Filter Kelas</label>
            <select 
              value={classFilter}
              onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }} 
              className="h-11 px-3 border-2 border-zinc-950 text-xs font-mono font-black uppercase bg-white dark:bg-zinc-950 dark:text-white rounded-none"
            >
              <option value="all">Semua kelas</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-500">Filter Status</label>
            <select 
              value={accStatusFilter}
              onChange={(e) => { setAccStatusFilter(e.target.value); setCurrentPage(1); }} 
              className="h-11 px-3 border-2 border-zinc-950 text-xs font-mono font-black uppercase bg-white dark:bg-zinc-950 dark:text-white rounded-none"
            >
              <option value="all">Semua status</option>
              <option value="unapproved">Belum di acc</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-500">Dari Tanggal (Estimasi)</label>
            <Input 
              type="date"
              value={startDateFilter}
              onChange={(e) => { setStartDateFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 border-2 border-zinc-950 rounded-none text-xs font-mono font-bold bg-white dark:bg-zinc-950"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[9px] font-mono font-black uppercase tracking-wider text-zinc-500">Sampai Tanggal (Estimasi)</label>
            <div className="flex gap-2">
              <Input 
                type="date"
                value={endDateFilter}
                onChange={(e) => { setEndDateFilter(e.target.value); setCurrentPage(1); }}
                className="h-11 border-2 border-zinc-950 rounded-none text-xs font-mono font-bold bg-white dark:bg-zinc-950 flex-1"
              />
              {(classFilter !== "all" || accStatusFilter !== "all" || startDateFilter || endDateFilter) && (
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="h-11 px-3 border-2 border-zinc-950 rounded-none font-mono text-xs shrink-0"
                  title="Reset Filter"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>

        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Mahasiswa & Registrasi</TableHead>
              <TableHead>Laboratorium & Estimasi</TableHead>
              <TableHead>Manifest Item</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-xs font-mono text-zinc-400">
                  Tidak ada data peminjaman yang sesuai dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-black text-zinc-400">#{item.id}</TableCell>
                  
                  <TableCell>
                    <div className="font-black text-xs">{item.nama_mahasiswa}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">NIM: {item.nim_mahasiswa} • {item.kelas_mahasiswa}</div>
                    <div className="mt-1.5 text-[9px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 w-fit border border-zinc-200">
                      Diajukan: {
                        (item.created_at || (item.details && item.details[0]?.created_at)) 
                          ? new Date(item.created_at || item.details[0]?.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) 
                          : '-'
                      }
                    </div>
                  </TableCell>
                    
                  <TableCell>
                    <div className="text-xs font-black mb-1">{item.ruangan_lab}</div>
                    
                    {/* 🌟 PERBAIKAN: Langsung tampilkan Estimasi Jadwal tanpa pengecekan jenis_peminjaman */}
                    <div className="mb-2 p-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 w-fit text-[10px] font-mono space-y-0.5">
                      <div className="text-zinc-400 font-bold uppercase text-[9px]">Estimasi Jadwal:</div>
                      <div className="font-black text-zinc-800 dark:text-zinc-200">
                        Mulai: {item.waktu_mulai ? new Date(item.waktu_mulai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                      </div>
                      <div className="font-black text-zinc-800 dark:text-zinc-200">
                        Selesai: {item.waktu_selesai ? new Date(item.waktu_selesai).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                      </div>
                      {item.durasi && (
                        <div className="text-zinc-500 text-[9px] font-bold">Durasi: {item.durasi} Jam</div>
                      )}
                    </div>
                    
                    <div className="text-[10px] font-mono text-zinc-500">
                      Tujuan: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{item.tujuan_penggunaan || item.tujuan || "-"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {item.details?.map((d: any) => {
                      let tags = [];
                      try {
                        if (Array.isArray(d.kode_tag_list)) {
                          tags = d.kode_tag_list;
                        } else if (typeof d.kode_tag_list === 'string') {
                          tags = JSON.parse(d.kode_tag_list);
                        }
                      } catch (e) {
                        tags = [];
                      }

                      return (
                        <div key={d.id} className="text-[10px] font-mono border-b border-zinc-100 dark:border-zinc-800 py-1">
                          <span className="font-bold">{d.alat?.nama_alat || d.bahan?.nama_bahan || `Item #${d.item_id}`}</span> 
                          <span className="font-black text-zinc-600 dark:text-zinc-400"> (x{d.qty})</span>
                          {Array.isArray(tags) && tags.length > 0 && (
                            <div className="text-[9px] text-zinc-400">Tag: {tags.join(", ")}</div>
                          )}
                        </div>
                      );
                    })}
                  </TableCell>
                    
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                    
                  <TableCell>
                    {["pending", "menunggu"].includes(item.status?.toLowerCase()) ? (
                      <div className="flex flex-col gap-1.5">
                        <Button 
                          size="sm" 
                          variant="brutal" 
                          className="h-7 text-[10px] py-0" 
                          disabled={processing === item.id}
                          // 🌟 PERBAIKAN: handleSetujui hanya butuh ID sekarang
                          onClick={() => handleSetujui(item.id)}
                        >
                          {processing === item.id ? <Loader2 className="animate-spin w-3 h-3" /> : "Setujui"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="brutal" 
                          className="h-7 text-[10px] py-0 bg-red-500 hover:bg-red-600 text-white" 
                          disabled={processing === item.id}
                          onClick={() => { setSelectedId(item.id); setIsRejectModalOpen(true); }}
                        >
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{item.status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <LoanPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <OverlayModal isOpen={isRejectModalOpen} onClose={() => !processing && setIsRejectModalOpen(false)} title="Tolak Berkas Pengajuan">
        <div className="space-y-3">
          <p className="text-xs text-zinc-500 font-mono">Tuliskan alasan penolakan peminjaman alat/bahan:</p>
          <textarea 
            className="w-full h-24 p-2 text-xs border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950" 
            placeholder="Contoh: Stok alat sedang dalam perbaikan..."
            value={alasanTolak}
            onChange={(e) => setAlasanTolak(e.target.value)} 
          />
          <Button 
            onClick={confirmTolak} 
            disabled={!alasanTolak.trim() || processing !== null}
            className="w-full rounded-none bg-red-500 hover:bg-red-600 text-white font-mono"
          >
            {processing !== null ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null} Konfirmasi Tolak
          </Button>
        </div>
      </OverlayModal>
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
    const isApproved = ["approved", "disetujui"].includes(status?.toLowerCase());
    const isRejected = ["ditolak", "rejected"].includes(status?.toLowerCase());
    
    let color = "text-amber-600 border-amber-600 bg-amber-50";
    if (isApproved) color = "text-emerald-600 border-emerald-600 bg-emerald-50";
    if (isRejected) color = "text-red-600 border-red-600 bg-red-50";

    return <Badge variant="outline" className={`${color} px-2 py-1 rounded-none font-mono text-[10px] uppercase font-bold`}>{status}</Badge>;
}