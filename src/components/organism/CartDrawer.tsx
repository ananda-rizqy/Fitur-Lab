import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
  onNext: () => void;
  isFormStep?: boolean;
  step?: string;
  cartCount?: number;
  loading?: boolean;
}

export function CartDrawer({
  isOpen,
  onClose,
  children,
  onNext,
  isFormStep,
  step,
  loading = false,
}: CartDrawerProps) {
  const showForm = isFormStep === true || step === "form";

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="h-full ml-auto w-full max-w-md rounded-none font-mono text-left bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 dark:border-zinc-800">
        <DrawerHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 py-4">
          <DrawerTitle className="font-black text-xl uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
            {showForm ? "Detail Peminjaman" : "Keranjang Alat & Bahan"}
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6 h-[calc(100vh-140px)]">
          {children}
        </ScrollArea>

        <DrawerFooter className="border-t-2 border-zinc-950 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900">
          <Button 
            size="lg" 
            variant="brutal" 
            onClick={onNext} 
            disabled={loading}
            className="w-full rounded-none font-black text-xs uppercase tracking-widest bg-black text-white shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]"
          >
            {loading 
              ? "Memproses..." 
              : showForm 
                ? "Kirim Pengajuan" 
                : "Lanjut ke Form"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}