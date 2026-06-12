import { CartAssetRow } from "../molecules/CartAssetRow";
import { CartNonAssetRow } from "../molecules/CartNonAssetRow";

interface CartItem {
  id: number;
  nama_alat: string;
  letak: string;
  jumlah: number;
  kode_tag_list?: string[];
  is_aset?: boolean | string; 
  selected_tags: string[];
  qty: number;
}

interface CartItemListProps {
  cart: CartItem[];
  onRemove: (id: number) => void;
  onUpdateTags: (id: number, newTags: string[]) => void;
  onUpdateQty: (id: number, newQty: number) => void;
}

export function CartItemList({
  cart,
  onRemove,
  onUpdateTags,
  onUpdateQty,
}: CartItemListProps) {
  return (
    <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-5 custom-scrollbar scrollbar-none">
      {cart.map((item) => {
        // 🌟 KUNCI UTAMA: Validasi ketat string "1" atau boolean true sebagai penentu aset
        const isAsetObj = item.is_aset === true || item.is_aset === "1";

        return isAsetObj ? (
          <CartAssetRow
            key={item.id}
            item={item as any} // Cast as any jika interface internal CartAssetRow masih kaku boolean
            onRemove={() => onRemove(item.id)}
            onUpdateTags={(newTags) => onUpdateTags(item.id, newTags)}
          />
        ) : (
          <CartNonAssetRow
            key={item.id}
            item={item as any} // Cast as any demi kelancaran compiler sub-komponen
            onRemove={() => onRemove(item.id)}
            onUpdateQty={(newQty) => onUpdateQty(item.id, newQty)}
          />
        );
      })}
    </div>
  );
}