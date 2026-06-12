import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ToolbarSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  classFilter?: string;
  setClassFilter?: (value: string) => void;
  uniqueClasses?: string[];
  
  pageSize: number;
  table: any;
  setCurrentPage: (page: number) => void;
}

export function ToolbarSearch({
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
  classFilter,
  setClassFilter,
  uniqueClasses,
  pageSize,
  table,
  setCurrentPage,
}: ToolbarSearchProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <Input
          placeholder="Cari data..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-black tracking-wide rounded-none shadow-none focus-visible:ring-0"
        />

        {/* Render Status Filter jika ada */}
        {setStatusFilter && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-none tracking-wide text-left">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="ongoing">Dipinjam</SelectItem>
              <SelectItem value="returned">Dikembalikan</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Render Class Filter jika ada */}
        {setClassFilter && uniqueClasses && (
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full sm:w-44 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-none tracking-wide text-left">
              <SelectValue placeholder="Semua kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kelas</SelectItem>
              {uniqueClasses.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Bagian Page Size tetap sama... */}
      <div className="flex items-center gap-3">
        {/* ... kode page size Anda ... */}
      </div>
    </div>
  );
}