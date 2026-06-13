import type { ColumnDef } from "@tanstack/react-table";
import { MapPin, Tag, Pencil, Trash2 } from "lucide-react";

export const getColumns = (
  isStaff: boolean,
  onEdit: (data: any) => void,
  onDelete: (id: number) => void,
): ColumnDef<any>[] => [ 
  {
    header: "NO",
    cell: (info) => (
      <div className="w-7 h-7 rounded-none border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono font-black text-zinc-900 dark:text-zinc-200 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none mx-auto">
        {info.row.index + 1}
      </div>
    ),
  },
  {
    header: "NAMA ALAT",
    accessorKey: "nama_alat",
    cell: ({ row }) => (
      <div className="flex flex-col font-mono text-left">
        <span className="font-black text-xs uppercase text-zinc-900 dark:text-zinc-100 tracking-tight">
          {row.original.nama_alat}
        </span>
        <div className="flex items-center gap-1 text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase font-black tracking-widest">
          <MapPin size={10} className="text-zinc-400 shrink-0" /> {row.original.letak}
        </div>
      </div>
    ),
  },
  {
    header: "KODE TAG",
    accessorKey: "kode_tag_list",
    cell: ({ row }) => {
      const displayTag = row.original.kode_tag_list;

      return displayTag && displayTag.toString().trim() !== "" ? (
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none max-w-[200px]">
          <Tag size={11} className="text-zinc-900 dark:text-zinc-400 shrink-0" />
          <code className="text-[10px] font-mono font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-tighter truncate">
            {displayTag}
          </code>
        </div>
      ) : (
        <span className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest italic ml-1"> 
          X KONSUMSI 
        </span>
      );
    },
  },
  {
    header: "STOK",
    accessorKey: "jumlah",
    cell: ({ row }) => {
      const vol = row.original.jumlah;
      
      return (
        <div className="inline-flex items-center justify-center px-3 py-1.5 font-mono font-black text-[10px] uppercase rounded-none border-2 border-zinc-950 bg-white text-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
          {vol} UNIT
        </div>
      );
    },
  },
  {
    header: "KONDISI",
    accessorKey: "kondisi",
    cell: ({ row }) => {
      const k = (row.original.kondisi || "").toString().toLowerCase().trim();
      const isAset = !!row.original.kode_tag_list;
      
      if (!isAset) {
        return (
          <div className="inline-flex items-center justify-center px-3 py-1.5 font-mono font-black text-[10px] uppercase rounded-none border-2 border-zinc-950 tracking-wider bg-white text-emerald-600 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            ✓ BAIK
          </div>
        );
      }

      const isBaik = k === "baik" || k === "";
      return (
        <div className={`inline-flex items-center justify-center px-3 py-1.5 font-mono font-black text-[10px] uppercase rounded-none border-2 border-zinc-950 tracking-wider shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] bg-white ${
          isBaik 
            ? "text-emerald-600" 
            : "text-red-600"
        }`}>
          {isBaik ? "✓ BAIK" : "X RUSAK"}
        </div>
      );
    },
  },
  ...(isStaff
    ? [
        {
          header: "AKSI",
          id: "actions",
          cell: ({ row }: any) => (
            <div className="flex gap-2 justify-center items-center">
              {/* TOMBOL EDIT */}
              <button
                type="button"
                onClick={() => onEdit(row.original)} 
                className="h-8 w-8 text-zinc-900 bg-white hover:bg-zinc-100 border-2 border-zinc-950 flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0 group"
                title="Edit Parameter Alat"
              >
                <Pencil size={13} className="stroke-[3px] group-hover:text-blue-600 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(row.original.id)}
                className="h-8 w-8 text-zinc-900 bg-white hover:bg-zinc-50 border-2 border-zinc-950 flex items-center justify-center rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0 group"
                title="Hapus Alat"
              >
                <Trash2 size={13} className="stroke-[3px] group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          ),
        },
      ]
    : []),
];