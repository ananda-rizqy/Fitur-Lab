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
      const res = await api.get("/ruangan-list"); 
      setAllBuildings(res.data);
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
    <div className="bg-white border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] p-4 md:p-6 w-full overflow-hidden">
      
      {/* Container scroll untuk layar kecil */}
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
                    className="bg-zinc-950 text-white px-3 py-1.5 md:px-4 md:py-2 font-mono text-[10px] md:text-xs hover:bg-zinc-800 transition whitespace-nowrap"
                  >
                    Ubah
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Responsive dengan max-w-sm dan margin */}
      {selectedTendik && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 border-4 border-zinc-950 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(9,9,11,1)]">
            <h2 className="font-mono font-bold mb-4 text-sm truncate">Gedung: {selectedTendik.name}</h2>
            
            {/* Daftar Gedung Dinamis */}
            <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
              {allBuildings.map(g => (
                <label key={g.id} className="flex items-center p-2 border border-zinc-200 hover:bg-zinc-50 font-mono text-xs cursor-pointer">
                  <input type="checkbox" checked={selectedBuildings.includes(g.id.toString())}
                    onChange={(e) => e.target.checked 
                      ? setSelectedBuildings([...selectedBuildings, g.id.toString()]) 
                      : setSelectedBuildings(selectedBuildings.filter(b => b !== g.id.toString()))
                    } className="mr-3" />
                  {g.nama_gedung}
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={handleAssign} className="flex-1 bg-green-500 text-white py-2 font-mono text-xs border-2 border-zinc-950">Simpan</button>
              <button onClick={() => setSelectedTendik(null)} className="flex-1 bg-zinc-200 py-2 font-mono text-xs border-2 border-zinc-950">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};