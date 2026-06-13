import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Webcam from "react-webcam";
import DetailPeminjamanModal from "./DetailPeminjamanModal";
import { LoanStatsGrid } from "../../../components/organism/LoanStatGrid";
import { LoanCard } from "../../../components/molecules/LoanCard";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { LoanStatusTabs } from "../../../components/organism/LoanStatusTabs";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { PageLayout } from "../../../layouts/PageLayout";
import { Button } from "../../../components/ui/button";
import api from "../../../services/api";
import { Loader2, ClipboardX, Camera, X } from "lucide-react";
import Swal from "sweetalert2";
 
type StatusTab = "ALL" | "PENDING" | "APPROVED" | "ONGOING" | "SELESAI" | "DITOLAK";
const TABS_LIST: StatusTab[] = ["ALL", "PENDING", "APPROVED", "ONGOING", "SELESAI", "DITOLAK"];

export default function PeminjamanPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  
  const webcamRef = useRef<Webcam>(null);

  const fetchMyLoans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mahasiswa/riwayat-saya");
      const responseData = Array.isArray(res.data) ? res.data : res.data.data || [];

      const normalizedLoans = responseData.map((item: any) => {
        let mappedStatus = item.status;
        if (item.status === "menunggu") mappedStatus = "pending";
        else if (["dipesan", "disetujui"].includes(item.status)) mappedStatus = "approved";
        else if (item.status === "berlangsung") mappedStatus = "ongoing";
        else if (item.status === "selesai") mappedStatus = "selesai";
        else if (item.status === "ditolak") mappedStatus = "ditolak";
        return { ...item, status: mappedStatus };
      });

      setList(normalizedLoans);
    } catch (err) {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyLoans(); }, [fetchMyLoans]);

  // Fungsi menangkap foto dan upload langsung
  const captureAndUpload = async () => {
    if (showCamera === null) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], "pengambilan.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("foto_before", file);

    try {
      setUploading(showCamera);
      await api.post(`/peminjaman/${showCamera}/upload-before`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Sukses", "Foto berhasil disimpan! Status kini Ongoing.", "success");
      fetchMyLoans(); // Refresh untuk pindah tab ke ONGOING
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Gagal mengunggah.", "error");
    } finally {
      setUploading(null);
      setShowCamera(null);
    }
  };

  const filteredList = useMemo(() => {
    return list.filter((item) => activeTab === "ALL" || item.status?.toUpperCase() === activeTab);
  }, [list, activeTab]);

  const paginatedList = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(offset, offset + itemsPerPage);
  }, [filteredList, currentPage]);

  return (
    <PageLayout pageTitle="Riwayat Peminjaman" pageDescription="Kelola status dan logbook alat.">
      {/* Modal Kamera Otomatis */}
      {showCamera !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-white p-4 w-full max-w-sm rounded-xl">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full rounded-lg" 
            videoConstraints={{
            facingMode: { exact: "environment" } // Memaksa kamera belakang
          }}/>
            <div className="flex gap-2 mt-4">
              <Button onClick={captureAndUpload} className="flex-1"><Camera className="mr-2" size={16}/> Ambil & Kirim</Button>
              <Button variant="outline" onClick={() => setShowCamera(null)}><X size={16}/></Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <LoanStatsGrid stats={useMemo(() => ({ total: list.length, menunggu: list.filter(i=>i.status==="pending").length, disetujui: list.filter(i=>i.status==="approved").length, berlangsung: list.filter(i=>i.status==="ongoing").length, selesai: list.filter(i=>i.status==="selesai").length, ditolak: list.filter(i=>i.status==="ditolak").length, dipesan: 0 }), [list])} />
        
        <LoanStatusTabs tabs={TABS_LIST} activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setCurrentPage(1); }} listData={list} />

        {loading ? (
          <div className="flex flex-col items-center py-28 gap-3 border-2 border-zinc-950"><Loader2 className="animate-spin h-7 w-7" /><p className="text-[9px] font-black uppercase tracking-widest">Sinkronisasi...</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {paginatedList.map((item) => (
              <LoanCard
                key={item.id} item={item} uploading={uploading === item.id}
                onCardClick={() => { setSelectedData(item); setIsModalOpen(true); }}
                // Langsung memicu kamera saat tombol diklik
                onFileChange={(id) => setShowCamera(id)}
              />
            ))}
          </div>
        )}
        <DetailPeminjamanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedData} />
      </div>
    </PageLayout>
  );
}