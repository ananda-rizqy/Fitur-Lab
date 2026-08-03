import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";

interface ModalEditAksesProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function ModalEditAkses({ isOpen, onClose, user, onSuccess }: ModalEditAksesProps) {
  const [role, setRole] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
      setJabatan(user.jabatan || "");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Cek apakah user yang dipilih adalah mahasiswa atau tendik (tidak boleh diedit aksesnya)
  const isLockedRole = user.role === "mahasiswa" || user.role === "tendik";

  const handleSave = async () => {
    if (isLockedRole) return; // Mencegah pengiriman data jika mahasiswa/tendik

    try {
      setLoading(true);
      
      await api.put(`/users/${user.id}/role-jabatan`, {
        role: role,
        jabatan: role === "dosen" ? jabatan : null,
      });

      Swal.fire({
        title: "BERHASIL!",
        text: "Hak akses pengguna telah diperbarui.",
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: {
          popup: "rounded-none border-4 border-zinc-950 font-mono",
          title: "font-black uppercase tracking-wide text-zinc-900",
          confirmButton: "rounded-none font-mono font-black uppercase bg-black text-white px-6 py-2"
        }
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire({
        title: "GAGAL!",
        text: error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
        confirmButtonColor: "#b91c1c",
        customClass: {
          popup: "rounded-none border-4 border-red-700 font-mono",
          title: "font-black uppercase tracking-wide text-red-700",
          confirmButton: "rounded-none font-mono font-black uppercase bg-red-700 text-white px-6 py-2"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-950 dark:border-zinc-800 p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <h2 className="text-lg font-black font-mono uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2">
          Ubah Akses: {user.name}
        </h2>

        {/* PESAN PERINGATAN JIKA AKUN MAHASISWA ATAU TENDIK */}
        {isLockedRole ? (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500 text-amber-800 dark:text-amber-200 font-mono text-xs">
            <span className="font-black uppercase block mb-1">Akses Dikunci</span>
            Akun dengan role <span className="uppercase font-bold underline">{user.role}</span> bersifat permanen dan hak aksesnya tidak dapat diubah melalui panel ini.
          </div>
        ) : null}

        {/* DROPDOWN ROLE UTAMA */}
        <div className="mb-4">
          <label className="block text-xs font-mono font-black text-zinc-500 uppercase tracking-widest mb-2">
            Role Utama
          </label>
          <select
            value={role}
            disabled={isLockedRole} // Dikunci jika mahasiswa/tendik
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-700 p-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="dosen">Dosen</option>
          </select>
        </div>

        {/* DROPDOWN JABATAN (HANYA MUNCUL JIKA ROLE = DOSEN DAN BUKAN AKUN TERKUNCI) */}
        {!isLockedRole && role === "dosen" && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-mono font-black text-zinc-500 uppercase tracking-widest mb-2">
              Jabatan Struktural (Opsional)
            </label>
            <select
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-900 dark:border-blue-700 p-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
            >
              <option value="">Dosen Biasa (Tanpa Jabatan)</option>
              <option value="kalab">Kepala Laboratorium (Kalab)</option>
              <option value="kaprodi">Kepala Program Studi (Kaprodi)</option>
            </select>
            <p className="text-[10px] font-mono text-blue-600 mt-1.5 uppercase">
              * Khusus untuk penentuan hak ACC persetujuan
            </p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Batal
          </button>
          
          {/* Tombol Simpan disembunyikan/didisable jika rolenya mahasiswa/tendik */}
          {!isLockedRole && (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-colors"
            >
              {loading ? "Menyimpan..." : "Simpan Akses"}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}