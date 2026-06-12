import type { ReactNode } from "react";

export function ModalOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      {children}
    </div>
  );
}
