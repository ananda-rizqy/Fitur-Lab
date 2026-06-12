import type { Table } from "@tanstack/react-table";
import type { Device } from "../../types/Device";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";

interface Props<TData> {
  table: Table<TData>;
}

export function DevicePagination<TData>({ table }: Props<TData>) {
  const pageCount = table.getPageCount();
  const current = table.getState().pagination.pageIndex + 1;

  const visible = 3;

  let start = Math.max(1, current - Math.floor(visible / 2));
  let end = start + visible - 1;

  if (end > pageCount) {
    end = pageCount;
    start = Math.max(1, end - visible + 1);
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* PREV */}
        <PaginationItem>
          <PaginationPrevious
            size="default"
            onClick={() => table.previousPage()}
            className={
              !table.getCanPreviousPage()
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

        {/* LEFT ... */}
        {start > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* PAGE NUMBERS */}
        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
          (page) => (
            <PaginationItem key={page}>
              <PaginationLink
                size="default"
                isActive={current === page}
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* RIGHT ... */}
        {end < pageCount && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* NEXT */}
        <PaginationItem>
          <PaginationNext
            size="default"
            onClick={() => table.nextPage()}
            className={
              !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
