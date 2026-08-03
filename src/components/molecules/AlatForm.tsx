import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, X } from "lucide-react";
import api from "../../services/api";

export interface AlatFormData {
  id?: number;
  nama_alat: string;
  letak_id: number | "";
  spesifikasi: string;
  kode_tag?: string;
  jumlah: number | "";
  kondisi: string;
}

interface AlatFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function AlatForm({ initialData, onSuccess }: AlatFormProps) {
  const [rooms, setRooms] = useState<{ id: number; nama_letak: string }[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // State untuk Base64 Kamera Langsung
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // State khusus React Webcam
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const [formData, setFormData] = useState<AlatFormData>({
    nama_alat: "",
    letak_id: "",
    spesifikasi: "",
    kode_tag: "",
    jumlah: "",
    kondisi: "baik",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/letaks"); 
        setRooms(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal mengambil daftar ruangan:", err);
        setRooms([
          { id: 1, nama_letak: "Lab. TK Barat I/01" },
          { id: 2, nama_letak: "Lab. TK Barat I/02" },
          { id: 3, nama_letak: "Lab. TK Barat I/04" },
          { id: 4, nama_letak: "Lab. TK Barat Ruangan laboran" },
          { id: 5, nama_letak: "Lab. TK Timur I/01" },
          { id: 6, nama_letak: "Lab. TK Timur I/02" },
          { id: 7, nama_letak: "Lab. TK Timur II/01" },
          { id: 8, nama_letak: "Lab. TK Barat I/01" },
          { id: 9, nama_letak: "Lab. TK Timur Ruangan laboran"  },
          { id: 10, nama_letak: "Lab TK Broadcast" },
        ]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (initialData) {
      const letakId = initialData.letak_id || initialData.letak?.id || "";
      setFormData({
        ...initialData,
        letak_id: letakId,
        spesifikasi: initialData.spesifikasi || "",
        kode_tag: initialData.kode_tag || "",
        jumlah: initialData.jumlah ?? "",
        kondisi: initialData.kondisi?.trim().toLowerCase() || "baik",
      });

      if (initialData.foto_url) {
        setPreviewImage(initialData.foto_url);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.kode_tag && formData.kode_tag.toString().trim() !== "") {
      setFormData((prev) => ({ ...prev, jumlah: 1 }));
    }
  }, [formData.kode_tag]);

  // Ambil foto langsung dalam bentuk string Base64
  const captureFoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
      setFotoBase64(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const currentTag = formData.kode_tag ? formData.kode_tag.toString().trim() : "";
      const isAsset = currentTag !== ""; 
      const finalKodeTag = isAsset ? currentTag : `NON-ASET-${Date.now()}`;

      // Payload JSON standar yang langsung membawa foto_base64
      const payload: any = {
        nama_alat: formData.nama_alat.trim(),
        letak_id: formData.letak_id,
        spesifikasi: formData.spesifikasi.trim(),
        kode_tag: finalKodeTag,
        jumlah: isAsset ? 1 : formData.jumlah,
        kondisi: isAsset ? formData.kondisi : "baik",
        is_asset: isAsset ? 1 : 0,
      };

      if (fotoBase64) {
        payload.foto_base64 = fotoBase64;
      }

      if (initialData?.id) {
        payload._method = "PUT";
        await api.post(`/alats/${initialData.id}`, payload);
      } else {
        await api.post("/alats", payload);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error);
      alert(error.response?.data?.message || "Gagal menyimpan perubahan data");
    }
  };

  const isQuantityDisabled = !!(formData.kode_tag && formData.kode_tag.toString().trim() !== "");

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-left w-full"
    >
      <div className="flex flex-col gap-1.5 md:col-span-1">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Nama Alat
        </label>
        <input
          type="text"
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 focus:bg-zinc-50 outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-tight transition-colors"
          placeholder="CONTOH: OSCILLOSCOPE RIGOL"
          value={formData.nama_alat}
          onChange={(e) => setFormData({ ...formData, nama_alat: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-1">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Letak Penempatan Ruangan
        </label>
        <select
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 tracking-wider cursor-pointer"
          value={formData.letak_id}
          onChange={(e) => setFormData({ ...formData, letak_id: parseInt(e.target.value) })}
          required
        >
          <option value="" disabled className="font-bold">
            -- PILIH RUANGAN LAB --
          </option>
          {loadingRooms ? (
            <option disabled>MEMUAT DATA RUANGAN...</option>
          ) : (
            rooms.map((room) => (
              <option key={room.id} value={room.id} className="font-black">
                {room.nama_letak.toUpperCase()}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Spesifikasi Teknis 
        </label>
        <textarea
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 focus:bg-zinc-50 outline-none text-xs font-bold uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-tight transition-colors min-h-[80px]"
          placeholder="CONTOH: 50MHZ, 4 CHANNELS, 1GSA/S..."
          value={formData.spesifikasi}
          onChange={(e) => setFormData({ ...formData, spesifikasi: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Dokumentasi Fisik 
        </label>

        {!isCameraOpen ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-40 h-40 border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden relative group shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={32} className="text-zinc-300 dark:text-zinc-700" />
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="py-3 px-4 rounded-none border-2 border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-900 font-mono font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <Camera size={14} /> 
                {previewImage ? "AMBIL ULANG FOTO" : "BUKA KAMERA"}
              </button>
              {previewImage && (
                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-black uppercase">
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full border-2 border-zinc-950 dark:border-zinc-700 bg-black p-2 relative shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-auto max-h-[400px] object-contain bg-zinc-900"
            />
            
            <div className="flex gap-3 justify-center mt-3">
              <button
                type="button"
                onClick={captureFoto}
                className="py-2.5 px-6 rounded-none border-2 border-zinc-950 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-mono font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <Camera size={14} /> JEPRET
              </button>
              <button
                type="button"
                onClick={() => setIsCameraOpen(false)}
                className="py-2.5 px-4 rounded-none border-2 border-zinc-950 bg-white hover:bg-zinc-100 text-zinc-950 font-mono font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <X size={14} /> BATAL
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Kode Registrasi Tag
        </label>
        <input
          type="text"
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 focus:bg-zinc-50 outline-none font-mono text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-wider"
          placeholder="CONTOH: TK-BRT-092"
          value={formData.kode_tag}
          onChange={(e) => setFormData({ ...formData, kode_tag: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Volume Jumlah Stok {isQuantityDisabled && "(DIKUNCI 1 UNIT)"}
        </label>
        <input
          type="number"
          min="1"
          className={`p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none text-xs font-black uppercase transition-all outline-none ${
            isQuantityDisabled
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed border-dashed"
              : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:bg-zinc-50"
          }`}
          value={formData.jumlah}
          disabled={isQuantityDisabled}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({
              ...formData,
              jumlah: value === "" ? "" : parseInt(value),
            });
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Status Kondisi Kelayakan Fisik
        </label>
        <select
          className={`p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none text-xs font-black uppercase outline-none transition-all ${
            !formData.kode_tag
              ? "bg-zinc-100 dark:bg-zinc-800/60 cursor-not-allowed text-zinc-400 dark:text-zinc-500 border-dashed"
              : "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
          }`}
          value={formData.kode_tag ? formData.kondisi : "baik"}
          disabled={!formData.kode_tag}
          onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
        >
          <option value="baik">BAIK (NORMAL OPERASIONAL)</option>
          <option value="rusak">RUSAK TOTAL (BUTUH PERBAIKAN)</option>
        </select>
        {!formData.kode_tag && (
          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-black uppercase tracking-widest italic">
            * Parameter item habis pakai otomatis terkunci berstatus baik.
          </span>
        )}
      </div>

      <button
        type="submit"
        className="md:col-span-2 py-4 rounded-none border-2 border-zinc-950 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 mt-4 flex items-center justify-center gap-3"
      >
        <span>
          {initialData?.id ? "UPDATE DATA INVENTORI" : "SIMPAN KE DATABASE"}
        </span>
      </button>

    </form>
  );
}