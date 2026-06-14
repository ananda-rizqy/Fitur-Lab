import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowUpDown, MessageSquare, ImageIcon, MapPin} from "lucide-react";
 
export const getColumns = (
  setSelectedImg: (url: string) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-[10px] font-bold uppercase">
        ID <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-black">#{row.getValue("id")}</span>,
  },
  {
    accessorKey: "details",
    header: "Informasi Alat & Ruangan",
    cell: ({ row }) => {
      const details = row.original.details || [];
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {details.map((d: any, i: number) => (
              <div key={i} className="border-2 border-zinc-900 px-2 py-1 shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] bg-white">
                <p className="text-[10px] font-black uppercase">{d.alat?.nama_alat}</p>
                <p className="text-[9px] font-mono font-bold text-zinc-500">{d.alat?.kode_tag}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono border-2 border-zinc-900 p-1.5 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <MessageSquare size={10} className="shrink-0" />
            <span>{row.original.tujuan_penggunaan}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono border-2 border-zinc-900 p-1.5 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            <MapPin size={10} className="shrink-0" />
            <span>{row.original.ruangan_lab || "Tidak Ditentukan"}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const renderImg = (src: string | null) => src ? (
        <img 
          src={src} 
          className="h-14 w-14 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => setSelectedImg(src)} 
        />
      ) : (
        <div className="h-14 w-14 border-2 border-dashed border-zinc-400 flex items-center justify-center bg-zinc-50">
          <ImageIcon size={20} className="text-zinc-400" />
        </div>
      );
      return <div className="flex gap-2">{renderImg(row.original.foto_before)}{renderImg(row.original.foto_after)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const kondisi = row.original.kondisi_kembali;
      const badgeClass = "rounded-none border-2 border-zinc-900 font-black text-[9px] uppercase shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] px-2 py-1";
      
      return (
        <div className="flex flex-col gap-2 items-start">
          <Badge className={`${badgeClass} ${status === "returned" ? "text-zinc-900" : "bg--300 text-zinc-900"}`}>
            {status}
          </Badge>
          {kondisi && (
            <Badge className={`${badgeClass} ${kondisi === "rusak" ? "text-white" : "bg--500 text-zinc"}`}>
              {kondisi === "rusak" ? "✗ Unit Rusak" : "✓ Unit Baik"}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "approved",
    header: "Approved By",
    cell: ({ row }) => <span className="text-xs font-bold font-mono">{row.original.penerima?.name || "By Sistem"}</span>,
  },
  {
    accessorKey: "waktu",
    header: "Timeline",
    cell: ({ row }) => {
      const format = (d: string | null) => {
        if (!d) return "-";
        const date = new Date(d);
        return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) + 
               ", " + date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
      };
      const cardStyle = "border-2 border-zinc-900 p-2 text-[10px] font-mono shadow-[3px_3px_0px_0px_rgba(9,9,11,1)]";
      return (
        <div className="flex flex-col gap-2 min-w-[140px]">
          <div className={`${cardStyle} bg-emerald-50`}>IN: {format(row.original.created_at)}</div>
          <div className={`${cardStyle} ${row.original.waktu_kembali ? "bg-slate-50" : "bg-amber-50"}`}>
            OUT: {format(row.original.waktu_kembali)}
          </div>
        </div>
      );
    },
  },
];