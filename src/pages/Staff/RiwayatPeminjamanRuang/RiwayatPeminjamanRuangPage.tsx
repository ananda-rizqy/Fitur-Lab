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
import { getColumns } from "./columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { Lightbox } from "../../../components/atoms/LightBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export function RiwayatPeminjamanRuangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("tendik/riwayat-ruang");
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
  const classes = data.map((item) => item.kelas_mahasiswa).filter((val) => val && val !== "-" && val !== "");
  return Array.from(new Set(classes)).sort();
}, [data]);

  const filteredData = useMemo(() => {
  return data.filter((item) => {
    if (classFilter !== "all" && item.kelas_mahasiswa !== classFilter) return false;
    if (!item.waktu_masuk) return true;
    const parseDate = (dateStr: string) => {
        const parts = dateStr.split(",")[0].trim().split(" ");
        const day = parts[0];
        const monthMap: any = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
        const month = monthMap[parts[1]];
        const year = parts[2];
        return `${year}-${month}-${day}`;
    };

    const itemDate = parseDate(item.waktu_masuk);
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    
    return true;
  });
}, [data, startDate, endDate, classFilter]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);
  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination: { pageIndex: currentPage - 1, pageSize: 5 } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const stats = useMemo(() => ({
    total: filteredData.length,
    aktif: filteredData.filter((i) => 
    i.status?.toLowerCase() === "aktif" || 
    i.kondisi_keluar?.toLowerCase().includes("sedang digunakan")
  ).length,
    bersih: filteredData.filter((i) => (i.kondisi_keluar || "").toLowerCase().trim() === "bersih").length,
    kotor: filteredData.filter((i) => (i.kondisi_keluar || "").toLowerCase().trim() === "kotor").length,
  }), [filteredData]);

  return (
    <PageLayout pageTitle="Arsip Logbook Ruangan" pageDescription="Monitoring aktivitas ruang lab.">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-6 space-y-6 antialiased text-left bg-white dark:bg-zinc-950 transition-colors duration-300">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            {title: "Total log", val: stats.total, unit: "log"}, 
            {title: "Aktif", val: stats.aktif, unit: "sesi"}, 
            {title: "Kondisi bersih", val: stats.bersih, unit: "log", color: "text-emerald-600"}, 
            {title: "Kondisi kotor", val: stats.kotor, unit: "log", color: "text-red-600"}
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 p-4 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
              <p className="text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest">{s.title}</p>
              <p className={`text-xl font-mono font-black mt-1 ${s.color || "text-zinc-950"}`}>{s.val} {s.unit}</p>
            </div>
          ))}
        </div>

        {/* Filter Card (Search bar otomatis hilang karena tidak ada props search) */}
        <LoanFilterCard 
          startDate={startDate} 
          endDate={endDate} 
          onStartDateChange={(v) => { setStartDate(v); setCurrentPage(1); }}
          onEndDateChange={(v) => { setEndDate(v); setCurrentPage(1); }}
          onClear={() => { 
            setStartDate(""); 
            setEndDate("");
            setCurrentPage(1);
          }}
        />

        <div className="bg-white p-4 border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]">
          <Select 
            value={classFilter} 
            onValueChange={(val: string) => { setClassFilter(val); setCurrentPage(1); }}
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

        {/* Tabel Wrapper */}
        <div className="w-full border-2 border-zinc-950 bg-white shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] overflow-x-auto">
          <Table className="w-full">
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="border-b-2 border-zinc-100">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="p-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-xs font-mono text-zinc-500">
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <LoanPagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(filteredData.length / 5) || 1} 
          onPageChange={(p) => { setCurrentPage(p); table.setPageIndex(p - 1); }} 
        />
        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
} 