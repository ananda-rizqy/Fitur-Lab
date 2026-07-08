import type { ColumnDef } from "@tanstack/react-table";
import type { Device } from "../../types/Device";
import { StatusBadge } from "../../components/atoms/StatusBadge";
import { TypeLabel } from "../../components/atoms/TypeLabel";

export const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: "device_names",
    header: "Device Name",
  },
  {
    accessorKey: "mac_devices",
    header: "MAC Address",
  },
  {
    accessorKey: "rssi1",
    header: "RSSI-1",
  },
  {
    accessorKey: "rssi2",
    header: "RSSI-2",
  },
  {
    accessorKey: "rssi3",
    header: "RSSI-3",
  },
  {
    accessorKey: "rssi4",
    header: "RSSI-4",
  },
  {
    accessorKey: "tipe_device",
    header: "Type",
    cell: ({ getValue }) => <TypeLabel type={getValue<boolean>()} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue<boolean>() ? "Aktif" : "Nonaktif"} />
  },
  {
    accessorKey: "x",
    header: "X",
  },
  {
    accessorKey: "y",
    header: "Y",
  },
  {
    accessorKey: "updated_at",
    header: "Time",
    cell: ({ getValue }: any) => {
      const ts = getValue();
      if (!ts) return "-";

      // Mengonversi timestamp ke objek Date
      const date = new Date(ts);

      // Format: DD/MM/YYYY, HH:mm:ss
      return date.toLocaleString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
];
