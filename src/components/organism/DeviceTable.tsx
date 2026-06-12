import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { flexRender } from "@tanstack/react-table";

export function DeviceTable({ table, columns }: any) {
  return (
    <Table className="border-2 rounded-2xl">
      <TableHeader>
        {table.getHeaderGroups().map((group: any) => (
          <TableRow key={group.id}>
            {group.headers.map((header: any) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row: any) => (
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
            <TableCell colSpan={columns.length}>No result…</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
