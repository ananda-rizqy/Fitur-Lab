import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import Swal from "sweetalert2"; 

interface CartAssetRowProps {
  item: any;
  onRemove: () => void;
  onUpdateTags: (tags: string[]) => void;
}

export function CartAssetRow({
  item,
  onRemove,
  onUpdateTags,
}: CartAssetRowProps) {
  
  const handleRemove = () => {
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
      if (result.isConfirmed) {
        onRemove();
      }
    });
  };

  return (
    <div className="border-2 border-zinc-950 dark:border-zinc-800 px-8 py-8 transition-colors bg-zinc-50 dark:bg-zinc-950/40 gap-4 flex flex-col select-none rounded-none font-mono text-left shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
      
      {/* HEADER INFORMASI ALAT */}
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
          onClick={handleRemove} 
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-transparent rounded-none shrink-0 transition-colors"
        >
          <Trash2 size={14} className="stroke-[2.5px]" />
        </Button>
      </div>

      <div className="space-y-3 w-full">
        {item.selected_tags.map((tag: string, idx: number) => (
          <div key={idx} className="flex gap-2 items-center w-full">
            <Select
              value={tag}
              onValueChange={(v) => {
                const newTags = [...item.selected_tags];
                newTags[idx] = v;
                onUpdateTags(newTags);
              }}
            >
              <SelectTrigger className="rounded-none h-10 text-[10px] font-black uppercase border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="PILIH KODE UNIT PERANGKAT" />
              </SelectTrigger>
              <SelectContent className="font-mono text-xs font-black rounded-none border-2 border-zinc-950 uppercase bg-white dark:bg-zinc-900">
                {item.kode_tag_list?.map((t: string) => (
                  <SelectItem key={t} value={t} className="rounded-none font-black">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {item.selected_tags.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onUpdateTags(
                    item.selected_tags.filter((_: any, i: number) => i !== idx),
                  )
                }
                className="h-10 w-10 border-2 border-zinc-950 dark:border-zinc-700 rounded-none text-red-500 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
              >
                <Minus size={14} className="stroke-[3px]" />
              </Button>
            )}
          </div>
        ))}

        {item.kode_tag_list && item.kode_tag_list.length > item.selected_tags.length && (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-none border-dashed border-2 border-zinc-400 hover:border-zinc-950 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-950 bg-transparent py-5"
            onClick={() => onUpdateTags([...item.selected_tags, ""])}
          >
            <Plus size={12} className="mr-1 stroke-[3px]" /> Tambah Unit Berseri
          </Button>
        )}
      </div>
    </div>
  );
}