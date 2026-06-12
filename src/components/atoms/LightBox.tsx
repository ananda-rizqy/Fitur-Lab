import { Button } from "../ui/button";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export function Lightbox({ src, onClose }: LightboxProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-full h-11 w-11 p-0 border border-zinc-800"
        onClick={onClose}
      >
        <X size={20} />
      </Button>
      <img
        src={src}
        className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500 bg-zinc-900"
        alt="Detail Dokumentasi Ruang Lab"
      />
    </div>
  );
}
