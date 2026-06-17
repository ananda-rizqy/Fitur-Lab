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
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { Lightbox } from "../../../components/atoms/LightBox";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { getColumns } from "./columns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../components/ui/select";

export function RiwayatPeminjamanAlat() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [classFilter, setClassFilter] = useState<string>("all");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("peminjaman/monitor-riwayat");
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);


  const uniqueClasses = useMemo(() => {
  const classes = data.map((item) => item.kelas_mahasiswa).filter(Boolean);
  
  return Array.from(new Set(classes)).sort(); // Mendapatkan nilai unik dan mengurutkannya
  }, [data]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    return data.filter((item: any) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (classFilter !== "all" && item.kelas_mahasiswa !== classFilter) return false;

      const matchesSearch = searchQuery 
        ? item.details?.some((d: any) => 
            d.alat?.nama_alat.toLowerCase().includes(searchQuery.toLowerCase())
          ) 
        : true;
      if (!matchesSearch) return false;

      const itemDate = (item.waktu_pinjam || item.created_at || "").substring(0, 10);
      return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    });
  }, [data, statusFilter, startDate, endDate, searchQuery, classFilter]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  const stats = useMemo(() => ({
    total: filteredData.length,
    ongoing: filteredData.filter(
      (i) => i.status === "ongoing" || i.status === "berlangsung").length,
    baik: filteredData.filter((i) => i.kondisi_kembali === "baik").length,
    rusak: filteredData.filter((i) => i.kondisi_kembali === "rusak").length,
  }), [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: currentPage - 1, pageSize },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <PageLayout pageTitle="Riwayat Peminjaman Alat" pageDescription="Monitor rekam jejak peminjaman alat.">
      <div className="py-6 w-full space-y-6">
        <StatsSummaryGrid stats={stats} />

        <LoanFilterCard
          startDate={startDate}
          endDate={endDate}
          searchQuery={searchQuery}
          onStartDateChange={(val) => { setStartDate(val); setCurrentPage(1); }}
          onEndDateChange={(val) => { setEndDate(val); setCurrentPage(1); }}
          onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          onClear={handleClearFilters}
        />

        {/* TAMBAHKAN DROPDOWN KELAS DI SINI */}
<div className="bg-white p-4 border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
  <Select 
    value={classFilter} 
    onValueChange={(val) => { setClassFilter(val); setCurrentPage(1); }}
  >
    <SelectTrigger className="w-full md:w-64 h-11 border-2 border-zinc-950 rounded-none font-mono text-xs">
      <SelectValue placeholder="Pilih Kelas" />
    </SelectTrigger>
    <SelectContent className="border-2 border-zinc-950 rounded-none">
      <SelectItem value="all">Semua Kelas</SelectItem>
      {uniqueClasses.map((kelas) => (
        <SelectItem key={kelas} value={kelas}>
          {kelas}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="overflow-hidden w-full">
          <RiwayatPeminjamanAlatTable table={table} loading={loading} columnsCount={columns.length} />
        </div>

        <div className="flex justify-center pt-2">
          <LoanPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / pageSize) || 1}
            onPageChange={(page) => {
              setCurrentPage(page);
              table.setPageIndex(page - 1);
            }}
          />
        </div>

        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
}