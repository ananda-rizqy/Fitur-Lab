import {
  useState,
  type FormEvent,
  useEffect,
  useRef,
  useCallback,
} from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { Camera, DoorOpen, Loader2, CheckCircle2, X } from "lucide-react";

import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { PageLayout } from "../../../layouts/PageLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { DatePicker } from "../../../components/atoms/DatePicker";

const RUANGAN_SPESIFIK = [
  "Lab. TK Barat I/01",
  "Lab. TK Barat I/02",
  "Lab. TK Barat I/04",
  "Lab. TK Timur I/01",
  "Lab. TK Timur I/02",
  "Lab. TK Timur II/01",
];

interface FormState {
  laboratorium: string;
  kondisi: string;
  keperluan: string;
  jam_mulai: string;
  jam_selesai: string;
  foto: File | null;
  fotoPreview: string | null;
}

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

export function PenggunaanRuangLabPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"masuk" | "keluar">("masuk");
  const [idLaporan, setIdLaporan] = useState<number | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    laboratorium: "",
    kondisi: "",
    keperluan: "",
    jam_mulai: "",
    jam_selesai: "",
    foto: null,
    fotoPreview: null,
  });

  useEffect(() => {
    const savedId = localStorage.getItem("active_session_id");
    const savedLab = localStorage.getItem("active_lab_name");
    if (savedId && savedLab) {
      setIdLaporan(parseInt(savedId));
      setStep("keluar");
      setFormData((prev) => ({ ...prev, laboratorium: savedLab }));
    }
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        const fileName = `ruang_${step}_${Date.now()}.jpg`;
        const convertedFile = dataURLtoFile(imageSrc, fileName);

        setFormData((prev) => ({
          ...prev,
          fotoPreview: imageSrc,
          foto: convertedFile,
        }));
        setShowCamera(false);
      } catch (error) {
        console.error("Gagal mengonversi gambar kamera:", error);
      }
    }
  }, [step]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.foto) {
      return Swal.fire({
        title: "Dokumentasi Diperlukan",
        text: "Harap ambil foto kondisi fisik ruangan sebelum menyimpan data!",
        icon: "warning",
        confirmButtonColor: "#18181b",
      });
    }

    setLoading(true);
    const data = new FormData();

    try {
      if (step === "masuk") {
        data.append("laboratorium", formData.laboratorium);
        data.append("kondisi_masuk", formData.kondisi);
        data.append("keperluan", formData.keperluan);
        data.append("jam_mulai", formData.jam_mulai);
        data.append("jam_selesai", formData.jam_selesai);
        data.append("foto_before", formData.foto);

        const res = await api.post("/ruang/masuk", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const newId = res.data?.data?.id || res.data?.id;
        if (newId) {
          setIdLaporan(newId);
          localStorage.setItem("active_session_id", newId.toString());
          localStorage.setItem("active_lab_name", formData.laboratorium);
        }

        setStep("keluar");
        setFormData({
          laboratorium: formData.laboratorium,
          kondisi: "",
          keperluan: "",
          jam_mulai: "",
          jam_selesai: "",
          foto: null,
          fotoPreview: null,
        });

        Swal.fire({
          title: "Check-In Sukses",
          text: "Selamat mempraktikkan materi lab. Sesi pemakaian ruang telah aktif.",
          icon: "success",
          confirmButtonColor: "#18181b",
        });
      } else {
        data.append("kondisi_keluar", formData.kondisi);
        data.append("foto_after", formData.foto);

        await api.post(`/ruang/keluar/${idLaporan}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        localStorage.removeItem("active_session_id");
        localStorage.removeItem("active_lab_name");

        Swal.fire({
          title: "Check-Out Berhasil",
          text: "Laporan akhir kondisi laboratorium telah direkam. Terima kasih.",
          icon: "success",
          confirmButtonColor: "#18181b",
        }).then(() => window.location.reload());
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Terjadi kegagalan komunikasi dengan server API.";
      Swal.fire("Sistem Gagal", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      pageTitle="Logbook Ruangan"
      pageDescription="Lakukan pencatatan check-in awal masuk dan check-out akhir"
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        {step === "keluar" && (
          <div className="bg-zinc-950 dark:bg-zinc-900 text-white p-6 border-2 border-zinc-950 dark:border-zinc-800  animate-in fade-in zoom-in duration-200 relative overflow-hidden rounded-none">
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-11 h-11 bg-zinc-900 border-2 border-zinc-800 text-white flex items-center justify-center shrink-0 rounded-none">
                <DoorOpen size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-mono font-black text-[9px] tracking-widest text-zinc-500">
                  SESI PEMAKAIAN BERJALAN
                </h3>
                <p className="text-lg font-black tracking-tight text-white mt-0.5">
                  {formData.laboratorium}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 font-mono text-[9px] font-black text-zinc-400 tracking-wider rounded-none">
                  ID LOG: #{idLaporan}
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="p-0 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
            {step === "masuk" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                    Pilih Laboratorium
                  </Label>
                  <Select
                    value={formData.laboratorium}
                    onValueChange={(val) =>
                      setFormData({ ...formData, laboratorium: val })
                    }
                  >
                    <SelectTrigger className="rounded-none h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-bold">
                      <SelectValue placeholder="Pilih Ruang Lab" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                      {RUANGAN_SPESIFIK.map((room) => (
                        <SelectItem
                          key={room}
                          value={room}
                          className="cursor-pointer rounded-none focus:bg-zinc-100 dark:focus:bg-zinc-900"
                        >
                          {room}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                    Tujuan Penggunaan
                  </Label>
                  <Input
                    type="text"
                    required
                    value={formData.keperluan}
                    placeholder="Misal: Praktikum Embedded System BLE"
                    onChange={(e) =>
                      setFormData({ ...formData, keperluan: e.target.value })
                    }
                    className="rounded-none h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-bold shadow-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                    Estimasi Mulai Praktikum
                  </Label>

                  <Input
                    type="datetime-local"
                    required
                    value={formData.jam_mulai}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jam_mulai: e.target.value,
                      })
                    }
                    className="rounded-none h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                  Estimasi Selesai Praktikum
                </Label>

                <Input
                  type="datetime-local"
                  required
                  value={formData.jam_selesai}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jam_selesai: e.target.value,
                    })
                  }
                  className="rounded-none h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-bold"
                />
              </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 text-left">
                <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                  Kondisi Ruangan ({step === "masuk" ? "Masuk" : "Keluar"})
                </Label>
                <Select
                  value={formData.kondisi}
                  onValueChange={(val) =>
                    setFormData({ ...formData, kondisi: val })
                  }
                >
                  <SelectTrigger className="rounded-none h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-bold">
                    <SelectValue placeholder="Kondisi Ruangan" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
                    <SelectItem
                      value="Bersih"
                      className="cursor-pointer rounded-none"
                    >
                      Kondisi Bersih & Alat Rapi
                    </SelectItem>
                    <SelectItem
                      value="Kotor"
                      className="cursor-pointer rounded-none"
                    >
                      Kondisi Kotor & Berantakan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <Label className="font-mono font-black text-xs text-zinc-700 dark:text-zinc-300">
                  Ambil Foto
                </Label>

                {showCamera ? (
                  <div className="relative w-full h-44 overflow-hidden bg-black border-2 border-zinc-950 dark:border-zinc-800 shadow-inner animate-in fade-in duration-200 rounded-none">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 z-20">
                      <Button
                        type="button"
                        variant="brutal"
                        color="red"
                        size="sm"
                        onClick={() => setShowCamera(false)}
                      >
                        <X size={13} />
                      </Button>
                      <Button
                        type="button"
                        variant="brutal"
                        size="sm"
                        onClick={capture}
                      >
                        <Camera size={13} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowCamera(true)}
                    className="w-full h-44 bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-950 dark:hover:border-zinc-400 transition-all overflow-hidden group rounded-none"
                  >
                    {formData.fotoPreview ? (
                      <div className="w-full h-full relative">
                        <img
                          src={formData.fotoPreview}
                          className="w-full h-full object-cover transition-all"
                          alt="Preview Bukti Dokumentasi"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] text-white font-black tracking-widest font-mono bg-zinc-950/80 px-3 py-1 border border-zinc-700">
                            AMBIL RE-TAKE FOTO
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none mb-2 group-hover:scale-105 transition-transform">
                          <Camera size={15} />
                        </div>
                        <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 tracking-widest font-mono text-center px-4">
                          KLIK AREA UNTUK MENYALAKAN KAMERA
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              color="green"
              size="lg"
              variant="brutal"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>SEDANG MENGUNGGAH BERKAS...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>
                    {step === "masuk"
                      ? "KIRIM BERKAS CHECK-IN"
                      : "KIRIM LAPORAN CHECK-OUT"}
                  </span>
                </div>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
