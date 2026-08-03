import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel, 
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

import api from "../../../services/api";
import { PageLayout } from "../../../layouts/PageLayout";
import { StatsSummaryGrid } from "../../../components/organism/StatsSummaryGrid";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard"; // 🌟 KEMBALI KE KODE LAMA
import { Lightbox } from "../../../components/atoms/LightBox"; // 🌟 KEMBALI KE KODE LAMA
import { LoanPagination } from "../../../components/organism/LoanPagination"; // 🌟 KEMBALI KE KODE LAMA
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { getColumns } from "./columns";

export function RiwayatPeminjamanAlatPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State Pagination Pembantu Bawaan Kode Lama
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // State Input Rentang Waktu Tanggal Peminjaman
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("mahasiswa/riwayat-saya");
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal sinkronisasi log riwayat alat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const filteredData = useMemo(() => {
  return data.filter((item) => {
    // 1. Filter Pencarian Nama Alat
    const matchesSearch = searchQuery 
      ? item.details?.some((d: any) => 
          d.alat?.nama_alat.toLowerCase().includes(searchQuery.toLowerCase())
        ) 
      : true;

    // 2. Filter Tanggal Presisi
    // Kita pastikan mengambil tanggal dalam format YYYY-MM-DD dari API
    const rawDate = item.waktu_pinjam || item.created_at;
    const matchesDate = (() => {
      if (!startDate && !endDate) return true;
      if (!rawDate) return false;

      // Ambil bagian tanggal saja: "2026-06-11"
      const itemDate = rawDate.split("T")[0];

      // Jika startDate ada, cek apakah itemDate >= startDate
      if (startDate && itemDate < startDate) return false;
      
      // Jika endDate ada, cek apakah itemDate <= endDate
      if (endDate && itemDate > endDate) return false;

      return true;
    })();

    return matchesSearch && matchesDate;
  });
}, [data, startDate, endDate, searchQuery]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);
  
  const stats = useMemo(
    () => ({
      total: filteredData.length,
      ongoing: filteredData.filter((i) => i.status === "ongoing" || i.status === "berlangsung").length,
      baik: filteredData.filter((i) => i.kondisi_kembali === "baik").length,
      rusak: filteredData.filter((i) => i.kondisi_kembali === "rusak").length,
    }),
    [filteredData],
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  // Fungsi Pembersih Filter Selaras Penggunaan Ruang
  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setGlobalFilter("");
    setCurrentPage(1);
  };

  return (
    <PageLayout
      pageTitle="Riwayat Penggunaan Alat"
      pageDescription="Daftar rekam jejak peminjaman perangkat laboratorium."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <StatsSummaryGrid stats={stats} />

                <LoanFilterCard
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery} 
          onStartDateChange={(val: string) => {
          setStartDate(val);
          setCurrentPage(1);
          table.setPageIndex(0);
          }}
          onEndDateChange={(val: string) => {
            setEndDate(val);
            setCurrentPage(1);
          }}
          onSearchChange={(val: string) => { 
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          onClear={() => {
            handleClearFilters();
            setSearchQuery(""); 
          }}
        />

        {/* AREA UTAMA MANIFES DATA TABEL */}
        <div className="overflow-hidden w-full">
          <RiwayatPeminjamanAlatTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />
        </div>

        {/* AREA FOOTER NAVIGATION PAGINATION BAWAAN KODE LAMA */}
        <div className="w-full flex justify-center pt-2">
          <LoanPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>

        {/* LIGHTBOX ATOMIK ASLI */}
        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />

      </div>
    </PageLayout>
  );
}