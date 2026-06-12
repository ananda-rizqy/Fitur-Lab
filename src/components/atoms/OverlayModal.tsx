import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface OverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function OverlayModal({
  isOpen,
  onClose,
  children,
  title,
}: OverlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-lg bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-0 rounded-none shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] dark:shadow-none gap-0 focus-visible:outline-none">
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </div>

        {children}
      </DialogContent>
    </Dialog>
  );
}
