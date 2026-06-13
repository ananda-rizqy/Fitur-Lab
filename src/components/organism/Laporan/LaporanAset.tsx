import { useEffect, useState, useMemo } from "react";
import api from "../../../services/api";
import { Tag } from "lucide-react";
import { LoanPagination } from "../LoanPagination";

interface LaporanAsetProps {
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export function LaporanAset({ searchQuery = "", startDate = "", endDate = "" }: LaporanAsetProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
  try {
    setLoading(true);
    
    const res = await api.get("/laporan/penggunaan-aset", {
      params: { 
        start_date: startDate, 
        end_date: endDate 
      }
    });
    
    setData(res.data);
  } catch (err) {
    console.error("Gagal ambil data:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchLaporan();
  }, [startDate, endDate]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.filter((item: any) => {
      // 1. Amankan pengecekan nama_alat
      const namaAlat = item?.nama_alat || "";
      const matchesSearch = namaAlat.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Amankan pengecekan tanggal
      let matchesDate = true;
      if (startDate && endDate && item.waktu_pinjam) {
        try {
          const itemDate = new Date(item.waktu_pinjam).toISOString().split('T')[0];
          matchesDate = itemDate >= startDate && itemDate <= endDate;
        } catch (e) {
          matchesDate = true; // Jika tanggal rusak, abaikan filter tanggal
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [data, searchQuery, startDate, endDate]);

  // 3. Paginate data hasil filter
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="p-8 text-center font-mono text-xs animate-pulse">MEMUAT MANIFES DATA...</div>;

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
        <table className="w-full min-w-[500px] text-left border-collapse font-mono text-x">
          <thead className="bg-zinc-950 text-white">
            <tr>
              <th className="p-4 border-r border-zinc-700 uppercase tracking-wider">Nama Alat</th>
              <th className="p-4 border-r border-zinc-700 uppercase tracking-wider">Kode Tag</th>
              <th className="p-4 uppercase tracking-wider">Total Durasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item: any, i) => (
                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 font-black text-xs uppercase tracking-tight">{item.nama_alat}</td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white border-2 border-zinc-950 rounded-none">
                      <Tag size={11} className="text-zinc-900" />
                      <code className="text-[10px] font-black uppercase tracking-tighter">{item.kode_tag || "N/A"}</code>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center px-3 py-1.5 font-black text-[10px] uppercase rounded-none border-2 border-zinc-950 bg-blue-50 text-blue-700 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
                      {item.total_durasi}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-zinc-500 font-black uppercase">
                  Data Tidak Ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-zinc-950 bg-white px-6 py-4 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex items-center gap-0">
          <LoanPagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}