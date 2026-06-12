import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { SelectAlat } from "../atoms/SelectAlat";
import { Button } from "../../components/ui/button";
import api from "../../services/api";

interface PeminjamanFormProps {
  onSuccess?: () => void;
  userContext: {
    nama_mahasiswa: string;
    nim: string;
    laboratorium: string;
  };
}

export function PeminjamanForm({ onSuccess, userContext }: PeminjamanFormProps) {
  const webcamRef = useRef<Webcam>(null);
  const [alat, setAlat] = useState<any[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const [form, setForm] = useState({
    alat_id: "" as string,
    nama_mahasiswa: userContext.nama_mahasiswa || "",
    nim: userContext.nim || "",
    laboratorium: userContext.laboratorium || "",
    tujuan_penggunaan: "",
    waktu_pinjam: "",
    waktu_kembali: "",
    kondisi_pinjam: "baik",
    status: "pending"
  });

  useEffect(() => {
    api.get("/alat").then((res) => {
      const data = res.data?.data || res.data || [];
      setAlat(data);
    });
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const handleSubmit = async () => {
    // 1. Validasi Kelengkapan Data
    if (!form.alat_id || !form.tujuan_penggunaan || !imgSrc || !form.waktu_pinjam || !form.waktu_kembali) {
      alert("Harap lengkapi semua data, termasuk foto dan waktu peminjaman.");
      return;
    }

    // 2. Validasi Logika Waktu (Waktu Kembali > Waktu Pinjam)
    const pinjam = new Date(form.waktu_pinjam).getTime();
    const kembali = new Date(form.waktu_kembali).getTime();

    if (kembali <= pinjam) {
      alert("⚠️ Kesalahan: Waktu estimasi kembali harus setelah waktu pinjam!");
      return;
    }

    try {
      setLoadingSubmit(true);
      const formData = new FormData();

      // Konversi Base64 ke File
      const blob = await fetch(imgSrc).then(res => res.blob());
      formData.append("foto_before", blob, "foto_alat.jpg");

      // Append data form
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      await api.post("/peminjaman", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Peminjaman berhasil diajukan!");
      setImgSrc(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal meminjam alat.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* IDENTITAS TESTING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-slate-700">
        <div className="md:col-span-3">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Identitas (Testing)</p>
        </div>
        <input placeholder="Nama" value={form.nama_mahasiswa} onChange={(e) => setForm({ ...form, nama_mahasiswa: e.target.value })} className="p-2 text-xs border rounded-lg dark:bg-slate-900 dark:text-white" />
        <input placeholder="NIM" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className="p-2 text-xs border rounded-lg dark:bg-slate-900 dark:text-white" />
        <input placeholder="Lab" value={form.laboratorium} onChange={(e) => setForm({ ...form, laboratorium: e.target.value })} className="p-2 text-xs border rounded-lg dark:bg-slate-900 dark:text-white" />
      </div>

      {/* WEBCAM AREA */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-indigo-100 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900">
        {!imgSrc && !isCameraOpen ? (
          <Button onClick={() => setIsCameraOpen(true)} className="bg-indigo-600 rounded-2xl shadow-lg">AKTIFKAN KAMERA</Button>
        ) : isCameraOpen ? (
          <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden border-4 border-indigo-500">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} className="w-full h-full object-cover" />
            <button onClick={capture} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white border-4 border-indigo-600 rounded-full shadow-2xl active:scale-90 transition-transform" />
          </div>
        ) : (
          <div className="relative">
            <img src={imgSrc!} alt="Preview" className="w-full max-w-sm rounded-[2rem] border-4 border-emerald-500" />
            <button onClick={() => setImgSrc(null)} className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold">X</button>
          </div>
        )}
      </div>

      {/* FORM INPUTS */}
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Alat</label>
          <SelectAlat
            value={form.alat_id ? parseInt(form.alat_id) : null}
            onChange={(v) => setForm({ ...form, alat_id: v.toString() })}
            options={alat.map((a) => ({ id: a.id, label: `${a.nama_alat} (${a.tersedia} tersedia)` }))}
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tujuan</label>
          <input className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-sm font-semibold dark:text-white outline-none focus:border-indigo-500" placeholder="Tujuan peminjaman..." onChange={(e) => setForm({ ...form, tujuan_penggunaan: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Waktu Pinjam</label>
            <input
              type="datetime-local"
              className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900 text-xs font-bold dark:text-white"
              onChange={(e) => setForm({ ...form, waktu_pinjam: e.target.value.replace("T", " ") + ":00" })}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Estimasi Kembali</label>
            <input
              type="datetime-local"
              className={`w-full p-3 rounded-xl border-2 text-xs font-bold dark:bg-slate-900 dark:text-white outline-none ${form.waktu_pinjam && form.waktu_kembali && (new Date(form.waktu_kembali) <= new Date(form.waktu_pinjam)) ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-slate-100 dark:border-slate-800'}`}
              onChange={(e) => setForm({ ...form, waktu_kembali: e.target.value.replace("T", " ") + ":00" })}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loadingSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 py-8 rounded-[2rem] font-black text-sm shadow-xl shadow-indigo-100 active:scale-95 disabled:bg-slate-400 transition-all">
        {loadingSubmit ? "MENYIMPAN..." : "KONFIRMASI PEMINJAMAN"}
      </Button>
    </div>
  );
}