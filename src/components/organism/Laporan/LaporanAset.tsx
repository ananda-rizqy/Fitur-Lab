import { useEffect, useState, useCallback } from "react";
import api from "../../../services/api";
import { Loader2, FileText, Search, Download } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface LaporanAsetProps {
  searchQuery: string;
  startDate: string;
  endDate: string;
}

export function LaporanAset({ searchQuery, startDate, endDate }: LaporanAsetProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLaporan = useCallback(async () => {
    try {
      setLoading(true);
      
      const res = await api.get("/laporan/penggunaan-aset", {
        params: {
          search: searchQuery,
          start_date: startDate,
          end_date: endDate,
        },
      });

      const rawResult = res.data?.data || res.data;
      setData(Array.isArray(rawResult) ? rawResult : []);
    } catch (err) {
      console.error("Gagal mengambil data laporan:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, startDate, endDate]);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  // Fungsi untuk mengunduh file CSV / Excel
  const handleExport = () => {
    const params = new URLSearchParams({
      search: searchQuery,
      start_date: startDate,
      end_date: endDate,
    });

    window.open(`https://api.tugasakhirr.com/api/laporan/penggunaan-aset/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="font-mono text-left w-full">
      <Card variant="brutal" className="p-0 border-2 border-zinc-950 dark:border-zinc-800 rounded-none overflow-hidden shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none bg-white dark:bg-zinc-950">
        
        {/* Header Kartu */}
        <div className="p-4 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-100 dark:bg-zinc-900 gap-3">
          <h3 className="font-mono font-black text-xs uppercase tracking-widest flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <FileText size={16} /> Rekapitulasi Durasi Penggunaan Alat
          </h3>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-black uppercase bg-white dark:bg-zinc-950 px-2.5 py-1.5 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
              Total: {data.length} Alat
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-500 text-zinc-950 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download size={13} /> Export Excel
            </button>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono uppercase text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-black tracking-wider text-zinc-500">
                <th className="p-3.5 border-r-2 border-zinc-950 dark:border-zinc-800 w-16 text-center">No</th>
                <th className="p-3.5 border-r-2 border-zinc-950 dark:border-zinc-800">Nama Alat</th>
                <th className="p-3.5 border-r-2 border-zinc-950 dark:border-zinc-800 w-44">Kode Tag</th>
                <th className="p-3.5 border-r-2 border-zinc-950 dark:border-zinc-800">Spesifikasi</th>
                <th className="p-3.5 text-right w-48">Total Durasi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-800 font-bold text-zinc-800 dark:text-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-zinc-950 dark:text-zinc-50" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Memuat Rekapitulasi...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
                      <Search size={20} />
                      <span className="text-xs font-black uppercase tracking-wider">Tidak ada data rekapitulasi alat ditemukan.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="p-3.5 border-r-2 border-zinc-200 dark:border-zinc-800 text-center font-black">{index + 1}</td>
                    <td className="p-3.5 border-r-2 border-zinc-200 dark:border-zinc-800 font-black text-zinc-900 dark:text-zinc-50">{item.nama_alat}</td>
                    <td className="p-3.5 border-r-2 border-zinc-200 dark:border-zinc-800">
                      <span className="inline-block px-2.5 py-1 border-2 border-zinc-950 bg-white text-zinc-950 font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
                        {item.kode_tag}
                      </span>
                    </td>
                    <td className="p-3.5 border-r-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">{item.spesifikasi}</td>
                    <td className="p-3.5 text-right font-black text-emerald-600 dark:text-emerald-400">{item.total_durasi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </Card>
    </div>
  );
}