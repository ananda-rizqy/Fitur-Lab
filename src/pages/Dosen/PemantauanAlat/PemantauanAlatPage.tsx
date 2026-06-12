import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import api from "../../../services/api";
import { getColumns } from "./Columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { Lightbox } from "../../../components/atoms/LightBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { StatsSummaryGrid } from "../../../components/organism/StatsSummaryGrid";

export function PemantauanAlatPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("peminjaman/pantau-riwayat");
      setData(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRiwayat(); }, []);

  const uniqueClasses = useMemo(() => {
    const classes = data.map((item) => item.kelas_mahasiswa).filter((val) => val && val.trim() !== "-" && val.trim() !== "");
    return Array.from(new Set(classes)).sort();
  }, [data]);

  const filteredData = useMemo(() => {
  if (!Array.isArray(data)) return [];

  return data.filter((item) => {
    if (classFilter !== "all" && item.kelas_mahasiswa !== classFilter) return false;
    const matchesSearch = searchQuery 
      ? item.details?.some((d: any) => 
          d.alat?.nama_alat.toLowerCase().includes(searchQuery.toLowerCase())
        ) 
      : true;
    if (!matchesSearch) return false;

    const rawDate = item.waktu_pinjam || item.waktu_mulai; 
    if (!rawDate) return true;
    const itemDate = rawDate.split("T")[0]; 

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;

    return true;
  });
}, [data, startDate, endDate, classFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    ongoing: filteredData.filter(
      (i) => i.status === "ongoing" || i.status === "berlangsung").length,
    baik: filteredData.filter((i) => i.kondisi_kembali === "baik").length,
    rusak: filteredData.filter((i) => i.kondisi_kembali === "rusak").length,
  }), [filteredData]);

  const table = useReactTable({
    data: filteredData,
    columns: useMemo(() => getColumns(setSelectedImg), []),
    state: { sorting, pagination: { pageIndex: currentPage - 1, pageSize: 5 } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleClearFilters = () => {
    setStartDate(""); setEndDate(""); setClassFilter("all"); setCurrentPage(1);
  };

  return (
    <PageLayout pageTitle="Arsip Logbook Ruangan" pageDescription="Monitoring aktivitas ruang lab.">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-6 space-y-6">
        <StatsSummaryGrid stats={stats} />
        
        <LoanFilterCard 
          startDate={startDate} 
          endDate={endDate} 
          searchQuery={searchQuery} 
          onStartDateChange={(v) => setStartDate(v)} 
          onEndDateChange={(v) => setEndDate(v)} 
          onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }} 
          onClear={handleClearFilters} 
        />
                
        <div className="bg-white p-4 border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
          <Select value={classFilter} onValueChange={(val: string) => { setClassFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-full md:w-64 h-11 border-2 border-zinc-950 rounded-none font-mono text-xs"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 rounded-none">
              <SelectItem value="all">Semua Kelas</SelectItem>
              {uniqueClasses.map((kelas) => <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 border-b-2 border-zinc-950">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="text-[10px] font-mono font-black text-zinc-950 uppercase p-4 whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={6} className="text-center p-10 font-mono text-xs">Memuat data...</TableCell></TableRow>
              ) : table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-b-2 border-zinc-100">
                  {row.getVisibleCells().map(cell => <TableCell key={cell.id} className="p-4 align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="h-24 text-center font-mono text-xs">Data tidak ditemukan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <LoanPagination currentPage={currentPage} totalPages={Math.ceil(filteredData.length / 5) || 1} onPageChange={(p) => { setCurrentPage(p); table.setPageIndex(p - 1); }} />
        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
}