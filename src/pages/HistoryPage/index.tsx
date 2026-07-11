import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PageLayout } from "../../layouts/PageLayout";
import { LoanPagination } from "../../components/organism/LoanPagination";
import { AddDeviceModal } from "../../components/molecules/AddDeviceModal";

import {
  IconLoader2,
  IconDeviceDesktop,
  IconTrash,
  IconSearch,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import api from "../../services/api";
import { columns } from "./columns";
import { DeviceTable } from "../../components/organism/DeviceTable";
import { EditDeviceModal } from "@/components/molecules/EditDeviceModal";

interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  rssi1?: number | string;
  rssi2?: number | string;
  rssi3?: number | string;
  rssi4?: number | string;
  tipe_device: string;
  status: boolean | number | string;
  x?: number | string;
  y?: number | string;
  created_at?: string;
  updated_at?: string;
}

export function HistoryPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenForm, setIsOpenForm] = useState(false);

  // Pagination Server State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Default samakan dengan backend / selera

  // State Fitur Filter Riwayat
  const [searchName, setSearchName] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [selectedDeviceForEdit, setSelectedDeviceForEdit] =
    useState<Device | null>(null);

  // Amankan indikator loading utama
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get("/device-histories", {
        params: {
          device_name: searchName || undefined,
          date: filterDate || undefined,
          start_time: startTime || undefined,
          end_time: endTime || undefined,
          page: currentPage, // Kirim halaman aktif ke Laravel
        },
      });

      // Bongkar data dari pembungkus pagination milik Laravel
      const cleanArray = response.data?.data || [];
      setDevices(Array.isArray(cleanArray) ? cleanArray : []);

      // Ambil total halaman dari meta data pagination Laravel
      const metaTotalPages = response.data?.meta?.last_page || 1;
      setTotalPages(metaTotalPages);
    } catch (err: any) {
      console.error("Gagal menarik data alat:", err);
      setError("Gagal memuat log riwayat dari server.");
      setDevices([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [searchName, filterDate, startTime, endTime, currentPage]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "APAKAH ANDA YAKIN? Tindakan ini akan menghapus SELURUH data riwayat di database permanen!",
    );
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      await api.delete("/device-histories/clear-all");
      alert("Seluruh data riwayat berhasil dibersihkan.");
      setCurrentPage(1);
      fetchDevices();
    } catch (err) {
      console.error("Gagal menghapus semua data:", err);
      alert("Gagal membersihkan database riwayat.");
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 2. PETA DATA TANSTACK: Langsung gunakan 'devices' dari server tanpa filter JS ganda
  const table = useReactTable({
    columns,
    data: devices,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <PageLayout
      pageTitle="History"
      pageDescription="Sistem manajemen monitoring data log riwayat penangkapan node BLE RSSI."
    >
      <EditDeviceModal
        isOpen={isOpenEditForm}
        onClose={() => {
          setIsOpenEditForm(false);
          setSelectedDeviceForEdit(null);
        }}
        onSuccess={fetchDevices}
        deviceData={selectedDeviceForEdit}
      />
      <AddDeviceModal
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        onSuccess={fetchDevices}
      />

      <div className="py-6 w-full space-y-6 antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-left transition-colors duration-300">
        {/* PANEL FILTER BAR NEOBRUTALISM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 font-mono">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase flex items-center gap-1">
              <IconSearch size={14} /> Device Name
            </label>
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1); // Reset ke halaman 1 saat mengetik
              }}
              className="h-10 px-3 text-xs bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 outline-none focus:bg-zinc-100 dark:focus:bg-zinc-800 font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase flex items-center gap-1">
              <IconCalendar size={14} /> Filter Tanggal
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 text-xs bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 outline-none font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-black uppercase flex items-center gap-1">
              <IconClock size={14} /> Rentang Waktu (Jam Kerja / Log)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full px-3 text-xs bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 outline-none font-bold"
              />
              <span className="font-black text-xs">S/D</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full px-3 text-xs bg-white dark:bg-zinc-900 rounded-none border-2 border-zinc-950 dark:border-zinc-700 outline-none font-bold"
              />
              {(searchName || filterDate || startTime || endTime) && (
                <Button
                  onClick={() => {
                    setSearchName("");
                    setFilterDate("");
                    setStartTime("");
                    setEndTime("");
                    setCurrentPage(1);
                  }}
                  className="h-10 rounded-none border-2 border-zinc-300 dark:border-zinc-700 text-xs font-black uppercase px-3"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* UTILITY TABLE CARD */}
        <Card
          animate={false}
          className="w-full overflow-hidden rounded-none p-0"
        >
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-800 pb-4 p-6 gap-4">
            <CardTitle className="font-mono font-black text-base tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <IconDeviceDesktop
                size={16}
                className="text-zinc-900 dark:text-white"
              />
              REGISTERED NODES LOGS ({devices.length})
            </CardTitle>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={devices.length === 0}
                className="font-mono font-black text-xs uppercase rounded-none border-2 border-zinc-950 px-4 h-11 bg-red-600 text-white hover:bg-red-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <IconTrash size={14} className="mr-2" />
                <span>Wipe All Logs</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* 💡 3. FIX SAKELAR LOADING: Gunakan state isLoading yang dikontrol fetchDevices */}
            {isLoading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border-none">
                <IconLoader2 className="animate-spin h-7 w-7 text-zinc-950 dark:text-zinc-50" />
                <p className="text-xs text-zinc-400 font-mono font-black tracking-widest uppercase">
                  Memuat database perangkat...
                </p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-xs font-mono font-bold text-red-500">
                {error}
              </div>
            ) : (
              /* Kirim instansiasi table yang benar ke DeviceTable */
              <DeviceTable table={table} columns={columns} />
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4">
            <span className="text-xs text-zinc-400 font-mono font-black tracking-wider uppercase">
              Page {currentPage} of {totalPages}
            </span>

            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <LoanPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}