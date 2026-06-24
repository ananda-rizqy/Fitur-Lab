import { useEffect, useState, useMemo } from "react";
import api from "../../../services/api";
import {
  Check,
  Clock,
  Inbox,
  Activity,
  Calendar as CalendarIcon,
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchPeminjaman = async (showLoading = false) => {
  try {
    if (showLoading) setLoading(true);
    const res = await api.get(`/peminjaman/semua?t=${Date.now()}`);
    const rawData = Array.isArray(res.data) ? res.data : res.data.data || [];
    
    if (lastCount > 0 && rawData.length > lastCount) {
        new Notification("Peminjaman Baru!", { 
            body: `Ada ${rawData.length - lastCount} pengajuan peminjaman baru masuk.` 
        });
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
    // Refresh otomatis setiap 30 detik
    const interval = setInterval(() => fetchPeminjaman(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSetujui = async (id: number, currentStatus: string) => {
    const isBooking = currentStatus === "booking" || currentStatus === "pesanan";
    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      text: isBooking ? "Setujui pesanan ini? Status akan menjadi 'Terjadwal'." : "Setujui peminjaman langsung? Stok akan berkurang.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#18181b",
      customClass: { confirmButton: "rounded-none font-mono", cancelButton: "rounded-none font-mono" },
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(id);
      await api.post(`/peminjaman/${id}/setujui`);
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
      await api.post(`/peminjaman/${selectedId}/tolak`, { alasan: alasanTolak });
      setIsRejectModalOpen(false);
      Swal.fire("Berkas ditolak", "Pengajuan resmi ditolak.", "info");
      fetchPeminjaman(false);
    } catch (err: any) {
      Swal.fire("Gagal!", "Gagal menolak berkas.", "error");
    } finally {
      setProcessing(null);
      setSelectedId(null);
    }
  };

  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    dataPinjam.forEach((item: any) => { if (item.user?.kelas) classes.add(item.user.kelas.trim()); });
    return Array.from(classes);
  }, [dataPinjam]);

  const filteredData = useMemo(() => {
    return dataPinjam.filter((item: any) => {
      if (classFilter !== "all" && item.user?.kelas !== classFilter) return false;
      if (accStatusFilter === "unapproved") {
        const st = item.status?.toLowerCase().trim();
        return st === "pending" || st === "menunggu" || st === "dipesan";
      }
      return true;
    });
  }, [dataPinjam, classFilter, accStatusFilter]);

  const stats = useMemo(() => ({
  total: filteredData.length,
  menunggu: filteredData.filter((i: any) => 
    ["pending", "menunggu"].includes(i.status?.toLowerCase())
  ).length,
  selesai: filteredData.filter((i: any) => 
    ["approved", "disetujui", "selesai"].includes(i.status?.toLowerCase())
  ).length,
  berlangsung: filteredData.filter((i: any) => 
    i.status?.toLowerCase() === "ongoing"
  ).length,
}), [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredData, currentPage]);

  return (
    <PageLayout pageTitle="Persetujuan Alat" pageDescription="Validasi permohonan secara real-time.">
      <div className="py-6 space-y-6 antialiased bg-white dark:bg-zinc-950">
        {loading ? (
            <div className="py-20 flex flex-col items-center gap-2"><Loader2 className="animate-spin" size={28} /><p className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">Sinkronisasi...</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Log" value={stats.total} icon={<Inbox size={14} />} />
            <StatCard title="Menunggu" value={stats.menunggu} icon={<Clock size={14} />} />
            <StatCard title="Disetujui/Selesai" value={stats.selesai} icon={<Check size={14} />} />
            <StatCard title="Berlangsung" value={stats.berlangsung} icon={<Activity size={14} />} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800">
          <select onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }} className="h-11 px-3 border-2 border-zinc-950 text-xs font-mono font-black uppercase">
            <option value="all">Semua kelas</option>
            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select onChange={(e) => { setAccStatusFilter(e.target.value); setCurrentPage(1); }} className="h-11 px-3 border-2 border-zinc-950 text-xs font-mono font-black uppercase">
            <option value="all">Semua status</option>
            <option value="unapproved">Belum di acc</option>
          </select>
        </div>

        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Mahasiswa</TableHead><TableHead>Laboratorium</TableHead><TableHead>Manifest</TableHead><TableHead>Status</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
  {paginatedData.map((item: any) => (
    <TableRow key={item.id}>
      <TableCell className="font-mono font-black text-zinc-400">#{item.id}</TableCell>
      
      {/* Kolom Mahasiswa */}
      <TableCell>
        <div className="font-black text-xs">{item.nama_mahasiswa}</div>
        <div className="text-[10px] text-zinc-500 font-mono">NIM: {item.nim_mahasiswa} • {item.kelas_mahasiswa}</div>
      </TableCell>
      
      <TableCell>
        <div className="text-xs font-black mb-1">{item.ruangan_lab}</div>
        <div className="text-[9px] font-mono font-bold text-zinc-500 uppercase mb-2">
        </div>
        
        {item.jenis_peminjaman?.toLowerCase() === 'pesanan' && (
          <div className="mb-2 p-2 border border-zinc-200 w-fit text-[10px] font-mono">
            <div className="text-zinc-400">Jadwal:</div>
            <div className="font-black">
              {item.waktu_mulai && new Date(item.waktu_mulai).toLocaleDateString('id-ID', {day:'numeric', month:'short'})}{" "}
              {item.waktu_mulai && new Date(item.waktu_mulai).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
            </div>
            <div className="font-black">
              s/d {item.waktu_selesai && new Date(item.waktu_selesai).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
            </div>
          </div>
        )}
        
        <div className="text-[10px] font-mono text-zinc-400 font-medium">
          Tujuan: <span className="text-zinc-600">{item.tujuan_penggunaan || "-"}</span>
        </div>
      </TableCell>

      {/* Kolom Manifest */}
      <TableCell>
        {item.details?.map((d: any) => (
          <div key={d.id} className="text-[10px] font-mono border-b border-zinc-100 py-1">
            {d.alat.nama_alat} <span className="font-black">x{d.jumlah_pinjam}</span>
          </div>
        ))}
      </TableCell>
      
      <TableCell><StatusBadge status={item.status} /></TableCell>
      
      {/* Kolom Aksi */}
      <TableCell>
        {["pending", "menunggu"].includes(item.status?.toLowerCase()) ? (
          <div className="flex flex-col gap-1.5">
            <Button size="sm" variant="brutal" className="h-7 text-[10px] py-0" onClick={() => handleSetujui(item.id, item.status)}>Setujui</Button>
            <Button size="sm" variant="brutal" className="h-7 text-[10px] py-0 bg-red-500 hover:bg-red-600" onClick={() => { setSelectedId(item.id); setIsRejectModalOpen(true); }}>Tolak</Button>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Selesai</span>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
        <LoanPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <OverlayModal isOpen={isRejectModalOpen} onClose={() => !processing && setIsRejectModalOpen(false)} title="Tolak Berkas">
          <textarea className="w-full h-20 p-2 border-2 border-zinc-950" onChange={(e) => setAlasanTolak(e.target.value)} />
          <Button onClick={confirmTolak} className="mt-4 w-full rounded-none">Konfirmasi Tolak</Button>
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
        {/* Ikon tetap dipertahankan di sini */}
        <div className="w-8 h-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0 shadow-none">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    const color = status === "approved" || status === "disetujui" ? "text-emerald-600" : "text-amber-600";
    return <Badge variant="outline" className={`${color} px-2 py-1 rounded-none`}>{status}</Badge>;
}