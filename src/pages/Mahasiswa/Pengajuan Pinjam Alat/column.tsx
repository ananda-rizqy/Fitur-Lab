import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, QrCode } from "lucide-react"; 
import { type Alat } from "../../../types/Loan";

export const getColumns = (
  cart: any[],
  addToCart: (alat: Alat) => void
): ColumnDef<Alat>[] => [
  {
    header: "Nama Alat",
    cell: ({ row }) => {
      const isAset = row.original.is_aset === true || row.original.is_aset === "1";
      
      const singleTag = row.original.kode_tag_list || []

      return (
        <div className="py-2 text-left font-mono">
          {/* NAMA UTAMA ALAT */}
          <div className="font-sans font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight uppercase">
            {row.original.nama_alat}
          </div>
          
          {/* LOKASI RUANGAN */}
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider mt-0.5 uppercase">
            Ruangan: {row.original.letak}
          </div>

          {isAset && (
            <div className="mt-2 space-y-1">
              <span className="block text-[8.5px] font-black text-zinc-400 tracking-wider uppercase">
                Kode Identifikasi Unit:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {singleTag ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 border-2 border-zinc-950 bg-zinc-100 text-zinc-950 text-[9px] font-black tracking-tight uppercase rounded-none shadow-[2px_2px_0px_0px_rgba(165,180,252,1)]"
                  >
                    <QrCode size={10} className="stroke-[3px]" />
                    {singleTag}
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-amber-600 italic tracking-wide lowercase">
                    belum registrasi kode unik unit lab
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Stok",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="font-mono font-black text-[10px] bg-zinc-50 text-zinc-800 border-zinc-950 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none uppercase"
      >
        {row.original.jumlah} Unit
      </Badge>
    ),
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const isAdded = cart.some((i) => i.id === row.original.id);
      return (
        <Button
          size="sm"
          disabled={row.original.jumlah <= 0}
          variant={isAdded ? "outline" : "brutal"}
          onClick={() => addToCart(row.original)}
          className="rounded-none font-mono font-black text-xs uppercase tracking-wide"
        >
          {isAdded ? (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>Masuk Keranjang</span>
            </div>
          ) : (
            "Pinjam"
          )}
        </Button>
      );
    },
  },
]; 