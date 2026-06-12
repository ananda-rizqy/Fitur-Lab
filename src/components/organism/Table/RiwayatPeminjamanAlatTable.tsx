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

interface RiwayatPeminjamanAlatTableProps {
  table: TanstackTable<any>;
  loading: boolean;
  columnsCount: number;
}

export const RiwayatPeminjamanAlatTable = ({
  table,
  loading,
  columnsCount,
}: RiwayatPeminjamanAlatTableProps) => (
  <Table>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody>
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={columnsCount} className="p-4">
              <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-none border border-zinc-300 dark:border-zinc-700" />
            </TableCell>
          </TableRow>
        ))
      ) : table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columnsCount}
            className="h-40 text-center font-mono font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-widest"
          >
            Data tidak ditemukan
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);
