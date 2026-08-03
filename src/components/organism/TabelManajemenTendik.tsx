import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";

export const TabelManajemenTendik = () => {
  const [tendiks, setTendiks] = useState<any[]>([]);
  const [allBuildings, setAllBuildings] = useState<any[]>([]);
  const [selectedTendik, setSelectedTendik] = useState<any>(null);
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);

  useEffect(() => { 
    fetchTendiks(); 
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await api.get("/gedungs-list"); 
      // 🌟 Ambil bagian .data karena struktur dari Laravel dibungkus dalam key 'data'
      setAllBuildings(res.data.data || res.data);
    } catch (err) { 
      console.error("Gagal mengambil daftar gedung", err); 
    }
  };

  const fetchTendiks = async () => {
    try {
      const res = await api.get("/kaleb/tendik-list");
      setTendiks(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleAssign = async () => {
    if (!selectedTendik) return;
    try {
      await api.post(`/kaleb/assign-tendik/${selectedTendik.id}`, { gedung_id: selectedBuildings.join(',') });
      
      // 🌟 Menggunakan Swal untuk alert sukses yang elegan
      Swal.fire({
        title: "BERHASIL!",
        text: "Penugasan gedung berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#000000",
        customClass: {
          popup: "rounded-none border-4 border-zinc-950 font-mono",
          title: "font-black uppercase tracking-wide text-zinc-900",
          confirmButton: "rounded-none font-mono font-black uppercase bg-black text-white px-6 py-2"
        }
      });

      fetchTendiks();
      setSelectedTendik(null);
    } catch (err: any) {
      console.error("Gagal memperbarui penugasan", err);
      
      // 🌟 Alert error jika gagal
      Swal.fire({
        title: "GAGAL!",
        text: err.response?.data?.message || "Gagal memperbarui penugasan.",
        icon: "error",
        confirmButtonColor: "#b91c1c",
        customClass: {
          popup: "rounded-none border-4 border-red-700 font-mono",
          title: "font-black uppercase tracking-wide text-red-700",
          confirmButton: "rounded-none font-mono font-black uppercase bg-red-700 text-white px-6 py-2"
        }
      });
    }
  };

  return (
    <div className="bg-white border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] p-4 md:p-6 w-full">
      {/* Wrapper agar tabel bisa scroll di mobile */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[500px] border-collapse border-2 border-zinc-950">
          <thead>
            <tr className="bg-zinc-100 border-b-2 border-zinc-950">
              <th className="border-r-2 border-zinc-950 p-3 md:p-4 font-mono text-[10px] md:text-xs uppercase text-left">Nama Tendik</th>
              <th className="border-r-2 border-zinc-950 p-3 md:p-4 font-mono text-[10px] md:text-xs uppercase text-left">Tugas</th>
              <th className="p-3 md:p-4 font-mono text-[10px] md:text-xs uppercase text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tendiks.map(t => (
              <tr key={t.id} className="border-b border-zinc-200">
                <td className="border-r-2 border-zinc-950 p-3 md:p-4 font-mono text-xs md:text-sm">{t.name}</td>
                <td className="border-r-2 border-zinc-950 p-3 md:p-4 font-mono text-xs md:text-sm truncate max-w-[150px]">
                  {t.nama_gedung_display || "-"}
                </td>
                <td className="p-3 md:p-4">
                  <button 
                    onClick={() => {
                      setSelectedTendik(t);
                      setSelectedBuildings(t.current_assignment_id ? t.current_assignment_id.split(',') : []);
                    }}
                    className="bg-zinc-950 text-white px-3 py-1.5 md:px-4 md:py-2 font-mono text-[10px] md:text-xs hover:bg-zinc-800 transition"
                  >
                    Ubah
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Dibuat responsif dengan p-4 dan max-w-sm */}
      {selectedTendik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 border-4 border-zinc-950 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(9,9,11,1)]">
            <h2 className="font-mono font-bold mb-4 text-sm truncate">Gedung: {selectedTendik.name}</h2>
            
            <div className="max-h-[300px] overflow-y-auto mb-6 space-y-2">
              {/* 🌟 Gunakan allBuildings secara dinamis */}
              {allBuildings.map(building => {
                const buildingIdStr = building.id.toString();
                // 🌟 Mencari properti teks nama gedung secara dinamis agar tidak kosong
                const buildingName = building.nama_gedung || building.nama_ruangan || building.name || `Gedung ${building.id}`;
                
                return (
                  <label key={building.id} className="flex items-center font-mono text-xs cursor-pointer p-2 border border-zinc-200 hover:bg-zinc-50">
                    <input 
                      type="checkbox" 
                      checked={selectedBuildings.includes(buildingIdStr)}
                      onChange={(e) => e.target.checked 
                        ? setSelectedBuildings([...selectedBuildings, buildingIdStr]) 
                        : setSelectedBuildings(selectedBuildings.filter(b => b !== buildingIdStr))
                      } 
                      className="mr-3 w-4 h-4 accent-black" 
                    />
                    <span className="font-bold text-zinc-900">{buildingName}</span>
                  </label>
                );
              })}
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleAssign} className="flex-1 bg-green-500 text-white py-2 font-mono text-xs border-2 border-zinc-950 font-bold uppercase hover:bg-green-600">Simpan</button>
              <button onClick={() => setSelectedTendik(null)} className="flex-1 bg-zinc-200 py-2 font-mono text-xs border-2 border-zinc-950 font-bold uppercase hover:bg-zinc-300">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};