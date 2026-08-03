import { CartAssetRow } from "../molecules/CartAssetRow";
import { CartNonAssetRow } from "../molecules/CartNonAssetRow";

interface CartItem {
  id: number;
  tipe_item?: "alat" | "bahan"; // 👈 Ditambahkan untuk membedakan alat dan bahan
  nama_alat?: string;
  nama_bahan?: string;
  letak: string;
  jumlah: number;
  kode_tag_list?: string[];
  is_aset?: boolean | string; 
  selected_tags: string[];
  qty: number;
}

interface CartItemListProps {
  cart: CartItem[];
  onRemove: (id: number, tipeItem?: string) => void; // 👈 Mendukung tipeItem agar penghapusan akurat
  onUpdateTags: (id: number, newTags: string[]) => void;
  onUpdateQty: (id: number, newQty: number) => void;
}

export function CartItemList({
  cart,
  onRemove,
  onUpdateTags,
  onUpdateQty,
}: CartItemListProps) {
  if (!cart || cart.length === 0) {
    return (
      <div className="py-8 text-center font-mono text-xs text-zinc-500 uppercase">
        Keranjang peminjaman masih kosong.
      </div>
    );
  }

  return (
    <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-5 custom-scrollbar scrollbar-none text-left">
      {cart.map((item) => {
        // Jika item adalah bahan, arahkan ke komponen non-aset atau render penanganan khusus bahan
        const isBahan = item.tipe_item === "bahan";
        const isAsetObj = !isBahan && (item.is_aset === true || item.is_aset === "1");
        
        // Buat key unik agar tidak bentrok ID antara alat dan bahan
        const uniqueKey = `${item.tipe_item || "alat"}-${item.id}`;

        return isAsetObj ? (
          <CartAssetRow
            key={uniqueKey}
            item={item as any} 
            onRemove={() => onRemove(item.id, item.tipe_item)}
            onUpdateTags={(newTags) => onUpdateTags(item.id, newTags)}
          />
        ) : (
          <CartNonAssetRow
            key={uniqueKey}
            item={item as any} 
            onRemove={() => onRemove(item.id, item.tipe_item)}
            onUpdateQty={(newQty) => onUpdateQty(item.id, newQty)}
          />
        );
      })}
    </div>
  );
}