import api from "@/services/api";
import { type ColumnDef } from "@tanstack/react-table";

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
    header: "RSSI (1/2/3)",
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
];
