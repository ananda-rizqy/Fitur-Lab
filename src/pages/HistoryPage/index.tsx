import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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
  IconPlus,
  IconDeviceDesktop,
  IconFilter,
} from "@tabler/icons-react";
import api from "../../services/api";
import { columns } from "./columns";
import { DeviceTable } from "../../components/organism/DeviceTable";

interface Device {
  id: number;
  device_names: string;
  mac_devices: string;
  rssi1?: number | string;
  rssi2?: number | string;
  rssi3?: number | string;
  tipe_device: string;
  status: boolean | number | string;
  x?: number | string;
  y?: number | string;
  created_at?: string;
  updated_at?: string;
}

export function HistoryPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "offline"
  >("all");

  const fetchDevices = async () => {
    setApiLoading(true);
    try {
      const response = await api.get("/devices");
      const rawData = response.data?.data || response.data || [];
      setDevices(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Gagal menarik data alat:", err);
    } finally {
      setApiLoading(false);
    }
  };

  const filteredDevices = useMemo(() => {
    if (statusFilter === "all") return devices;

    return devices.filter((device) => {
      const val = device.status;
      const rawDate = device.updated_at;

      // 1. Logika penentuan dasar Online
      const isStatusActive =
        val === true ||
        val === 1 ||
        val === "1" ||
        String(val).toLowerCase().trim() === "online" ||
        String(val).toLowerCase().trim() === "active";

      // 2. 💡 Logika Batas Waktu Baru (Jeda Maksimal 5 Menit & Proteksi Data Kosong)
      let isTimedOut = false;

      if (rawDate && String(rawDate).trim() !== "-") {
        const lastUpdateTime = new Date(rawDate).getTime();
        const currentTime = new Date().getTime();
        const durationInMinutes = (currentTime - lastUpdateTime) / (1000 * 60);

        // Jika lebih dari 5 menit, dianggap Timed Out
        if (durationInMinutes > 5) {
          isTimedOut = true;
        }
      } else {
        // Jika tidak ada data waktu (null/undefined/"-"), otomatis dianggap Timed Out (Offline)
        isTimedOut = true;
      }

      // 3. Status akhir perangkat saat ini
      const isDeviceOnline = isStatusActive && !isTimedOut;

      return statusFilter === "online" ? isDeviceOnline : !isDeviceOnline;
    });
  }, [devices, statusFilter]);

  useEffect(() => {
    fetchDevices();
  }, []);

  // Konfigurasi Instansiasi TanStack Table Terpusat
  const table = useReactTable({
    columns,
    data: filteredDevices,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater: any) => {
      const nextState =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize })
          : updater;
      setPageSize(nextState.pageSize);
      setCurrentPage(nextState.pageIndex + 1);
    },
  });

  const totalPages = Math.ceil(devices.length / pageSize) || 1;

  return (
    <PageLayout
      pageTitle="History"
      pageDescription="Sistem manajemen pendaftaran perangkat Anchor Fixed dan Tracker Beacon BLE."
    >
      <AddDeviceModal
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        onSuccess={fetchDevices}
      />
      <div className="py-6 w-full space-y-6 antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-left transition-colors duration-300">
        <Card
          animate={false}
          className="w-full overflow-hidden rounded-none  p-0"
        >
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-800 pb-4 p-6 gap-4">
            <CardTitle className="font-mono font-black text-base tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <IconDeviceDesktop
                size={16}
                className="text-zinc-900 dark:text-white"
              />
              REGISTERED NODES
            </CardTitle>

            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="brutal"
                    className="font-mono font-black text-xs uppercase rounded-none h-11"
                  >
                    <IconFilter size={14} className="mr-2" />
                    Status: {statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white font-mono font-black text-xs rounded-none p-2"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`cursor-pointer rounded-none py-2 px-4 ${statusFilter === "all" ? "bg-zinc-100" : ""}`}
                  >
                    Semua Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("online");
                      setCurrentPage(1);
                    }}
                    className={`cursor-pointer rounded-none py-2 px-4 text-emerald-600 ${statusFilter === "online" ? "bg-emerald-50" : ""}`}
                  >
                    Online
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("offline");
                      setCurrentPage(1);
                    }}
                    className={`cursor-pointer rounded-none py-2 px-4 text-amber-600 ${statusFilter === "offline" ? "bg-amber-50" : ""}`}
                  >
                    Offline
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="brutal"
                onClick={() => setIsOpenForm(true)}
                className="font-mono font-black text-xs uppercase rounded-none border-2 border-zinc-950 px-4 h-11"
              >
                <IconPlus size={14} className="mr-2" />
                <span>Add Device</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="brutal"
                    className="font-mono font-black text-xs uppercase rounded-none border-2 border-zinc-950 px-4 h-11"
                  >
                    Rows: {pageSize}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none p-2"
                >
                  <div className="px-3 py-2 text-[10px] text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 tracking-widest font-bold uppercase">
                    Limit Baris Tabel
                  </div>
                  {[5, 10, 15].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer rounded-none py-2 px-4 focus:bg-zinc-100 dark:focus:bg-zinc-900 font-black text-zinc-800 dark:text-zinc-200"
                    >
                      Tampilkan {size} Baris
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {apiLoading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border-none">
                <IconLoader2 className="animate-spin h-7 w-7 text-zinc-950 dark:text-zinc-50" />
                <p className="text-xs text-zinc-400 font-mono font-black tracking-widest uppercase">
                  Memuat database perangkat
                </p>
              </div>
            ) : (
              <DeviceTable table={table} />
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