import { useState, type FormEvent, useEffect, useRef, useCallback } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import { Camera, Loader2 } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { PageLayout } from "../../../layouts/PageLayout";
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
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new File([u8arr], filename, { type: mime });
};

export function PenggunaanRuangLabPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"masuk" | "keluar">("masuk");
  const [idLaporan, setIdLaporan] = useState<number | null>(null);
  const [ruangSibuk, setRuangSibuk] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ laboratorium: "", kondisi: "", keperluan: "", jam_mulai: "", jam_selesai: "", fotoPreview: null as string | null });

  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);

  const refreshStatusRuang = useCallback(() => {
    api.get('/ruang/aktif').then(res => setRuangSibuk(res.data.map(Number)));
  }, []);

  useEffect(() => { refreshStatusRuang(); }, [refreshStatusRuang]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setImageFile(dataURLtoFile(imageSrc, `ruang_${step}_${Date.now()}.jpg`));
    setFormData(prev => ({ ...prev, fotoPreview: imageSrc }));
    setShowCamera(false);
  }, [step]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return Swal.fire("Peringatan", "Foto wajib diambil!", "warning");

    setLoading(true);
    const data = new FormData();
    data.append(step === "masuk" ? "kondisi_masuk" : "kondisi_keluar", formData.kondisi);
    data.append(step === "masuk" ? "foto_before" : "foto_after", imageFile, imageFile.name);

    if (step === "masuk") {
      data.append("ruangan_id", formData.laboratorium);
      data.append("keperluan", formData.keperluan);
      data.append("jam_mulai", formData.jam_mulai);
      data.append("jam_selesai", formData.jam_selesai);
    }

    try {
      const res = await api.post(step === "masuk" ? "/ruang/masuk" : `/ruang/keluar/${idLaporan}`, data);
      Swal.fire("Berhasil", "Data tersimpan", "success");
      
      refreshStatusRuang();
      if (step === "masuk") { setIdLaporan(res.data.data.id); setStep("keluar"); }
      else { setStep("masuk"); setIdLaporan(null); }
      
      setFormData({ laboratorium: "", kondisi: "", keperluan: "", jam_mulai: "", jam_selesai: "", fotoPreview: null });
      setImageFile(null);
    } catch (err: any) {
      Swal.fire("Gagal", err.response?.data?.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout pageTitle="Logbook Ruangan">
      <Card className="p-6 border-2 border-zinc-950 rounded-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === "masuk" && (
            <div className="grid md:grid-cols-2 gap-5">
              <Select value={formData.laboratorium} onValueChange={(val) => setFormData({...formData, laboratorium: val})}>
                <SelectTrigger><SelectValue placeholder="Pilih Lab" /></SelectTrigger>
                <SelectContent>
                  {RUANGAN_LIST.map(r => (
                    <SelectItem key={r.id} value={r.id.toString()} disabled={ruangSibuk.includes(r.id)}>
                      {r.name} {ruangSibuk.includes(r.id) ? "(SEDANG DIPAKAI)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input required placeholder="Tujuan" onChange={(e) => setFormData({...formData, keperluan: e.target.value})} />
              <Input type="datetime-local" required onChange={(e) => setFormData({...formData, jam_mulai: e.target.value})} />
              <Input type="datetime-local" required onChange={(e) => setFormData({...formData, jam_selesai: e.target.value})} />
            </div>
          )}
          <Select value={formData.kondisi} onValueChange={(val) => setFormData({...formData, kondisi: val})}>
            <SelectTrigger><SelectValue placeholder="Kondisi Ruangan" /></SelectTrigger>
            <SelectContent><SelectItem value="Bersih">Bersih</SelectItem><SelectItem value="Kotor">Kotor</SelectItem></SelectContent>
          </Select>
          <div className="h-44 border-2 border-dashed flex items-center justify-center cursor-pointer" onClick={() => setShowCamera(true)}>
             {formData.fotoPreview ? <img src={formData.fotoPreview} className="h-full object-cover"/> : <Camera/>}
          </div>
          {showCamera && (
              <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
                <Webcam 
                  audio={false} 
                  ref={webcamRef} 
                  screenshotFormat="image/jpeg" 
                  videoConstraints={{ 
                    // Menggunakan string biasa, bukan objek { exact: ... }
                    facingMode: "environment" 
                  }}
                  className="w-full max-w-lg"
                />
                <Button 
                  type="button" 
                  onClick={capture} 
                  className="mt-4 bg-white text-black hover:bg-zinc-200"
                >
                  Capture
                </Button>
              </div>
            )}
          <Button type="submit" disabled={loading} className="w-full">{loading ? <Loader2 className="animate-spin"/> : "KIRIM"}</Button>
        </form>
      </Card>
    </PageLayout>
  );
}