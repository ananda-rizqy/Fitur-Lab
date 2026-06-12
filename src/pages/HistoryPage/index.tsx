import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

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
  IconX,
  IconLoader2,
  IconPlus,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import api from "../../services/api";
import Swal from "sweetalert2";

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
  const [submitting, setSubmitting] = useState(false);

  const [deviceNames, setDeviceNames] = useState("");
  const [macDevices, setMacDevices] = useState("");
  const [tipeDevice, setTipeDevice] = useState("Anchor");
  const [coordX, setCoordX] = useState("");
  const [coordY, setCoordY] = useState("");
  const [rssi1Input, setRssi1Input] = useState("0");
  const [rssi2Input, setRssi2Input] = useState("0");
  const [rssi3Input, setRssi3Input] = useState("0");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceNames || !macDevices) {
      return Swal.fire(
        "Form Belum Lengkap",
        "Device Name dan MAC Address wajib diisi.",
        "warning",
      );
    }

    setSubmitting(true);
    try {
      const payload = {
        device_names: deviceNames,
        mac_devices: macDevices,
        tipe_device: tipeDevice,
        status: 1,
        x: coordX ? parseFloat(coordX) : 0,
        y: coordY ? parseFloat(coordY) : 0,
        rssi: rssi1Input ? parseInt(rssi1Input) : 0,
        rssi1: rssi1Input ? parseInt(rssi1Input) : 0,
        rssi2: rssi2Input ? parseInt(rssi2Input) : 0,
        rssi3: rssi3Input ? parseInt(rssi3Input) : 0,
      };

      await api.post("/devices", payload);
      Swal.fire("Berhasil", "Perangkat baru berhasil disimpan.", "success");

      setDeviceNames("");
      setMacDevices("");
      setTipeDevice("Anchor");
      setCoordX("");
      setCoordY("");
      setRssi1Input("0");
      setRssi2Input("0");
      setRssi3Input("0");
      setIsOpenForm(false);
      setCurrentPage(1);
      fetchDevices();
    } catch (err: any) {
      Swal.fire("Gagal Validasi", "Gagal menyimpan data perangkat.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo<ColumnDef<Device>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "device_names",
        header: "Device Name",
        cell: ({ getValue }) => (
          <span className="font-sans font-black text-zinc-900 dark:text-zinc-100  tracking-tight">
            {String(getValue())}
          </span>
        ),
      },
      {
        accessorKey: "mac_devices",
        header: "MAC Address",
        cell: ({ getValue }) => (
          <span className="font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs rounded-none">
            {String(getValue())}
          </span>
        ),
      },
      { accessorKey: "tipe_device", header: "Type" },
      {
        header: "RSSI (1/2/3)",
        cell: ({ row }) => {
          const r1 = row.original.rssi1 ?? "-";
          const r2 = row.original.rssi2 ?? "-";
          const r3 = row.original.rssi3 ?? "-";
          return (
            <span className="font-mono text-zinc-500 dark:text-zinc-400">
              {r1} / {r2} / {r3}
            </span>
          );
        },
      },
      {
        header: "Position (X/Y)",
        cell: ({ row }) => {
          const posX = row.original.x ?? "0";
          const posY = row.original.y ?? "0";
          return (
            <span className="font-mono font-black text-zinc-800 dark:text-zinc-200">
              {posX + " , " + posY}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const val = getValue();
          const isActive =
            val === true ||
            val === 1 ||
            String(val).toLowerCase() === "online" ||
            String(val).toLowerCase() === "active";
          return (
            <span
              className={`font-mono font-black  text-xs px-2.5 py-1 rounded-none border-2 ${
                isActive
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 border-zinc-950 dark:border-zinc-800"
                  : "bg-white dark:bg-zinc-900 text-amber-600 border-zinc-950 dark:border-zinc-800"
              }`}
            >
              {isActive ? "Online" : "Offline"}
            </span>
          );
        },
      },
      {
        accessorKey: "updated_at",
        header: "Last Update",
        cell: ({ getValue }) => {
          const rawDate = getValue() as string;
          if (!rawDate)
            return <span className="text-zinc-400 dark:text-zinc-600">-</span>;
          const date = new Date(rawDate);
          return (
            <span className="font-mono text-zinc-400 dark:text-zinc-500 text-[11px]">
              {date.toLocaleDateString("id-ID")}{" "}
              {date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: devices,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
  });

  const totalPages = Math.ceil(devices.length / itemsPerPage) || 1;

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
      <div className="py-6 w-full space-y-6 antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-left transition-colors duration-300">
        <Card
          variant="brutal"
          animate={false}
          className="w-full overflow-hidden rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none p-0"
        >
          <CardHeader className="flex flex-row items-center justify-between border-b-2 border-zinc-200 dark:border-zinc-800 pb-4 p-6">
            <CardTitle className="font-mono font-black text-base  tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <IconDeviceDesktop size={16} className="text-zinc-400" />
              Registered Nodes
            </CardTitle>

            <div className="flex gap-2 ">
              <Button variant="brutal" onClick={() => setIsOpenForm(true)}>
                <IconPlus size={14} className="mr-2" />
                <span>Add Device</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="brutal">Rows: {itemsPerPage}</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none p-2"
                >
                  <div className="px-3 py-2 text-[10px] text-zinc-400 border-b border-zinc-200 dark:border-zinc-800  tracking-widest font-bold">
                    Limit Baris Tabel
                  </div>
                  {[5, 10, 15].map((size) => (
                    <DropdownMenuItem
                      key={size}
                      disabled={size !== itemsPerPage}
                      className="cursor-not-allowed rounded-none py-2 px-4 focus:bg-zinc-100 dark:focus:bg-zinc-900 font-black text-zinc-400"
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
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                <IconLoader2 className="animate-spin h-7 w-7 text-zinc-950 dark:text-zinc-50" />
                <p className="text-xs text-zinc-400 font-mono font-black  tracking-widest">
                  Memuat database perangkat
                </p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-950/60 border-b-2 border-zinc-950 dark:border-zinc-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="hover:bg-transparent"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="font-mono font-black text-zinc-800 dark:text-zinc-200  tracking-wider py-4 text-xs cursor-pointer select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                            {{ asc: " 🔼", desc: " 🔽" }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="py-3.5 px-4 font-medium text-zinc-900 dark:text-zinc-300"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="text-center py-16 text-zinc-400 font-mono font-black  tracking-wider"
                        >
                          Tidak ada perangkat terdaftar di server.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4">
            <span className="text-xs text-zinc-400 font-mono font-black  tracking-wider">
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
