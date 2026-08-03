import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MapPin, Tag, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";

export const getColumns = (
  isStaff: boolean,
  onEdit: (data: any) => void,
  onDelete: (id: number) => void,
  onPreviewImage: (url: string) => void // 🌟 Tambahkan parameter untuk handle preview gambar
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
    header: "NAMA ALAT & FOTO",
    accessorKey: "nama_alat",
    cell: ({ row }) => {
      const letak = row.original.letak?.nama_letak || "LOKASI TIDAK DITETAPKAN";
      const gedung = row.original.letak?.gedung?.nama_gedung || "";
      const displayLokasi = gedung ? `${gedung} - ${letak}` : letak;
      const fotoUrl = row.original.foto_url;

      return (
        <div className="flex items-center gap-3 font-mono text-left min-w-[250px]">
          <div className="w-12 h-12 shrink-0 border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            {fotoUrl ? (
              <img 
                src={fotoUrl} 
                alt={row.original.nama_alat} 
                // 🌟 Tambahkan cursor-pointer dan event onClick
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                onClick={() => onPreviewImage(fotoUrl)} 
              />
            ) : (
              <ImageIcon size={16} className="text-zinc-400 dark:text-zinc-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase text-zinc-900 dark:text-zinc-100 tracking-tight">
              {row.original.nama_alat}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-zinc-400 dark:text-zinc-500 mt-1.5 uppercase font-black tracking-widest">
              <MapPin size={10} className="text-zinc-400 shrink-0" /> {displayLokasi}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "SPESIFIKASI",
    accessorKey: "spesifikasi",
    cell: ({ row }) => {
      const spec = row.original.spesifikasi;
      
      if (!spec) {
        return (
          <span className="text-[10px] font-mono font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest italic">
            -
          </span>
        );
      }

      return (
        <div className="max-w-[180px] font-mono text-left">
          {/* 🌟 Teks dibatasi maksimal 2 baris agar tetap rapi & compact */}
          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 line-clamp-2 uppercase tracking-tight">
            {spec}
          </p>
          {/* 🌟 Tombol untuk melihat teks selengkapnya via pop-up modal */}
          {spec.length > 35 && (
            <button
              onClick={() => {
                Swal.fire({
                  title: `SPESIFIKASI: ${row.original.nama_alat}`,
                  html: `<div style="text-align: left; font-family: monospace; font-size: 12px; background: #f4f4f5; padding: 12px; border: 2px solid black; max-height: 300px; overflow-y: auto; text-transform: uppercase;">${spec}</div>`,
                  confirmButtonText: "Tutup",
                  confirmButtonColor: "#000000",
                  customClass: {
                    popup: "rounded-none border-4 border-zinc-950 font-mono shadow-[8px_8px_0px_0px_rgba(9,9,11,1)]",
                    title: "font-black text-xs uppercase text-zinc-900",
                    confirmButton: "rounded-none font-mono font-black text-xs uppercase border-2 border-zinc-950 bg-black text-white px-5 py-2"
                  },
                  buttonsStyling: false
                });
              }}
              className="mt-1 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 border border-blue-200 dark:border-blue-800 transition-colors"
            >
              Lihat Detail
            </button>
          )}
        </div>
      );
    },
  },
  {
    header: "KODE TAG",
    accessorKey: "kode_tag",
    cell: ({ row }) => {
      const isAsset = row.original.is_asset === 1 || row.original.is_asset === true;
      const displayTag = row.original.kode_tag;

      return isAsset && displayTag ? (
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none max-w-[150px]">
          <Tag size={11} className="text-zinc-900 dark:text-zinc-400 shrink-0" />
          <code className="text-[10px] font-mono font-black text-zinc-900 dark:text-zinc-300 uppercase tracking-tighter truncate">
            {displayTag}
          </code>
        </div>
      ) : (
        <span className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest italic ml-1">
          X NON ASET
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
      const isAsset = row.original.is_asset === 1 || row.original.is_asset === true;
      
      if (!isAsset) {
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
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(row.original)}
                className="p-1.5 border-2 border-zinc-950 bg-amber-300 hover:bg-amber-400 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
                title="Edit Parameter Alat"
              >
                <Edit size={14} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(row.original.id)}
                className="p-1.5 border-2 border-zinc-950 bg-rose-500 hover:bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
                title="Hapus Alat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ),
        },
      ]
    : []),
];