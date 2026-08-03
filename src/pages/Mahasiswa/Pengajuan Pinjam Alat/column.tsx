import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, QrCode } from "lucide-react"; 

export const getColumns = (
  cart: any[],
  addToCart: (item: any) => void
): ColumnDef<any>[] => [
  {
    header: "Nama Alat / Bahan",
    cell: ({ row }) => {
      const item = row.original;
      const isBahan = item.tipe_item === "bahan";
      const namaItem = isBahan ? item.nama_bahan : item.nama_alat;
      
      // 🌟 Mengambil nama letak dengan aman baik untuk alat maupun bahan
      const lokasiLetak = item.letak?.nama_letak || item.letak || "Laboratorium";
      
      // 🌟 Kategori dinamis (mengambil dari data kategori jika ada, atau teks default)
      const kategoriItem = item.kategori?.nama_kategori || item.kategori_nama || (isBahan ? "Bahan Habis Pakai" : "Alat Laboratorium");

      const isAset = item.is_aset === true || item.is_aset === "1";
      
      // Cek status ketersediaan & jadwal dari backend
      const isAvailable = item.is_available !== false; 
      const hasBookings = item.jadwal_terbooking && item.jadwal_terbooking.length > 0;
      
      // Amankan tag list menjadi array
      const tagList = Array.isArray(item.kode_tag_list) 
        ? item.kode_tag_list 
        : (item.kode_tag ? [item.kode_tag] : []);

      return (
        <div className="py-2 text-left font-mono">
          {/* NAMA UTAMA */}
          <div className="font-sans font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight uppercase">
            {namaItem}
          </div>
          
          {/* 🌟 KATEGORI & LOKASI (Tampil untuk Alat dan Bahan) */}
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider mt-0.5 uppercase space-x-2">
            <span>Kategori: {kategoriItem}</span>
            <span>•</span>
            <span>Ruangan / Letak: {lokasiLetak}</span>
          </div>

          {/* 🌟 TAMPILKAN JADWAL ORANG LAIN JIKA ADA (Hanya muncul jika tidak bentrok) */}
          {!isBahan && hasBookings && isAvailable && (
            <div className="flex flex-col gap-1 mt-2 mb-1">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Telah Dibooking Pada:</span>
              {item.jadwal_terbooking.map((jdwl: any, idx: number) => (
                <div key={idx} className="text-[9px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 px-1.5 py-0.5 w-fit border border-zinc-200">
                  • {jdwl.mulai} - {jdwl.selesai}
                </div>
              ))}
            </div>
          )}

          {/* 🌟 TANDA / LABEL STATUS KETERSEDIAAN (Tampil merah jika jam di form bentrok) */}
          {!isBahan && !isAvailable && (
            <div className="mt-2">
              <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-red-100 text-red-800 border border-red-300 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800 uppercase tracking-widest">
                {item.status_keterangan || "Bentrokan Jadwal"}
              </span>
            </div>
          )}

          {/* KODE UNIT KHUSUS ALAT */}
          {!isBahan && isAset && (
            <div className="mt-2 space-y-1">
              <span className="block text-[8.5px] font-black text-zinc-400 tracking-wider uppercase">
                Kode Identifikasi Unit:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {tagList.length > 0 ? (
                  tagList.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 border-2 border-zinc-950 bg-zinc-100 text-zinc-950 text-[9px] font-black tracking-tight uppercase rounded-none shadow-[2px_2px_0px_0px_rgba(165,180,252,1)]"
                    >
                      <QrCode size={10} className="stroke-[3px]" />
                      {tag}
                    </span>
                  ))
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
    header: "Stok / Unit",
    cell: ({ row }) => {
      const item = row.original;
      const jumlahStok = item.jumlah ?? 1;
      return (
        <Badge
          variant="outline"
          className="font-mono font-black text-[10px] bg-zinc-50 text-zinc-800 border-zinc-950 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none uppercase"
        >
          {jumlahStok} Unit
        </Badge>
      );
    },
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const isAvailable = item.is_available !== false;
      const isAdded = cart.some((i) => i.id === item.id && i.tipe_item === item.tipe_item);
      const isHabis = (item.jumlah ?? 0) <= 0;

      // Tombol dikunci jika stok habis ATAU alat sedang dipinjam/booking di jam yang tabrakan
      const isDisabled = isHabis || !isAvailable;

      return (
        <Button
          size="sm"
          disabled={isDisabled}
          variant={isAdded ? "outline" : "brutal"}
          onClick={() => addToCart(item)}
          className={`rounded-none font-mono font-black text-xs uppercase tracking-wide ${
            !isAvailable 
              ? "bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600 shadow-none" 
              : ""
          }`}
        >
          {!isAvailable ? (
            "Tidak Tersedia"
          ) : isAdded ? (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span>Di Keranjang</span>
            </div>
          ) : (
            "Pinjam"
          )}
        </Button>
      );
    },
  },
];