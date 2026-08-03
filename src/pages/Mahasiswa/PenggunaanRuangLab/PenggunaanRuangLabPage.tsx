import { useState, type FormEvent, useEffect, useRef, useCallback } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { Camera, Loader2, RefreshCcw, CalendarClock, Clock } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { PageLayout } from "../../../layouts/PageLayout";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

const RUANGAN_LIST = [
  { id: 1, name: "Lab. TK Barat I/01" },
  { id: 2, name: "Lab. TK Barat I/02" },
  { id: 3, name: "Lab. TK Barat I/04" },
  { id: 4, name: "Lab. TK Timur I/01" },
  { id: 5, name: "Lab. TK Timur I/02" },
  { id: 6, name: "Lab. TK Timur II/01" },
];

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

type Step = "reservasi" | "checkIn" | "checkOut";

export function PenggunaanRuangLabPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("reservasi");
  const [idLaporan, setIdLaporan] = useState<number | null>(null);
  const [ruangSibuk, setRuangSibuk] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // STATE PENYIMPANAN WAKTU
  const [waktuCheckInAktif, setWaktuCheckInAktif] = useState<string | null>(null);
  const [waktuMulaiAktif, setWaktuMulaiAktif] = useState<string | null>(null); // 🌟 Menyimpan waktu mulai reservasi
  
  // 🌟 STATE VALIDASI WAKTU CHECK-IN (10 Menit Toleransi)
  const [isTimeAllowed, setIsTimeAllowed] = useState(true);
  const [unlockTimeText, setUnlockTimeText] = useState("");

  const [jadwalLab, setJadwalLab] = useState<any[]>([]);
  const [loadingJadwal, setLoadingJadwal] = useState(false);

  const [formData, setFormData] = useState({
    ruangan_lab_id: "",
    kondisi: "",
    tujuan_penggunaan: "",
    waktu_mulai: "",
    waktu_selesai: "",
    fotoPreview: null as string | null,
  });

  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("active_lab_session");
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setIdLaporan(parsed.id);
      setStep(parsed.step);
      if (parsed.waktuCheckIn) setWaktuCheckInAktif(parsed.waktuCheckIn);
      if (parsed.waktuMulai) setWaktuMulaiAktif(parsed.waktuMulai); // 🌟 Ambil waktu mulai yang disave
    }
    refreshStatusRuang();
  }, []);

  // 🌟 VALIDASI WAKTU CHECK-IN SECARA REAL-TIME
  useEffect(() => {
    if (step !== "checkIn" || !waktuMulaiAktif) {
      setIsTimeAllowed(true);
      return;
    }

    const checkTime = () => {
      const now = new Date().getTime();
      // Input datetime-local menggunakan format standar ISO yang aman di-parse
      const waktuMulai = new Date(waktuMulaiAktif).getTime();
      
      const menitToleransi = 10; 
      const toleransiMs = menitToleransi * 60 * 1000;

      const unlockDate = new Date(waktuMulai - toleransiMs);
      setUnlockTimeText(unlockDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

      // Jika sekarang sudah melewati batas toleransi, izinkan check-in
      if (now >= (waktuMulai - toleransiMs)) {
        setIsTimeAllowed(true);
      } else {
        setIsTimeAllowed(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [step, waktuMulaiAktif]);

  const refreshStatusRuang = useCallback(() => {
    api.get("/ruang/aktif").then((res) => {
      if (res.data?.data) {
        const busyIds = res.data.data.map((item: any) => item.ruangan_lab_id);
        setRuangSibuk(busyIds);
      }
    });
  }, []);

  useEffect(() => {
    if (formData.ruangan_lab_id && step === "reservasi") {
      setLoadingJadwal(true);
      api.get(`/penggunaan-lab/${formData.ruangan_lab_id}/jadwal`)
        .then(res => {
          setJadwalLab(res.data.data || []);
        })
        .catch(err => console.error("Gagal memuat jadwal:", err))
        .finally(() => setLoadingJadwal(false));
    } else {
      setJadwalLab([]);
    }
  }, [formData.ruangan_lab_id, step]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setImageFile(dataURLtoFile(imageSrc, `ruang_${step}_${Date.now()}.jpg`));
    setFormData((prev) => ({ ...prev, fotoPreview: imageSrc }));
    setShowCamera(false);
  }, [step]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === "reservasi") {
      const waktuMulai = new Date(formData.waktu_mulai);
      const waktuSelesai = new Date(formData.waktu_selesai);
      const sekarang = new Date();

      if (waktuMulai < sekarang) {
        return Swal.fire("Peringatan", "Waktu mulai tidak boleh di masa lalu. Harap pilih jam/tanggal ke depan.", "warning");
      }
      
      if (waktuSelesai <= waktuMulai) {
        return Swal.fire("Peringatan", "Waktu selesai harus lebih besar dari waktu mulai.", "warning");
      }
    }

    setLoading(true);
    const data = new FormData();
    let endpoint = "";

    if (step === "reservasi") {
      endpoint = "/penggunaan-lab/reservasi";
      data.append("ruangan_lab_id", formData.ruangan_lab_id);
      data.append("tujuan_penggunaan", formData.tujuan_penggunaan);
      data.append("waktu_mulai", formData.waktu_mulai);
      data.append("waktu_selesai", formData.waktu_selesai);
    } else if (step === "checkIn") {
      endpoint = `/penggunaan-lab/${idLaporan}/check-in`;
      data.append("kondisi_in", formData.kondisi.toLowerCase());
      data.append("foto_before", imageFile!);
    } else if (step === "checkOut") {
      endpoint = `/penggunaan-lab/${idLaporan}/check-out`;
      data.append("kondisi_out", formData.kondisi.toLowerCase());
      data.append("foto_after", imageFile!);
    }

    try {
      const res = await api.post(endpoint, data);
      Swal.fire("Berhasil", res.data.message || "Berhasil diproses", "success");

      if (step === "reservasi") {
        const newId = res.data.data.id;
        setIdLaporan(newId);
        setStep("checkIn");
        setWaktuMulaiAktif(formData.waktu_mulai); // 🌟 Simpan waktu mulai ke state
        localStorage.setItem("active_lab_session", JSON.stringify({ 
          id: newId, 
          step: "checkIn",
          waktuMulai: formData.waktu_mulai // 🌟 Simpan waktu mulai ke cache lokal
        }));
      } else if (step === "checkIn") {
        const rawCreated = res.data.data?.created_at;
        const waktuCI = rawCreated ? formatTanggal(rawCreated) : new Date().toLocaleString('id-ID');
        
        setWaktuCheckInAktif(waktuCI);
        setStep("checkOut");
        localStorage.setItem("active_lab_session", JSON.stringify({ 
          id: idLaporan, 
          step: "checkOut", 
          waktuCheckIn: waktuCI,
          waktuMulai: waktuMulaiAktif
        }));
      } else if (step === "checkOut") {
        setStep("reservasi");
        setIdLaporan(null);
        setWaktuCheckInAktif(null);
        setWaktuMulaiAktif(null);
        localStorage.removeItem("active_lab_session");
      }

      setFormData({ ruangan_lab_id: "", kondisi: "", tujuan_penggunaan: "", waktu_mulai: "", waktu_selesai: "", fotoPreview: null });
      setImageFile(null);
      refreshStatusRuang();
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan sistem", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Batalkan Sesi?',
      text: "Sesi Anda yang belum selesai akan diabaikan dari perangkat ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Reset',
    }).then((result) => {
      if (result.isConfirmed) {
        setStep("reservasi");
        setIdLaporan(null);
        setWaktuCheckInAktif(null);
        setWaktuMulaiAktif(null);
        localStorage.removeItem("active_lab_session");
        setFormData({ ruangan_lab_id: "", kondisi: "", tujuan_penggunaan: "", waktu_mulai: "", waktu_selesai: "", fotoPreview: null });
        setImageFile(null);
      }
    });
  };

  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <PageLayout
      pageTitle="Penggunaan Ruang Lab"
      pageDescription={
        step === "reservasi" ? "Silakan isi form reservasi / pemakaian lab." :
        step === "checkIn" ? "Harap melampirkan kondisi awal ruangan sebelum pemakaian." :
        "Harap melampirkan kondisi akhir ruangan sesudah pemakaian."
      }
    >
      <Card className="p-6 border-2 border-zinc-950 rounded-none relative">
        
        {step !== "reservasi" && (
          <button onClick={handleReset} type="button" className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors" title="Reset Sesi">
            <RefreshCcw size={18} />
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {step === "reservasi" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Lab:</Label>
                  <Select value={formData.ruangan_lab_id} onValueChange={(val) => setFormData({ ...formData, ruangan_lab_id: val })}>
                    <SelectTrigger><SelectValue placeholder="Pilih Lab" /></SelectTrigger>
                    <SelectContent>
                      {RUANGAN_LIST.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()} disabled={ruangSibuk.includes(r.id)}>
                          {r.name} {ruangSibuk.includes(r.id) ? "(SEDANG DIPAKAI)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Tujuan / Keperluan:</Label>
                  <Input required placeholder="Kegiatan..." value={formData.tujuan_penggunaan} onChange={(e) => setFormData({ ...formData, tujuan_penggunaan: e.target.value })} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Estimasi Jam Mulai:</Label>
                  <Input type="datetime-local" required value={formData.waktu_mulai} onChange={(e) => setFormData({ ...formData, waktu_mulai: e.target.value })} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Estimasi Jam Selesai:</Label>
                  <Input type="datetime-local" required value={formData.waktu_selesai} onChange={(e) => setFormData({ ...formData, waktu_selesai: e.target.value })} />
                </div>
              </div>

              {formData.ruangan_lab_id && (
                <div className="border border-zinc-200 bg-zinc-50/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarClock size={16} className="text-zinc-500" />
                    <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-widest">Status & Jadwal Ruangan Ini:</h3>
                  </div>
                  
                  {loadingJadwal ? (
                    <p className="text-xs text-zinc-500 animate-pulse">Memuat jadwal...</p>
                  ) : jadwalLab.length > 0 ? (
                    <ul className="space-y-2">
                      {jadwalLab.map((j) => (
                        <li key={j.id} className="flex justify-between items-center text-xs bg-white border border-zinc-100 p-2 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-semibold">{j.user?.name || "Seseorang"}</span>
                              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                {j.user?.nim_nip || "-"} • Kelas {j.user?.kelas || "-"}
                              </span>
                            </div>
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${j.status_id === 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {j.status_id === 2 ? "Sedang Berlangsung" : "Sudah Reservasi"}
                            </span>
                          </div>
                          
                          <div className="font-mono text-zinc-500">
                            {formatTanggal(j.waktu_mulai)} <span className="font-sans mx-1">s/d</span> {formatTanggal(j.waktu_selesai)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-zinc-500">Belum ada yang melakukan reservasi. Ruangan kosong pada hari ini dan seterusnya!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAHAP 2 & 3: CHECK-IN & CHECK-OUT */}
          {(step === "checkIn" || step === "checkOut") && (
            <>
              <div className="p-4 bg-zinc-100 border border-zinc-200 text-sm mb-4 flex flex-col gap-1">
                <div><strong>Status:</strong> Anda sedang dalam tahap {step === "checkIn" ? "Check-In (Masuk)" : "Check-Out (Keluar)"} Ruangan.</div>
                
                {step === "checkOut" && waktuCheckInAktif && (
                  <div className="text-xs text-zinc-600 flex items-center gap-1 font-mono mt-1">
                    <Clock size={14} className="text-green-600" />
                    <span>Waktu Check-In Aktual: <strong>{waktuCheckInAktif}</strong></span>
                  </div>
                )}
              </div>

              {/* 🌟 KONDISIONAL TAHAP CHECK-IN JIKA WAKTU BELUM DIIZINKAN */}
              {step === "checkIn" && !isTimeAllowed ? (
                <div className="p-5 border-2 border-amber-300 bg-amber-50 flex flex-col items-center justify-center text-center gap-2">
                  <Clock size={32} className="text-amber-500" />
                  <p className="text-xs font-mono font-bold text-amber-800 tracking-wide mt-2">
                    Formulir Check-In & Kamera baru akan diaktifkan pukul <br/>
                    <span className="text-lg font-black text-amber-900 leading-relaxed">{unlockTimeText} WIB</span> <br/>
                    <span className="text-[10px] text-amber-700 uppercase">(10 Menit Sebelum Jam Reservasi)</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Kondisi Ruangan:</Label>
                    <Select required value={formData.kondisi} onValueChange={(val) => setFormData({ ...formData, kondisi: val })}>
                      <SelectTrigger><SelectValue placeholder="Pilih Kondisi" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bersih">Bersih</SelectItem>
                        <SelectItem value="kotor">Kotor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Bukti Foto Kondisi:</Label>
                    <div
                      className="h-44 border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-zinc-950 transition-colors"
                      onClick={() => setShowCamera(true)}
                    >
                      {formData.fotoPreview ? (
                        <img src={formData.fotoPreview} className="h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center text-zinc-400">
                          <Camera className="mb-2" />
                          <span className="text-xs font-medium">Ketuk untuk mengambil foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {showCamera && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full max-w-lg"
              />
              <div className="mt-4 flex gap-4">
                <Button type="button" onClick={() => setShowCamera(false)} variant="destructive" className="rounded-none font-black">
                  BATAL
                </Button>
                <Button type="button" onClick={capture} className="bg-white text-black hover:bg-zinc-200 rounded-none font-black">
                  CAPTURE
                </Button>
              </div>
            </div>
          )}

          {/* 🌟 DISABLE TOMBOL JIKA WAKTU BELUM DIIZINKAN */}
          <Button 
            type="submit" 
            disabled={loading || (step === "checkIn" && !isTimeAllowed)} 
            className={`w-full rounded-none font-black tracking-widest ${step === "checkIn" && !isTimeAllowed ? "bg-zinc-300 text-zinc-500 opacity-80" : ""}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : step === "reservasi" ? "RESERVASI RUANGAN" : step === "checkIn" ? "CHECK-IN SEKARANG" : "SELESAIKAN (CHECK-OUT)"}
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
}