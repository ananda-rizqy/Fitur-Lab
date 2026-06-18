import React, { useEffect, useState } from 'react';
import api from "../../services/api";

export const TabelManajemenTendik = () => {
  const [tendiks, setTendiks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBuildings, setAllBuildings] = useState<any[]>([]);
  const [selectedTendik, setSelectedTendik] = useState<any>(null);
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);

  useEffect(() => { 
    fetchTendiks(); 
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      // Pastikan endpoint ini ada di Laravel Anda
      const res = await api.get("/ruangan-list"); 
      setAllBuildings(res.data); // Sesuaikan dengan struktur JSON dari API Anda
    } catch (err) {
      console.error("Gagal mengambil daftar gedung", err);
    }
  };

  const fetchTendiks = async () => {
    try {
      const res = await api.get("/kaleb/tendik-list");
      setTendiks(res.data.data);
    } finally { setLoading(false); }
  };

  const handleAssign = async () => {
    if (!selectedTendik) return;
    await api.post(`/kaleb/assign-tendik/${selectedTendik.id}`, { gedung_id: selectedBuildings.join(',') });
    alert('Penugasan diperbarui!');
    fetchTendiks();
    setSelectedTendik(null);
  };

  return (
    <div className="bg-white border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] p-6">
      <table className="w-full border-collapse border-2 border-zinc-950">
        <thead>
          <tr className="bg-zinc-100 border-b-2 border-zinc-950">
            <th className="border-r-2 border-zinc-950 p-4 font-mono text-xs uppercase text-left">Nama Tendik</th>
            <th className="border-r-2 border-zinc-950 p-4 font-mono text-xs uppercase text-left">Tugas (ID Gedung)</th>
            <th className="p-4 font-mono text-xs uppercase text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
        {tendiks.map(t => (
          <tr key={t.id} className="border-b border-zinc-200">
            <td className="border-r-2 border-zinc-950 p-4 font-mono text-sm">{t.name}</td>
            
            {/* BAGIAN INI YANG DIUBAH */}
            <td className="border-r-2 border-zinc-950 p-4 font-mono text-sm">
              {t.nama_gedung_display ? t.nama_gedung_display : "-"}
            </td>
      
              <td className="p-4">
                <button 
                  onClick={() => {
                    setSelectedTendik(t);
                    // Tetap gunakan id untuk logic checkbox
                    setSelectedBuildings(t.current_assignment_id ? t.current_assignment_id.split(',') : []);
                  }}
                  className="bg-zinc-950 text-white px-4 py-2 font-mono text-xs hover:bg-zinc-800 transition"
                >
                  Ubah Tugas
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedTendik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 border-4 border-zinc-950 w-96 shadow-[8px_8px_0px_0px_rgba(9,9,11,1)]">
            <h2 className="font-mono font-bold mb-4">Gedung untuk {selectedTendik.name}</h2>
            {[1, 2, 3, 4].map(id => (
              <label key={id} className="block mb-2 font-mono text-sm cursor-pointer">
                <input type="checkbox" checked={selectedBuildings.includes(id.toString())}
                  onChange={(e) => e.target.checked 
                    ? setSelectedBuildings([...selectedBuildings, id.toString()]) 
                    : setSelectedBuildings(selectedBuildings.filter(b => b !== id.toString()))
                  } className="mr-2" />
                Gedung {id}
              </label>
            ))}
            <div className="mt-6 flex gap-2">
              <button onClick={handleAssign} className="bg-green-500 text-white px-4 py-2 font-mono text-xs border-2 border-zinc-950">Simpan</button>
              <button onClick={() => setSelectedTendik(null)} className="bg-zinc-200 px-4 py-2 font-mono text-xs border-2 border-zinc-950">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};