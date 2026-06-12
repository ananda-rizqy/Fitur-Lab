import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export const CartDrawer = ({
  isOpen,
  onClose,
  children,
  onNext,
  step,
}: any) => (
  <Drawer open={isOpen} onOpenChange={onClose} direction="right">
    <DrawerContent className="h-full ml-auto w-full max-w-md rounded-none">
      <DrawerHeader className="border-b">
        <DrawerTitle className=" font-black text-2xl">
          {step === "form" ? "Detail Peminjaman" : "Keranjang Alat"}
        </DrawerTitle>
      </DrawerHeader>

      <ScrollArea className="flex-1 p-6">{children}</ScrollArea>

      <DrawerFooter className="border-t ">
        <Button size="lg" variant={"brutal"} onClick={onNext} color="blue">
          {step === "cart" ? "Lanjut ke Form" : "Kirim Pengajuan"}
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
