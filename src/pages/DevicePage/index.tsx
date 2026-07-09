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
  rssi?: number | string;
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

export function DevicePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // 💡 1. Tambahkan State Baru untuk Filter Status
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
      console.error(err);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // 💡 2. Filter Data Berdasarkan Logika Waktu & Atribut Status (Sama seperti kolom status kamu)
  const filteredDevices = useMemo(() => {
    if (statusFilter === "all") return devices;

    return devices.filter((device) => {
      const val = device.status;
      const rawDate = device.updated_at;

      // Logika penentuan dasar Online
      const isStatusActive =
        val === true ||
        val === 1 ||
        val === "1" ||
        String(val).toLowerCase().trim() === "online" ||
        String(val).toLowerCase().trim() === "active";

      // Logika timeout 2 jam (sesuai kolom status sebelumnya)
      let isTimedOut = false;
      if (rawDate) {
        const lastUpdateTime = new Date(rawDate).getTime();
        const currentTime = new Date().getTime();
        const durationInHours =
          (currentTime - lastUpdateTime) / (1000 * 60 * 60);
        if (durationInHours > 2) {
          isTimedOut = true;
        }
      }

      const isDeviceOnline = isStatusActive && !isTimedOut;

      return statusFilter === "online" ? isDeviceOnline : !isDeviceOnline;
    });
  }, [devices, statusFilter]);

  const table = useReactTable({
    columns,
    data: filteredDevices, // 💡 3. Gunakan data yang sudah difilter
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      pagination: { pageIndex: currentPage - 1, pageSize },
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

  const totalPages = Math.ceil(filteredDevices.length / pageSize) || 1;

  return (
    <PageLayout
      pageTitle="Devices List"
      pageDescription="Sistem manajemen pendaftaran perangkat Anchor Fixed dan Tracker Beacon BLE."
    >
      <AddDeviceModal
        isOpen={isOpenForm}
        onClose={() => setIsOpenForm(false)}
        onSuccess={fetchDevices}
      />
      <div className="py-6 w-full space-y-6 antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-left">
        <Card
          animate={false}
          className="w-full border-0 shadow-none overflow-hidden rounded-none p-0"
        >
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 p-6 gap-4">
            <CardTitle className="font-mono font-black text-base tracking-wider flex items-center gap-2">
              <IconDeviceDesktop size={16} /> REGISTERED NODES
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              {/* 💡 4. TOMBOL FILTER STATUS BARU */}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="brutal"
                    className="font-mono font-black text-xs uppercase rounded-none h-11"
                  >
                    Rows: {pageSize}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white font-mono font-black text-xs rounded-none p-2"
                >
                  {[5, 10, 15].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className="cursor-pointer rounded-none py-2 px-4 font-black"
                    >
                      Tampilkan {size} Baris
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="brutal"
                onClick={() => setIsOpenForm(true)}
                className="font-mono font-black text-xs uppercase rounded-none h-11"
              >
                <IconPlus size={14} className="mr-2" /> Add Device
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {apiLoading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                <IconLoader2 className="animate-spin h-7 w-7" />
                <p className="text-xs text-zinc-400 font-mono font-black tracking-widest uppercase">
                  Memuat database perangkat
                </p>
              </div>
            ) : (
              <DeviceTable table={table} />
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 px-6 py-4">
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