import type { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Props<TData> {
  table: Table<TData>;
}

export function DevicePageSize<TData>({ table }: Props<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Page Size: {table.getState().pagination.pageSize}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {[5, 10, 15].map((size) => (
          <DropdownMenuItem key={size} onClick={() => table.setPageSize(size)}>
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
