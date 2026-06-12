import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RefreshCw, Search } from "lucide-react";

interface ToolbarHistoryProps {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function ToolbarHistory({
  globalFilter,
  setGlobalFilter,
  pageSize,
  setPageSize,
  onRefresh,
  loading,
}: ToolbarHistoryProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4  border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
      {/* Kolom Kiri: Search & Refresh */}
      <div className="flex items-center gap-2.5 w-full md:w-auto relative">
        <div className="relative w-full md:w-72 flex items-center">
          <Search
            size={14}
            className="absolute left-3.5 text-zinc-400 dark:text-zinc-600"
          />
          <Input
            placeholder="Cari jejak riwayat laboratorium..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-4 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 bg-white dark:bg-zinc-950 font-medium text-xs h-11"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="rounded-xl h-11 w-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 shrink-0"
        >
          <RefreshCw
            size={14}
            className={
              loading ? "animate-spin text-zinc-900 dark:text-white" : ""
            }
          />
        </Button>
      </div>

      {/* Kolom Kanan: Page Size Selector */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Baris per halaman:
        </span>
        <Select
          value={`${pageSize}`}
          onValueChange={(v) => setPageSize(Number(v))}
        >
          <SelectTrigger className="w-20 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="font-mono text-xs font-bold">
            {[5, 10, 25, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
