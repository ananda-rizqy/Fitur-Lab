import { useEffect, useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { PlusCircle, Pencil, XCircle, Plus, Edit, Trash2, X, Layers, Package, Search, Download, Loader2 } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { InventoryTable } from "../../../components/organism/InventoryTable";
import { AlatForm } from "../../../components/molecules/AlatForm";
import { ToolbarInventory } from "../../../components/molecules/ToolbarInventory";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { InventorySummaryGrid } from "../../../components/organism/InventorySummaryGrid";
import { getColumns } from "./column";
import api from "../../../services/api";
import Swal from "sweetalert2";

export function KetersediaanAlatPage() {
  const [alatList, setAlatList] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // State Filter
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  
  // State Paginasi Terintegrasi TanStack Table
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const handleExportAlat = async () => {
  try {
    setIsExporting(true);
    const response = await api.get('/export/alat', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Laporan_Data_Alat.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Swal.fire("Gagal", "Terjadi kesalahan saat mengekspor data alat.", "error");
  } finally {
    setIsExporting(false);
  }
};

  const auth = useMemo(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth && storedAuth.trim().startsWith("{")) {
        return JSON.parse(storedAuth);
      }
      return {};
    } catch (e) {
      console.error("Gagal membaca session auth:", e);
      return {};
    }
  }, []);

  const user = auth.user || {};

  const canExport = useMemo(() => {
    if (!user) return false;
    
    const roleStr = (user.role || "").toLowerCase().trim();
    const jabatanStr = (user.jabatan || "").toLowerCase().trim();

    // Tombol export alat hanya muncul untuk Admin atau Dosen dengan jabatan Kaprodi
    return roleStr === "admin" || (roleStr === "dosen" && jabatanStr === "kaprodi");
  }, [user]);

  const isStaff = useMemo(() => {
    if (!user || !user.role) return false;
    const roleStr = user.role.toString().toLowerCase().trim();
    return roleStr === "staff" || roleStr === "tendik" || roleStr === "admin";
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/alats`);
      setAlatList(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Gagal sinkronisasi inventori alat:", err);
      setAlatList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, conditionFilter, statusFilter, dateFilter]);

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Aset Alat?",
        text: "Tindakan ini akan menghapus data registrasi alat ini dari basis data lab secara permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#ffffff",
        confirmButtonText: "YA, HAPUS!",
        cancelButtonText: "BATAL",
        customClass: {
          popup: "rounded-none border-4 border-zinc-950 font-mono",
          title: "font-black uppercase tracking-wide text-zinc-900 text-lg",
          htmlContainer: "font-bold text-zinc-500 text-xs uppercase tracking-tight",
          confirmButton:
            "rounded-none font-mono font-black text-xs uppercase tracking-wider border-2 border-zinc-950 bg-black text-white px-5 py-2.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] hover:bg-zinc-800 transition-colors",
          cancelButton:
            "rounded-none font-mono font-black text-xs uppercase tracking-wider border-2 border-zinc-950 bg-white text-zinc-950 px-5 py-2.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] hover:bg-zinc-100 transition-colors text-zinc-900",
        },
        buttonsStyling: false,
      });

      if (!result.isConfirmed) return;

      await api.delete(`/alats/${id}`);
      Swal.fire({
        title: "Terhapus",
        text: "Data alat berhasil dieliminasi dari sistem.",
        icon: "success",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gagal menghapus parameter perangkat inventori.";
      Swal.fire({
        title: "Aksi Ditolak",
        text: msg,
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
    }
  };

  const uniqueRooms = useMemo(() => {
    const listPerangkat = Array.isArray(alatList) ? alatList : [];
    if (listPerangkat.length === 0) return [];

    const daftarRuangan = listPerangkat
      .map((item: any) => {
        const namaRuangan = item?.letak?.nama_letak || item?.letak || item?.ruangan_lab || item?.lokasi;
        return namaRuangan ? namaRuangan.toString().trim() : null;
      })
      .filter((room): room is string => !!room);
    return Array.from(new Set(daftarRuangan));
  }, [alatList]);

  const conditionFiltered = useMemo(() => {
    let listPerangkat = Array.isArray(alatList) ? alatList : [];
    if (listPerangkat.length === 0) return [];
    
    if (conditionFilter && conditionFilter !== "all") {
      listPerangkat = listPerangkat.filter((item: any) => {
        const lokasiItem = (item?.letak?.nama_letak || item?.letak || item?.ruangan_lab || item?.lokasi || "")
          .toString().toLowerCase().trim();
        return lokasiItem === conditionFilter.toLowerCase().trim();
      });
    }
    
    if (statusFilter && statusFilter !== "all") {
      listPerangkat = listPerangkat.filter((item: any) => {
        const kondisiItem = (item?.kondisi || "")
          .toString().toLowerCase().trim();
        return kondisiItem === statusFilter.toLowerCase().trim();
      });
    }
    return listPerangkat;
  }, [alatList, conditionFilter, statusFilter]);

  const stats = useMemo(() => {
    const modelNames = alatList.map((a: any) => {
      const rawName = a.nama_alat || "";
      return rawName.replace(/[0-9]/g, "").trim().toUpperCase();
    });
    
    const totalModels = new Set(modelNames).size;
    const totalVolume = alatList.reduce((sum, a: any) => sum + (Number(a.jumlah) || 0), 0);
    const totalLayak = alatList.filter((a: any) => a.kondisi?.toLowerCase() === "baik").length;
    const totalRusak = alatList.filter((a: any) => a.kondisi?.toLowerCase() === "rusak").length;

    return {
      total: totalModels,
      layak: totalLayak,
      rusak: totalRusak,
      volume: totalVolume,
    };
  }, [alatList]);

  const columns = useMemo(
    () =>
      getColumns(
        isStaff,
        (selectedRowData) => {
          setEditData(selectedRowData);
          setIsFormOpen(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        handleDelete,
        (url) => {
          Swal.fire({
            imageUrl: url,
            imageAlt: 'Preview Foto Alat',
            showConfirmButton: false,
            showCloseButton: true,
            padding: '1rem',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.8)',
            customClass: {
              popup: "rounded-none border-4 border-zinc-950 shadow-[8px_8px_0px_0px_rgba(9,9,11,1)]",
              image: "object-contain max-h-[70vh] w-auto border-2 border-zinc-950",
              closeButton: "text-zinc-950 hover:text-red-500 focus:outline-none"
            }
          });
        }
      ),
    [isStaff],
  );

  const table = useReactTable({
    data: conditionFiltered,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalPages = table.getPageCount() || 1;
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <PageLayout
      pageTitle="Inventory Peralatan Laboratorium"
      pageDescription="Sistem ketersediaan alat laboratorium telekomunikasi."
    >
      <div className="w-full py-2 space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-mono">
        
        {/* 🌟 KONTAINER UTAMA (Grid Statistik & Grup Tombol Aksi) */}
        <div className="w-full flex flex-col lg:flex-row gap-4 items-stretch justify-between">
          
          {/* BAGIAN KIRI: Grid Statistik */}
          <div className="flex-1 min-w-0">
            <InventorySummaryGrid stats={stats} />
          </div>

          {/* 🌟 BAGIAN KANAN: Grup Tombol sejajar (Export & Tambah) */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            
            {/* TOMBOL EXPORT EXCEL */}
            {canExport && (
              <Button
                variant="brutal"
                onClick={handleExportAlat}
                disabled={isExporting}
                className="w-full sm:w-auto md:w-[200px] border-2 border-zinc-950 dark:border-zinc-800 rounded-none h-full min-h-[92px] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-xs font-black tracking-wider uppercase flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                Export Excel
              </Button>
            )}

            {/* TOMBOL TAMBAH ITEM */}
            {isStaff === true && (
              <Button
                variant="brutal"
                onClick={() => {
                  setEditData(null);
                  setIsFormOpen(!isFormOpen);
                }}
                className="w-full sm:w-auto md:w-[200px] border-2 border-zinc-950 dark:border-zinc-800 rounded-none h-full min-h-[92px] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-xs font-black tracking-wider uppercase flex items-center justify-center bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-200 shrink-0"
              >
                {isFormOpen ? <XCircle size={14} className="mr-2 text-red-500" /> : <PlusCircle size={14} className="mr-2 text-zinc-900 dark:text-white" />}
                {isFormOpen ? "Batal" : "Tambah Item"}
              </Button>
            )}
            
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full text-left">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-zinc-950 dark:border-zinc-800 pb-4">
              <div className="w-12 h-12 bg-zinc-950 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-white flex items-center justify-center rounded-none shrink-0 font-mono font-black">
                {editData ? <Pencil size={18} /> : <PlusCircle size={18} />}
              </div>
              <div>
                <h3 className="text-xl font-mono font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  {editData ? "UPDATE DATA INVENTORI" : "REGISTRASI ITEM BARU"}
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-black uppercase mt-1 tracking-widest">
                  {editData ? "UBAH SPESIFIKASI ATAU LOKASI RAK PERANGKAT LAB" : "MASUKKAN PARAMETER ALAT PRAKTIKUM BARU"}
                </p>
              </div>
            </div>

            <div className="w-full font-mono text-xs uppercase tracking-tight">
              <AlatForm
                initialData={editData || undefined}
                onSuccess={() => {
                  const isEditing = !!editData;
                  setIsFormOpen(false);
                  setEditData(null);
                  fetchData();
                  Swal.fire({
                    title: "Berhasil",
                    text: isEditing ? "Data alat berhasil diperbarui." : "Alat baru berhasil didaftarkan.",
                    icon: "success",
                    confirmButtonColor: "#18181b",
                    customClass: { confirmButton: "rounded-none font-mono" },
                  });
                }}
              />
            </div>
          </div>
        )}
        
        <ToolbarInventory
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          pageSize={table.getState().pagination.pageSize}
          setPageSize={(size) => table.setPageSize(size)}
          onRefresh={fetchData}
          loading={loading}
          rooms={uniqueRooms}
        />

        <div className="w-full max-w-full block overflow-x-auto border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none bg-white dark:bg-zinc-900">
          <InventoryTable table={table} loading={loading} header="MANIFES KETERSEDIAAN ALAT" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4 w-full">
          <span className="text-xs text-zinc-400 font-mono font-black uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <LoanPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                table.setPageIndex(page - 1);
              }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}