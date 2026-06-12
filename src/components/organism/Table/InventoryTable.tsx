import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";

export const InventoryTable = ({
  table,
  loading,
  columnsCount,
}: {
  table: TanstackTable<any>;
  loading: boolean;
  columnsCount: number;
}) => (
  <div className="w-full  border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-colors duration-300">
    <Table>
      <TableHeader className="bg-zinc-950 dark:bg-zinc-950 border-b-2 border-zinc-950">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="hover:bg-transparent border-none"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-white font-mono font-black text-[10px]  tracking-widest h-12 text-left px-4"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow
              key={i}
              className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
            >
              <TableCell colSpan={columnsCount} className="p-4">
                <Skeleton className="h-10 w-full  bg-zinc-100 dark:bg-zinc-800" />
              </TableCell>
            </TableRow>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors border-b-2 border-zinc-100 dark:border-zinc-800/60 last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="py-4 px-4 font-sans font-bold text-xs text-zinc-800 dark:text-zinc-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnsCount}
              className="h-32 text-center text-zinc-400 dark:text-zinc-600 font-mono font-black  text-xs tracking-widest bg-zinc-50/50 dark:bg-zinc-950/20"
            >
              Data Kosong / No Records
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
