import { CalendarRange, X } from "lucide-react";
import { Button } from "../ui/button";
import { DatePicker } from "../atoms/DatePicker";
import { Input } from "../ui/input";

interface LoanFilterCardProps {
  startDate: string;
  endDate: string;
  searchQuery?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearchChange?: (value: string) => void;
  onClear: () => void;
}

export function LoanFilterCard({
  startDate, endDate, searchQuery, 
  onStartDateChange, onEndDateChange, onSearchChange, 
  onClear
}: LoanFilterCardProps) {
  const showSearch = !!onSearchChange;
  const isFilterActive = startDate !== "" || endDate !== "" || searchQuery !== "";

  return (
    <div className={`grid grid-cols-1 ${showSearch ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 items-end bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none`}>
      {/* Search Bar: Hanya muncul jika onSearchChange dikirim */}
      {showSearch && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest pl-0.5">Cari Alat:</label>
          <Input
            placeholder="Cari nama alat..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-11 border-2 border-zinc-950 bg-white font-mono text-xs rounded-none"
          />
        </div>
      )}

      <DatePicker label="Dari Tanggal:" value={startDate} placeholder="..." onChange={onStartDateChange} />
      <DatePicker label="Sampai Tanggal:" value={endDate} placeholder="..." onChange={onEndDateChange} />

      {/* Tombol Reset yang lebih responsif */}
      <div>
        {isFilterActive ? (
          <Button
            variant="brutal"
            onClick={onClear}
            className="w-full h-11 text-xs font-mono font-black gap-2 rounded-none bg-red-500 hover:bg-red-600 text-white border-2 border-zinc-950 transition-all tracking-wider"
          >
            <X size={13} /> Reset Semua Filter
          </Button>
        ) : (
          <div className="h-11 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-[10px] font-mono font-black tracking-widest gap-2 rounded-none ">
            <CalendarRange size={13} /> Filter Rentang Siap
          </div>
        )}
      </div>
    </div>
  );
}