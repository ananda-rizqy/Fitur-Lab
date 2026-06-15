import { useEffect, useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import api from "../../../services/api";
import { getColumns } from "./columns";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { StatsSummaryGridRuang } from "../../../components/organism/StatsSummaryGridRuang"; // Impor komponen yang benar
import { Lightbox } from "../../../components/atoms/LightBox";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";

export function RiwayatPenggunaanRuangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const itemsPerPage = 5;

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("mahasiswa/riwayat-ruang");
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRiwayat(); }, []);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  const filteredData = useMemo(() => {
  return data.filter((item) => {
    if (!item.waktu_masuk) return true;

    // 1. Parser yang lebih presisi
    const parseDate = (dateStr: string) => {
      try {
        // Contoh input: "15 Jun 2026, 14:07"
        // Ambil bagian tanggal: "15 Jun 2026"
        const datePart = dateStr.split(",")[0].trim(); 
        const [day, monthName, year] = datePart.split(" ");
        
        const monthMap: any = { 
          "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", 
          "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" 
        };
        
        const month = monthMap[monthName] || "01";
        // Hasil akhir: YYYY-MM-DD
        return `${year}-${month}-${day.padStart(2, '0')}`;
      } catch (e) {
        return null;
      }
    };

    const itemDate = parseDate(item.waktu_masuk);
    if (!itemDate) return true;

    // 2. Debugging: Buka console browser untuk memastikan format cocok
    // console.log("Data Date:", itemDate, "Filter:", startDate, "to", endDate);

    // 3. Logika Filter yang benar
    const isAfterStart = startDate ? itemDate >= startDate : true;
    const isBeforeEnd = endDate ? itemDate <= endDate : true;
    
    return isAfterStart && isBeforeEnd;
  });
}, [data, startDate, endDate]);

  const stats = useMemo(() => {
  return {
    total: filteredData.length,
    // Tambahkan "belum check-out" ke dalam daftar status aktif
    aktif: filteredData.filter((i) => {
      const status = i.status?.toLowerCase().trim();
      const kondisiKeluar = i.kondisi_keluar?.toLowerCase().trim();
      
      return (
        status === "berlangsung" || 
        status === "dipesan" || 
        status === "menunggu" ||
        kondisiKeluar === "belum check-out"
      );
    }).length,
    bersih: filteredData.filter((i) => {
      const kondisi = i.kondisi_keluar?.toLowerCase().trim();
      return kondisi === "bersih" || kondisi === "baik";
    }).length,
    kotor: filteredData.filter((i) => {
      const kondisi = i.kondisi_keluar?.toLowerCase().trim();
      return kondisi === "kotor" || kondisi === "rusak";
    }).length,
  };
}, [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting, pagination: { pageIndex: currentPage - 1, pageSize: itemsPerPage } },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <PageLayout pageTitle="Riwayat Penggunaan Ruang" pageDescription="...">
      <div className="py-6 w-full space-y-6">
        <StatsSummaryGridRuang stats={stats} />
        <LoanFilterCard 
            startDate={startDate} endDate={endDate} 
            onStartDateChange={(v) => { setStartDate(v); setCurrentPage(1); }}
            onEndDateChange={(v) => { setEndDate(v); setCurrentPage(1); }}
            onClear={() => { setStartDate(""); setEndDate(""); }} 
        />
        <RiwayatPeminjamanAlatTable table={table} loading={loading} columnsCount={columns.length} />
        <LoanPagination currentPage={currentPage} totalPages={Math.ceil(filteredData.length / itemsPerPage) || 1} onPageChange={setCurrentPage} />
        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
} 