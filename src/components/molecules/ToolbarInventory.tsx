import React from "react";
import { Search, RefreshCw } from "lucide-react";

interface ToolbarInventoryProps {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  conditionFilter: string;
  setConditionFilter: (v: string) => void;
  statusFilter: string;        
  setStatusFilter: (v: string) => void; 
  dateFilter: string;
  setDateFilter: (value: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onRefresh: () => void;
  loading: boolean;
  rooms: string[];
}

export function ToolbarInventory({ 
  globalFilter, 
  setGlobalFilter, 
  conditionFilter, 
  setConditionFilter, 
  statusFilter, 
  setStatusFilter,
  dateFilter,    
  setDateFilter, 
  pageSize, 
  setPageSize, 
  onRefresh, 
  loading, 
  rooms 
}: ToolbarInventoryProps) {
  return (
    /* CONTAINER TOOLBAR: TEMA RETRO NEO-BRUTALISME */
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-none border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full font-mono text-xs text-left">
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-1 w-full">
        
        {/* 1. INPUT PENCARIAN SIKU TAJAM */}
        <div className="relative w-full lg:w-64 flex items-center">
          <Search
            size={14}
            className="absolute left-3.5 text-zinc-950 dark:text-zinc-400 z-10 font-black"
          />
          <input
            type="text"
            placeholder="CARI NAMA ALAT"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 rounded-none border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 font-black text-xs h-11 w-full text-zinc-900 dark:text-zinc-50 uppercase tracking-tight focus:outline-none focus:bg-zinc-50"
          />
        </div>

        {/* CONTAINER FILTERS DROPDOWN & REFRESH */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
          
          {/* 2. DROPDOWN PILIHAN RUANGAN LAB SECARA DINAMIS */}
          <div className="relative w-full md:w-52">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full h-11 pl-4 pr-10 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-700 rounded-none font-black text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none uppercase tracking-wider cursor-pointer appearance-none"
            >
              <option value="all">SEMUA RUANGAN LAB</option>
              {Array.isArray(rooms) && rooms.map((roomName) => (
                <option key={roomName} value={roomName}>
                  {roomName.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-950 dark:text-white font-black border-l-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              ▼
            </div>
          </div>

          {/* 3. 🌟 BARU: DROPDOWN ELEMEN UNTUK SEMUA KONDISI */}
          <div className="relative w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 pl-4 pr-10 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-700 rounded-none font-black text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none uppercase tracking-wider cursor-pointer appearance-none"
            >
              <option value="all">SEMUA KONDISI</option>
              <option value="baik">KONDISI BAIK</option>
              <option value="rusak">KONDISI RUSAK</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-950 dark:text-white font-black border-l-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              ▼
            </div>
          </div>

          {/* 4. TOMBOL REFRESH DATA SINKRONISASI MANIFES */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="h-11 w-11 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-200 flex items-center justify-center rounded-none hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 shrink-0 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
            title="Refresh Data"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-zinc-900 dark:text-white" : "font-black"}
            />
          </button>

        </div>
      </div>

      {/* 5. AREA KANAN: CONTROLLER BARIS PER HALAMAN */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full xl:w-auto border-t-2 xl:border-t-0 pt-4 xl:pt-0 border-zinc-200 dark:border-zinc-800 shrink-0">
        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          BARIS PER HALAMAN:
        </span>
        
        <div className="relative w-24">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-full h-11 pl-4 pr-8 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-700 rounded-none font-mono font-black text-xs text-zinc-900 dark:text-zinc-50 focus:outline-none cursor-pointer appearance-none"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} BARIS
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-950 dark:text-white font-black border-l-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
            ▼
          </div>
        </div>

      </div>

    </div>
  );
} 