import { type ColumnDef } from "@tanstack/react-table";
import api from "../../services/api"; // Pastikan path import instance api axios Anda benar

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

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "device_names",
    header: "Device Name",
    cell: ({ getValue }) => (
      <span className="font-sans font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "mac_devices",
    header: "MAC Address",
    cell: ({ getValue }) => (
      <span className="font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 text-xs rounded-none font-bold text-zinc-800 dark:text-zinc-200">
        {String(getValue())}
      </span>
    ),
  },
  {
    accessorKey: "tipe_device",
    header: "Type",
  },
  {
    header: "RSSI (1/2/3/4)",
    cell: ({ row }) => {
      const r1 = row.original.rssi ?? "-";
      const r2 = row.original.rssi2 ?? "-";
      const r3 = row.original.rssi3 ?? "-";
      const r4 = row.original.rssi4 ?? "-";
      return (
        <span className="font-mono text-zinc-500 dark:text-zinc-400">
          {r1} / {r2} / {r3} / {r4}
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
          {posX} , {posY}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const val = row.original.status;
      const rawDate = row.original.updated_at;

      const isStatusActive =
        val === true ||
        val === 1 ||
        val === "1" ||
        String(val).toLowerCase().trim() === "online" ||
        String(val).toLowerCase().trim() === "active";

      let isTimedOut = false;

      if (rawDate && String(rawDate).trim() !== "-") {
        const lastUpdateTime = new Date(rawDate).getTime();
        const currentTime = new Date().getTime();

        const durationInMilliseconds = currentTime - lastUpdateTime;
        const durationInMinutes = durationInMilliseconds / (1000 * 60);

        if (durationInMinutes > 5) {
          isTimedOut = true;
        }
      } else {
        isTimedOut = true;
      }

      const isActive = isStatusActive && !isTimedOut;

      return (
        <span
          className={`font-mono font-black text-[11px] px-2.5 py-0.5 rounded-none border-2 uppercase tracking-wide inline-block ${
            isActive
              ? "bg-white dark:bg-zinc-900 text-emerald-600 border-zinc-950 dark:border-emerald-800"
              : "bg-white dark:bg-zinc-900 text-amber-600 border-zinc-950 dark:border-amber-800"
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
  // 💡 KOLOM AKSI EDIT DAN HAPUS REAL BERKONEKSI KE METATABLE REACT
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const device = row.original;
      const meta = table.options.meta as any;

      const handleDelete = async () => {
        const confirmDelete = window.confirm(
          `Apakah Anda yakin ingin menghapus perangkat "${device.device_names}" beserta alamat MAC ${device.mac_devices} dari sistem?`,
        );
        if (!confirmDelete) return;

        try {
          // Panggil API endpoint DELETE /api/devices/{id} ke Laravel Controller Anda
          await api.delete(`/devices/${device.id}`);
          alert("Perangkat berhasil dihapus dari sistem.");
          if (meta && meta.refreshData) {
            meta.refreshData(); // Memicu penarikan data ulang otomatis di DevicePage
          }
        } catch (err) {
          console.error("Gagal menghapus device:", err);
          alert("Terjadi kesalahan saat menghapus data.");
        }
      };

      return (
        <div className="flex gap-2 font-mono">
          <button
            onClick={() => {
              if (meta && meta.openEditModal) {
                meta.openEditModal(device);
              }
            }}
            className="px-2 py-1 text-[11px] border-2 border-zinc-950 dark:border-zinc-700 font-bold bg-white dark:bg-zinc-900 text-blue-600 hover:bg-zinc-50 uppercase tracking-tight"
          >
            EDIT
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-[11px] border-2 border-zinc-950 dark:border-zinc-700 font-bold bg-white dark:bg-zinc-900 text-red-600 hover:bg-zinc-50 uppercase tracking-tight"
          >
            DEL
          </button>
        </div>
      );
    },
  },
];
