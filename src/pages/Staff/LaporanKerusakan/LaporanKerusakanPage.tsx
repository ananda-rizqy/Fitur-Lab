import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { AlertTriangle } from "lucide-react";

import api from "../../../services/api";
import { getColumns } from "./columns";

import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { Lightbox } from "../../../components/atoms/LightBox";
import { ToolbarSearch } from "../../../components/molecules/ToolbarSearch";

export function LaporanKerusakanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [startDate, setStartDate] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("all");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("peminjaman/laporan-rusak");
      setData(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    data.forEach((item: any) => {
      if (item.kelas) {
        classes.add(item.kelas.trim());
      } else if (item.user?.kelas) {
        classes.add(item.user.kelas.trim());
      }
    });
    return Array.from(classes);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (startDate) {
        const rawDate = item.waktu_kembali || item.tanggal_kembali;
        if (!rawDate) return false;
        try {
          const itemDateString = rawDate.split("T")[0];
          if (itemDateString !== startDate) return false;
        } catch (e) {
          return false;
        }
      }

      if (classFilter !== "all") {
        const itemClass = (item.kelas || item.user?.kelas || "").trim();
        if (itemClass !== classFilter) return false;
      }

      return true;
    });
  }, [data, startDate, classFilter]);

  const handleClearFilters = () => {
    setStartDate("");
    setClassFilter("all");
    setCurrentPage(1);
  };

  const stats = useMemo(
    () => ({
      total: filteredData.length,
    }),
    [filteredData],
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
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

    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase().trim();

      const namaMhs = String(row.original.nama_mahasiswa || "").toLowerCase();
      const nimMhs = String(row.original.nim_mahasiswa || "").toLowerCase();
      const namaAlat = String(row.original.nama_alat || "").toLowerCase();
      const ruangan = String(row.original.ruangan_lab || "").toLowerCase();
      const deskripsi = String(
        row.original.deskripsi_kerusakan || "",
      ).toLowerCase();

      return (
        namaMhs.includes(search) ||
        nimMhs.includes(search) ||
        namaAlat.includes(search) ||
        ruangan.includes(search) ||
        deskripsi.includes(search)
      );
    },
  });

  return (
    <PageLayout
      pageTitle="Laporan Kerusakan Alat"
      pageDescription="Daftar laporan kerusakan alat di laboratorium"
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none text-left">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono font-black tracking-widest text-zinc-400 mb-0.5">
                  Total Laporan
                </p>
                <p className="text-xl font-mono font-black text-red-600 mt-1">
                  {stats.total} Kasus
                </p>
              </div>
              <div className="w-8 h-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-red-500 shrink-0 shadow-none">
                <AlertTriangle size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* 👑 SOLUSI: Menyembunyikan input tanggal kedua lewat CSS selektor tanpa merusak fungsi internal */}
        <div className="[&_div:nth-child(2)]:hidden md:[&_div:nth-child(2)]:hidden">
          <LoanFilterCard
            startDate={startDate}
            endDate={startDate}
            onStartDateChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            onEndDateChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            onClear={handleClearFilters}
          />
        </div>

        <ToolbarSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          classFilter={classFilter}
          setClassFilter={(val) => {
            setClassFilter(val);
            setCurrentPage(1);
          }}
          uniqueClasses={uniqueClasses}
          pageSize={table.getState().pagination.pageSize}
          table={table} // 👑 Mengirim instance tabel langsung
          setCurrentPage={setCurrentPage} // 👑 Mengirim handler set nomor halaman
        />
        <div className="w-full overflow-hidden">
          <RiwayatPeminjamanAlatTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4 w-full">
          <span className="text-xs text-zinc-400 font-mono font-black tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <LoanPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                table.setPageIndex(page - 1);
              }}
            />
          </div>
        </div>

        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
}
