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

import { Button } from "../components/ui/button";
import { PageLayout } from "../layouts/PageLayout";
import { LoanPagination } from "../components/organism/LoanPagination";
import api from "../services/api";
import Swal from "sweetalert2";

interface Bahan {
  id: number;
  nama_bahan: string;
  jumlah: number;
  letak: {
    id: number;
    nama_letak: string;
    gedung: {
      nama_gedung: string;
    };
  };
}

interface BahanManagementProps {
  userRole: "tendik" | "dosen" | "mahasiswa";
}

export function BahanManagement({ userRole }: BahanManagementProps) {
  const [bahans, setBahans] = useState<Bahan[]>([]);
  const [rooms, setRooms] = useState<{ id: number; nama_letak: string }[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Form & Filter
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [formData, setFormData] = useState({
    nama_bahan: "",
    letak_id: "" as number | "",
    jumlah: "" as number | "",
  });

  const auth = useMemo(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth && storedAuth.trim().startsWith("{")) {
        return JSON.parse(storedAuth);
      }
      return {};
    } catch (e) {
      return {};
    }
  }, []);

  const user = auth.user || {};

  // 🌟 2. CEK APAKAH USER SAAT INI ADALAH KAPRODI (ATAU ADMIN)
  const canExport = useMemo(() => {
    if (!user) return false;
    
    const roleStr = (user.role || "").toLowerCase().trim();
    const jabatanStr = (user.jabatan || "").toLowerCase().trim();

    // Export HANYA muncul untuk Admin atau Dosen dengan jabatan Kaprodi
    return roleStr === "admin" || (roleStr === "dosen" && jabatanStr === "kaprodi");
  }, [user]);

  // Validasi Hak Akses Staff / Tendik / Admin
  const isStaff = useMemo(() => {
    if (!userRole) return false;
    const roleStr = userRole.toString().toLowerCase().trim();
    return roleStr === "staff" || roleStr === "tendik" || roleStr === "admin";
  }, [userRole]);

  const fetchBahans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/bahans");
      setBahans(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil data bahan:", err);
      setBahans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await api.get("/letaks");
      setRooms(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil daftar ruangan:", err);
    }
  }, []);

  useEffect(() => {
    fetchBahans();
    if (isStaff) {
      fetchRooms();
    }
  }, [fetchBahans, fetchRooms, isStaff]);

  // Reset ke halaman pertama saat filter berubah
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, roomFilter]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await api.get('/export/bahan', {
        responseType: 'blob', // Penting agar file terbaca utuh
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Laporan_Data_Bahan.csv');
      document.body.appendChild(link);
      
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal export:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengekspor data bahan.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ nama_bahan: "", letak_id: "", jumlah: "" });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Bahan) => {
    setEditId(item.id);
    setFormData({
      nama_bahan: item.nama_bahan,
      letak_id: item.letak?.id || "",
      jumlah: item.jumlah,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/bahans/${editId}`, formData);
        Swal.fire({
          title: "Berhasil",
          text: "Data bahan berhasil diperbarui.",
          icon: "success",
          confirmButtonColor: "#18181b",
          customClass: { confirmButton: "rounded-none font-mono" },
        });
      } else {
        await api.post("/bahans", formData);
        Swal.fire({
          title: "Berhasil",
          text: "Bahan baru berhasil didaftarkan.",
          icon: "success",
          confirmButtonColor: "#18181b",
          customClass: { confirmButton: "rounded-none font-mono" },
        });
      }
      setIsFormOpen(false);
      setEditId(null);
      fetchBahans();
    } catch (error: any) {
      console.error("Gagal menyimpan bahan:", error.response?.data || error);
      alert(error.response?.data?.message || "Gagal menyimpan data bahan");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Bahan Lab?",
        text: "Tindakan ini akan menghapus data bahan dari basis data secara permanen.",
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
            "rounded-none font-mono font-black text-xs uppercase tracking-wider border-2 border-zinc-950 bg-white text-zinc-950 px-5 py-2.5 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] hover:bg-zinc-100 transition-colors",
        },
        buttonsStyling: false,
      });

      if (!result.isConfirmed) return;

      await api.delete(`/bahans/${id}`);
      Swal.fire({
        title: "Terhapus",
        text: "Data bahan berhasil dieliminasi dari sistem.",
        icon: "success",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
      fetchBahans();
    } catch (err: any) {
      alert("Gagal menghapus data bahan");
    }
  };

  // Mengambil daftar ruangan unik dari data bahan untuk dropdown filter
  const uniqueRooms = useMemo(() => {
    const listBahan = Array.isArray(bahans) ? bahans : [];
    if (listBahan.length === 0) return [];

    const daftarRuangan = listBahan
      .map((item: any) => item?.letak?.nama_letak)
      .filter((room): room is string => !!room);
    return Array.from(new Set(daftarRuangan));
  }, [bahans]);

  // Filter data berdasarkan ruangan yang dipilih
  const filteredBahans = useMemo(() => {
    let listBahan = Array.isArray(bahans) ? bahans : [];
    if (listBahan.length === 0) return [];

    if (roomFilter && roomFilter !== "all") {
      listBahan = listBahan.filter((item: any) => {
        const namaLetak = (item?.letak?.nama_letak || "").toString().toLowerCase().trim();
        return namaLetak === roomFilter.toLowerCase().trim();
      });
    }
    return listBahan;
  }, [bahans, roomFilter]);

  // Konfigurasi Kolom untuk TanStack Table
  const columns = useMemo(
    () => [
      {
        header: "No",
        id: "rowNumber",
        cell: (info: any) => info.row.index + 1,
      },
      {
        accessorKey: "nama_bahan",
        header: "Nama Bahan",
        cell: (info: any) => (
          <span className="font-black text-zinc-900 dark:text-zinc-50 uppercase">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "letak",
        header: "Lokasi / Ruangan",
        cell: (info: any) => {
          const letak = info.getValue();
          return (
            <span className="text-zinc-600 dark:text-zinc-400 font-bold uppercase">
              {letak?.gedung?.nama_gedung ? `${letak.gedung.nama_gedung} - ` : ""}
              {letak?.nama_letak || "-"}
            </span>
          );
        },
      },
      {
        accessorKey: "jumlah",
        header: "Jumlah Stok",
        cell: (info: any) => (
          <span className="inline-block px-2.5 py-1 border-2 border-zinc-950 bg-white text-zinc-950 font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            {info.getValue()} UNIT
          </span>
        ),
      },
      ...(isStaff
        ? [
            {
              id: "aksi",
              header: () => <div className="text-center">Aksi</div>,
              cell: ({ row }: { row: any }) => {
                const item = row.original;
                return (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 border-2 border-zinc-950 bg-amber-300 hover:bg-amber-400 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 border-2 border-zinc-950 bg-rose-500 hover:bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [isStaff]
  );

  const stats = useMemo(() => {
    const totalModels = bahans.length;
    const totalVolume = bahans.reduce((sum, b: any) => sum + (Number(b.jumlah) || 0), 0);
    return {
      total: totalModels,
      volume: totalVolume,
    };
  }, [bahans]);

  const table = useReactTable({
    data: filteredBahans,
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
      pageTitle="Inventory Bahan & Komponen Laboratorium"
      pageDescription="Sistem ketersediaan bahan habis pakai dan komponen laboratorium telekomunikasi."
    >
      <div className="w-full py-2 space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-mono">
        
        {/* 🌟 KONTAINER UTAMA (Grid Statistik & Grup Tombol Aksi) */}
        <div className="w-full flex flex-col lg:flex-row gap-4 items-stretch justify-between">
          
          {/* BAGIAN KIRI: Grid Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">Total Katalog Bahan</span>
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-50">{stats.total} Jenis</span>
              </div>
              <Layers className="text-zinc-400" size={24} />
            </div>

            <div className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">Total Volume Stok</span>
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-50">{stats.volume} Pcs</span>
              </div>
              <Package className="text-zinc-400" size={24} />
            </div>
          </div>

          {/* 🌟 BAGIAN KANAN: Grup Tombol Sejajar (Export & Tambah) */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            
            {/* TOMBOL EXPORT EXCEL */}
            {canExport && (
              <Button
                variant="brutal"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full sm:w-auto md:w-[200px] border-2 border-zinc-950 dark:border-zinc-800 rounded-none h-full min-h-[92px] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-xs font-black tracking-wider uppercase flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                Export Excel
              </Button>
            )}

            {/* TOMBOL TAMBAH BAHAN */}
            {isStaff && (
              <Button
                variant="brutal"
                onClick={() => {
                  if (!isFormOpen) handleOpenAdd();
                  else setIsFormOpen(false);
                }}
                className="w-full sm:w-auto md:w-[200px] border-2 border-zinc-950 dark:border-zinc-800 rounded-none h-full min-h-[92px] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] text-xs font-black tracking-wider uppercase flex items-center justify-center bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-all duration-200 shrink-0"
              >
                {isFormOpen ? <XCircle size={14} className="mr-2 text-red-500" /> : <PlusCircle size={14} className="mr-2 text-zinc-900 dark:text-white" />}
                {isFormOpen ? "Batal" : "Tambah Bahan"}
              </Button>
            )}

          </div>
        </div>

        {/* Panel Form Tambah/Edit */}
        {isFormOpen && isStaff && (
          <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full text-left">
            <div className="flex items-center gap-4 mb-8 border-b-2 border-zinc-950 dark:border-zinc-800 pb-4">
              <div className="w-12 h-12 bg-zinc-950 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-white flex items-center justify-center rounded-none shrink-0 font-mono font-black">
                {editId ? <Pencil size={18} /> : <PlusCircle size={18} />}
              </div>
              <div>
                <h3 className="text-xl font-mono font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  {editId ? "UPDATE DATA BAHAN" : "REGISTRASI BAHAN BARU"}
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-black uppercase mt-1 tracking-widest">
                  {editId ? "UBAH SPESIFIKASI ATAU JUMLAH STOK BAHAN LAB" : "MASUKKAN PARAMETER BAHAN HABIS PAKAI BARU"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono uppercase text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
                  Nama Bahan / Komponen
                </label>
                <input
                  type="text"
                  required
                  placeholder="CONTOH: RESISTOR 10K OHM"
                  className="p-3 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 outline-none"
                  value={formData.nama_bahan}
                  onChange={(e) => setFormData({ ...formData, nama_bahan: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
                  Lokasi / Ruangan Lab
                </label>
                <select
                  required
                  className="p-3 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 outline-none cursor-pointer"
                  value={formData.letak_id}
                  onChange={(e) => setFormData({ ...formData, letak_id: parseInt(e.target.value) })}
                >
                  <option value="" disabled>-- PILIH RUANGAN --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.nama_letak.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest ml-1">
                  Jumlah Stok (Unit)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="CONTOH: 100"
                  className="p-3 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 outline-none"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value === "" ? "" : parseInt(e.target.value) })}
                />
              </div>

              <button
                type="submit"
                className="mt-3 py-4 border-2 border-zinc-950 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>{editId ? "Perbarui Data Bahan" : "Simpan Ke Database"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Toolbar Filter & Pencarian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar Pencarian Nama */}
          <div className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none flex items-center gap-3">
            <Search size={16} className="text-zinc-400 ml-1" />
            <input
              type="text"
              placeholder="CARI NAMA BAHAN..."
              className="w-full bg-transparent outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 tracking-wider"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          {/* Filter Berdasarkan Ruangan */}
          <div className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none flex items-center">
            <select
              className="w-full bg-transparent outline-none text-xs font-black uppercase text-zinc-900 dark:text-zinc-50 cursor-pointer p-1"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <option value="all">-- SEMUA RUANGAN LAB --</option>
              {uniqueRooms.map((roomName, idx) => (
                <option key={idx} value={roomName}>
                  {roomName.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Data Menggunakan Struktur TanStack Table */}
        <div className="w-full max-w-full block overflow-x-auto border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none bg-white dark:bg-zinc-900">
          <div className="bg-zinc-100 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 p-3 text-[10px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
            Manifest Ketersediaan Bahan & Komponen
          </div>
          <table className="w-full text-xs text-left uppercase">
            <thead className="bg-white dark:bg-zinc-950 border-b-2 border-zinc-950 dark:border-zinc-800 font-black text-[10px] text-zinc-500 tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3.5">
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="p-6 text-center text-zinc-400 font-bold">
                    Memuat data...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-6 text-center text-zinc-400 font-bold">
                    Tidak ada data bahan tersedia.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3.5">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bagian Paginasi Bawah */}
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