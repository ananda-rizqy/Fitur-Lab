import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import api from "../../services/api";

export interface AlatFormData {
  id?: number;
  nama_alat: string;
  letak: string;
  kode_tag?: string;
  jumlah: number | "";
  kondisi: string;
}

interface AlatFormProps {
  initialData?: AlatFormData;
  onSuccess: () => void;
}

export function AlatForm({ initialData, onSuccess }: AlatFormProps) {
  const [rooms, setRooms] = useState<string[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [formData, setFormData] = useState<AlatFormData>({
    nama_alat: "",
    letak: "",
    kode_tag: "",
    jumlah: "",
    kondisi: "Baik",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/ruangan-list");
        setRooms(res.data);
      } catch (err) {
        console.error("Gagal mengambil daftar ruangan:", err);
        setRooms([
          "Lab Elektronika Dasar",
          "Lab Digital",
          "Gudang",
          "Gedung Telekomunikasi",
        ]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (initialData) {
      let extractedKodeTag = "";
      if (
        (initialData as any).kode_tag_list && 
        Array.isArray((initialData as any).kode_tag_list) && 
        (initialData as any).kode_tag_list.length > 0
      ) {
        extractedKodeTag = (initialData as any).kode_tag_list[0] || "";
      } 
      else {
        extractedKodeTag = 
          initialData.kode_tag || 
          (initialData as any).kode_alat || 
          (initialData as any).tag || 
          "";
      }

      setFormData({
        ...initialData,
        kode_tag: extractedKodeTag.toString().trim(),
        jumlah: initialData.jumlah ?? "",
        kondisi: initialData.kondisi?.trim() || "Baik",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.kode_tag && formData.kode_tag.toString().trim() !== "") {
      setFormData((prev) => ({ ...prev, jumlah: 1 }));
    }
  }, [formData.kode_tag]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const currentTag = formData.kode_tag ? formData.kode_tag.toString().trim() : "";
      const statusAset = currentTag !== ""; 
      const payload = {
        id: initialData?.id, 
        nama_alat: formData.nama_alat.trim(),
        letak: formData.letak,
        kode_tag: statusAset ? currentTag : null, 
        jumlah: statusAset ? 1 : Number(formData.jumlah), 
        kondisi: statusAset ? formData.kondisi.trim() : "Baik",
        is_aset: statusAset ? 1 : 0,
      };

      console.log("Mengirim payload update ke backend:", payload);

      // Eksekusi mutasi data
      if (initialData?.id) {
        await api.put(`/alat/${initialData.id}`, payload);
      } else {
        await api.post("/alat", payload);
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error);
      const serverMessage = error.response?.data?.message || "Gagal menyimpan perubahan data";
      alert(serverMessage);
    }
  };

  const isQuantityDisabled = !!(formData.kode_tag && formData.kode_tag.toString().trim() !== "");

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-left w-full"
    >
      {/* 1. INPUT NAMA ALAT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Nama Alat / Komponen Lab
        </label>
        <input
          type="text"
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 focus:bg-zinc-50 outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-tight transition-colors"
          placeholder="CONTOH: FLUX SOLDER / ESP32 DEVKIT V1"
          value={formData.nama_alat}
          onChange={(e) => setFormData({ ...formData, nama_alat: e.target.value })}
          required
        />
      </div>

      {/* 2. SELECT LETAK (LOKASI LAB) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Letak Penempatan (Gedung/Rak)
        </label>
        <select
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 tracking-wider cursor-pointer"
          value={formData.letak}
          onChange={(e) => setFormData({ ...formData, letak: e.target.value })}
          required
        >
          <option value="" disabled className="font-bold">
            -- PILIH KOORDINAT LOKASI LAB --
          </option>
          {loadingRooms ? (
            <option>MEMUAT DATA RUANGAN...</option>
          ) : (
            rooms.map((room) => (
              <option key={room} value={room} className="font-black">
                {room.toUpperCase()}
              </option>
            ))
          )}
        </select>
      </div>

      {/* 3. INPUT KODE TAG INVENTORIS */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
          Kode Registrasi Tag (KOSONGKAN JIKA KONSUMSI)
        </label>
        <input
          type="text"
          className="p-3 border-2 border-zinc-950 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-950 focus:bg-zinc-50 outline-none font-mono text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-wider"
          placeholder="CONTOH: INV-EL-092"
          value={formData.kode_tag}
          onChange={(e) => setFormData({ ...formData, kode_tag: e.target.value })}
        />
      </div>

      {/* 4. INPUT QUANTITY STOK */}
      <div className="flex flex-col gap-1.5">
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

      {/* 5. SELECT KONDISI OPERASIONAL ASSET */}
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
          value={formData.kode_tag ? formData.kondisi : "Baik"}
          disabled={!formData.kode_tag}
          onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
        >
          <option value="Baik">BAIK (NORMAL OPERASIONAL)</option>
          <option value="Rusak">RUSAK TOTAL (BUTUH PERBAIKAN RAK)</option>
        </select>
        {!formData.kode_tag && (
          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1.5 font-black uppercase tracking-widest italic">
            * Parameter item habis pakai (konsumsi) otomatis terkunci berstatus baik.
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