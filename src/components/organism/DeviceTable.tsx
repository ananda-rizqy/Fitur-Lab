import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { flexRender } from "@tanstack/react-table";

export function DeviceTable({ table, columns, meta }: any) {
  if (meta && table?.options) {
    table.options.meta = meta;
  }

  if (!table || typeof table.getRowModel !== "function") {
    return (
      <Table className="border-2 rounded-2xl">
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns?.length || 1}
              className="text-center py-12 font-bold text-zinc-400 font-mono"
            >
              MEMPERBARUI STRUKTUR DATA...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  const rows = table.getRowModel()?.rows || [];

  return (
    <Table className="border-2 rounded-2xl">
      <TableHeader>
        {table.getHeaderGroups().map((group: any) => (
          <TableRow key={group.id}>
            {group.headers.map((header: any) => (
              <TableHead key={header.id}>
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
        {rows.length > 0 ? (
          rows.map((row: any) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell: any) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns?.length || 1}
              className="text-center py-12 font-bold text-zinc-400 font-mono uppercase tracking-widest"
            >
              No result…
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
