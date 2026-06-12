import React from "react";
import { flexRender } from "@tanstack/react-table";

interface InventoryTableProps {
  table: any;
  loading: boolean;
  header?: string;
  columnsCount?: number; 
}

export function InventoryTable({
  table,
  loading,
  header,
  columnsCount,
}: InventoryTableProps) {
  if (loading) {
    return (
      <div className="border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-20 flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
        <p className="font-mono font-black text-xs tracking-widest uppercase text-zinc-500">
          Memuat Data Inventaris...
        </p>
      </div>
    );
  }

  const safeColSpan = columnsCount || table.getAllColumns().length || 6;

  return (
    <div
      className="
        bg-white
        dark:bg-zinc-900
        border-2
        border-zinc-950
        dark:border-zinc-800
        rounded-none
        overflow-hidden
        shadow-[4px_4px_0px_0px_rgba(9,9,11,1)]
        dark:shadow-none
      "
    >
      {header && (
        <div className="px-6 py-5 border-b-2 border-zinc-950 dark:border-zinc-800">
          <h3 className="font-mono font-black text-sm uppercase tracking-widest text-zinc-900 dark:text-white">
            {header}
          </h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr
                key={headerGroup.id}
                className="border-b-2 border-zinc-950 dark:border-zinc-800"
              >
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className="
                      px-5
                      py-5
                      text-left
                      font-mono
                      font-black
                      text-xs
                      uppercase
                      tracking-widest
                      text-zinc-900
                      dark:text-zinc-100
                      whitespace-nowrap
                    "
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={safeColSpan} 
                  className="
                    py-20
                    text-center
                    font-mono
                    font-black
                    text-xs
                    uppercase
                    tracking-widest
                    text-zinc-400
                  "
                >
                  Tidak Ada Data Inventaris
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: any) => (
                <tr
                  key={row.id}
                  className="
                    border-b
                    border-zinc-200
                    dark:border-zinc-800
                    hover:bg-zinc-50
                    dark:hover:bg-zinc-950/40
                    transition-colors
                  "
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className="
                        px-5
                        py-7
                        text-sm
                        text-zinc-700
                        dark:text-zinc-300
                        align-middle
                      "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}