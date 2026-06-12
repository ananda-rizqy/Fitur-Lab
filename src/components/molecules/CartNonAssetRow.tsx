import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Swal from "sweetalert2";

interface CartNonAssetRowProps {
  item: {
    id: number;
    nama_alat: string;
    letak: string;
    jumlah: number;
    qty: any; // Menerima string kosong saat dihapus
  };
  onRemove: () => void;
  onUpdateQty: (newQty: any) => void;
}

export function CartNonAssetRow({
  item,
  onRemove,
  onUpdateQty,
}: CartNonAssetRowProps) {
  return (
    <div className="border-2 border-zinc-950 dark:border-zinc-800 px-8 py-8 transition-colors bg-zinc-50 dark:bg-zinc-950/40 gap-4 flex flex-col select-none rounded-none font-mono text-left shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
      <div className="flex justify-between items-center text-left flex-1">
        <div className="overflow-hidden flex flex-col">
          <span className="font-sans font-black text-xs text-zinc-900 dark:text-zinc-100 truncate block uppercase">
            {item.nama_alat}
          </span>
          <span className="text-xs font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest mt-0.5 block uppercase">
            Ruangan : {item.letak}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            Swal.fire({
              title: "Hapus Item?",
              text: `Yakin ingin mengeluarkan ${item.nama_alat} dari berkas peminjaman?`,
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
        <Input
          /* 🌟 KUNCI UTAMA: Ubah ke type="text" agar browser tidak memaksakan angka 1 saat backspace */
          type="text" 
          inputMode="numeric" // Memastikan keyboard mobile tetap memunculkan angka
          pattern="[0-9]*"    // Hanya menerima karakter angka
          
          value={item.qty === 0 || item.qty === null || item.qty === undefined ? "" : item.qty}
          
          onChange={(e) => {
            const rawValue = e.target.value;

            // 🌟 JIKA DIHAPUS TOTAL: Langsung loloskan string kosong tanpa ganjalan minimal browser
            if (rawValue === "") {
              onUpdateQty("");
              return;
            }

            // Validasi: Hanya proses jika yang diketik adalah murni karakter angka
            if (/^\d+$/.test(rawValue)) {
              const parsed = parseInt(rawValue, 10);
              
              // Kunci angka maksimal agar mahasiswa tidak menginput melebihi sisa stok realtime lab
              const securedValue = Math.min(item.jumlah, parsed);
              onUpdateQty(securedValue);
            }
          }}
          
          // SAFETY NET: Saat mahasiswa mengalihkan kursor (klik luar), jika masih kosong baru paksa balikan ke angka 1
          onBlur={() => {
            if (item.qty === "" || parseInt(item.qty, 10) < 1 || isNaN(parseInt(item.qty, 10))) {
              onUpdateQty(1);
            }
          }}
          className="h-10 w-20 rounded-none border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-black text-center text-xs text-zinc-900 dark:text-zinc-50 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] focus-visible:ring-0"
        />
      </div>
    </div>
  );
}