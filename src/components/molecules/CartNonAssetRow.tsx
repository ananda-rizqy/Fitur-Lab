import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Swal from "sweetalert2";

interface CartNonAssetRowProps {
  item: {
    id: number;
    tipe_item?: "alat" | "bahan"; // 👈 Ditambahkan untuk mendeteksi alat atau bahan
    nama_alat?: string;
    nama_bahan?: string;
    letak: any; 
    jumlah: number;
    qty: any;
  };
  onRemove: () => void;
  onUpdateQty: (newQty: any) => void;
}

export function CartNonAssetRow({
  item,
  onRemove,
  onUpdateQty,
}: CartNonAssetRowProps) {
  // 🌟 PENGAMANAN: Ubah letak menjadi string jika bentuknya berupa objek relasi database
  const getLetakText = (letak: any) => {
    if (!letak) return "-";
    if (typeof letak === "string") return letak;
    return letak.nama_letak || letak.nama_ruangan || JSON.stringify(letak);
  };

  const displayName = item.nama_bahan || item.nama_alat || "Item";
  const isBahan = item.tipe_item === "bahan"; // 👈 Cek apakah item berupa bahan

  return (
    <div className="border-2 border-zinc-950 dark:border-zinc-800 px-6 py-6 transition-colors bg-zinc-50 dark:bg-zinc-950/40 gap-4 flex flex-col select-none rounded-none font-mono text-left shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
      <div className="flex justify-between items-center text-left flex-1">
        <div className="overflow-hidden flex flex-col pr-2">
          <span className="font-sans font-black text-xs text-zinc-900 dark:text-zinc-100 truncate block uppercase">
            {displayName}
          </span>
          <span className="text-[10px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest mt-0.5 block uppercase">
            Ruangan : {getLetakText(item.letak)}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            Swal.fire({
              title: "Hapus Item?",
              text: `Yakin ingin mengeluarkan ${displayName} dari berkas peminjaman?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#18181b",
              cancelButtonColor: "#ef4444",
              confirmButtonText: "YA, HAPUS",
              cancelButtonText: "BATAL",
              allowOutsideClick: false,
              allowEscapeKey: false,
              customClass: { container: "z-[99999]" },
              background: document.documentElement.classList.contains("dark") ? "#18181b" : "#ffffff",
              color: document.documentElement.classList.contains("dark") ? "#f4f4f5" : "#09090b",
            }).then((result) => {
              if (result.isConfirmed) onRemove();
            });
          }}
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-transparent rounded-none shrink-0 transition-colors"
        >
          <Trash2 size={14} className="stroke-[2.5px]" />
        </Button>
      </div>

      {/* CONTROLLER AREA */}
      <div className="w-full relative flex items-center text-left gap-3 justify-end text-xs font-black uppercase text-zinc-400 tracking-wider">
        Jumlah Pinjam:
        
        {isBahan ? (
          /* 🌟 Jika BAHAN: Tampilkan kotak input angka yang bisa diatur bebas mulai dari 1 */
          <Input
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            value={item.qty === 0 || item.qty === null || item.qty === undefined ? "" : item.qty}
            onChange={(e) => {
              const rawValue = e.target.value;

              if (rawValue === "") {
                onUpdateQty("");
                return;
              }

              if (/^\d+$/.test(rawValue)) {
                const parsed = parseInt(rawValue, 10);
                const securedValue = Math.min(item.jumlah, parsed);
                onUpdateQty(securedValue);
              }
            }}
            onBlur={() => {
              if (item.qty === "" || parseInt(item.qty, 10) < 1 || isNaN(parseInt(item.qty, 10))) {
                onUpdateQty(1);
              }
            }}
            className="h-10 w-20 rounded-none border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-black text-center text-xs text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] focus-visible:ring-0"
          />
        ) : (
          /* 🌟 Jika ALAT NON-ASET: Dikunci mati teks "1 Unit" tanpa kotak input angka */
          <span className="h-10 px-4 inline-flex items-center justify-center rounded-none border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 font-mono font-black text-xs text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)]">
            1 Unit
          </span>
        )}
      </div>
    </div>
  );
}