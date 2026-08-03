import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Webcam from "react-webcam";
import DetailPeminjamanModal from "./DetailPeminjamanModal";
import { LoanStatsGrid } from "../../../components/organism/LoanStatGrid";
import { LoanCard } from "../../../components/molecules/LoanCard";
import { LoanStatusTabs } from "../../../components/organism/LoanStatusTabs";
import { PageLayout } from "../../../layouts/PageLayout";
import { Button } from "../../../components/ui/button";
import api from "../../../services/api";
import { Loader2, Camera, X, RotateCcw, Send } from "lucide-react";
import Swal from "sweetalert2";
 
type StatusTab = "ALL" | "PENDING" | "APPROVED" | "ONGOING" | "SELESAI" | "DITOLAK";
const TABS_LIST: StatusTab[] = ["ALL", "PENDING", "APPROVED", "ONGOING", "SELESAI", "DITOLAK"];

export default function PeminjamanPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [masterMatkul, setMasterMatkul] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;
  
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const fetchMasterMatkul = async () => {
      try {
        const res = await api.get("/jadwal-polines");
        if (res.data && res.data.success && res.data.data) {
          setMasterMatkul(res.data.data);
        }
      } catch (err) {
        console.error("Gagal memuat master matkul:", err);
      }
    };
    fetchMasterMatkul();
  }, []);

  const fetchMyLoans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mahasiswa/riwayat-saya");
      const responseData = Array.isArray(res.data) ? res.data : res.data.data || [];

      const normalizedLoans = responseData.map((item: any) => {
        let mappedStatus = "pending";
        const sId = Number(item.status_id);
        const sText = (item.status || "").toLowerCase().trim();

        if (sId === 2 || sText === "disetujui" || sText === "approved" || sText === "dipesan") {
          mappedStatus = "approved";
        } else if (sId === 3 || sText === "ditolak" || sText === "rejected") {
          mappedStatus = "ditolak";
        } else if (sId === 4 || sText === "selesai") {
          mappedStatus = "selesai";
        } else if (sId === 5 || sText === "berlangsung" || sText === "ongoing") {
          mappedStatus = "ongoing";
        } else if (sId === 6 || sText === "menunggu_pengecekan") {
          mappedStatus = "menunggu_pengecekan";
        } else {
          mappedStatus = "pending";
        }

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

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const handleUploadFinal = async () => {
    if (showCamera === null || !capturedImage) return;

    try {
      setUploading(showCamera);
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], "pengambilan.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("foto_before", file);

      await api.post(`/peminjaman/${showCamera}/upload-before`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Sukses", "Foto berhasil disimpan! Status kini Berlangsung.", "success");
      setShowCamera(null);
      setCapturedImage(null);
      fetchMyLoans(); 
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Gagal mengunggah.", "error");
    } finally {
      setUploading(null);
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
      {showCamera !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-white dark:bg-zinc-900 p-4 w-full max-w-sm rounded-xl space-y-4">
            {!capturedImage ? (
              <>
                <Webcam 
                  ref={webcamRef} 
                  screenshotFormat="image/jpeg" 
                  className="w-full rounded-lg" 
                  videoConstraints={{ facingMode: "user" }}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCapture} className="flex-1">
                    <Camera className="mr-2" size={16}/> Ambil Foto
                  </Button>
                  <Button variant="outline" onClick={() => { setShowCamera(null); setCapturedImage(null); }}>
                    <X size={16}/>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-center text-zinc-700 dark:text-zinc-300">Preview Foto (Pastikan tidak buram)</p>
                  <img src={capturedImage} alt="Preview" className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCapturedImage(null)} className="flex-1">
                    <RotateCcw className="mr-2" size={16}/> Ulangi
                  </Button>
                  <Button onClick={handleUploadFinal} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Send className="mr-2" size={16}/> Kirim
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <LoanStatsGrid stats={useMemo(() => ({ 
          total: list.length, 
          menunggu: list.filter(i=>i.status==="pending").length, 
          disetujui: list.filter(i=>i.status==="approved").length, 
          berlangsung: list.filter(i=>i.status==="ongoing").length, 
          selesai: list.filter(i=>i.status==="selesai").length, 
          ditolak: list.filter(i=>i.status==="ditolak").length, 
          pesan: 0 
        }), [list])} />
        
        <LoanStatusTabs tabs={TABS_LIST} activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setCurrentPage(1); }} listData={list} />

        {loading ? (
          <div className="flex flex-col items-center py-28 gap-3 border-2 border-zinc-950"><Loader2 className="animate-spin h-7 w-7" /><p className="text-[9px] font-black uppercase tracking-widest">Sinkronisasi...</p></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {paginatedList.map((item) => (
              <LoanCard
                key={item.id} 
                item={item} 
                uploading={uploading === item.id}
                onCardClick={() => { setSelectedData(item); setIsModalOpen(true); }}
                onFileChange={(id) => { setShowCamera(id); setCapturedImage(null); }}
              />
            ))}
          </div>
        )}
        <DetailPeminjamanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedData} />
      </div>
    </PageLayout>
  );
}